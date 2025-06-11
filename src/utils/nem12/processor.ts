import { STREAMING_BATCH_SIZE } from "@/constants/file";
import { parseCSVLine } from "./parser";
import { MeterReading, NEM12_RECORD_TYPES } from "@/types/nem12";
import {
  validateNEM12Record,
  validateNMIHeader,
  validateIntervalData,
  validateEndRecord,
} from "./validator";

function calculateTimestamp(intervalDate: string, index: number, intervalLength: number): string {
  const hour = Math.floor((index * intervalLength) / 60);
  const minute = (index * intervalLength) % 60;
  return `${intervalDate} ${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}:00`;
}

function processRecord(
  record: string[],
  currentNMI: string,
  intervalLength: number,
  lineNumber: number
): MeterReading[] {
  validateIntervalData(record, lineNumber);
  const readings: MeterReading[] = [];
  const intervalDate = record[1];

  // i start at 2, as 0 = record type, 1 = interval date
  for (let i = 2; i < record.length; i++) {
    const consumption = record[i];
    // Skip empty or invalid consumption values
    if (!consumption || isNaN(Number(consumption))) {
      continue;
    }

    const consumptionValue = Number(consumption);
    // Skip negative consumption values
    if (consumptionValue < 0) {
      continue;
    }

    const timestamp = calculateTimestamp(intervalDate, i - 2, intervalLength);
    readings.push({
      nmi: currentNMI,
      timestamp,
      consumption: consumptionValue,
    });
  }
  return readings;
}

export async function* processNEM12Stream(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<MeterReading[]> {
  let currentNMI = "";
  let intervalLength = 30;
  let currentBatch: MeterReading[] = [];
  let lineNumber = 0;
  let hasHeader = false;

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || ""; // Keep the last incomplete line in the buffer

      for (const line of lines) {
        lineNumber++;
        if (!line.trim()) continue;

        try {
          const record = parseCSVLine(line);
          // Skip empty records
          if (record.length === 0) continue;

          const recordType = validateNEM12Record(record, lineNumber);

          if (recordType === NEM12_RECORD_TYPES.HEADER) {
            if (hasHeader) {
              // Skip duplicate headers instead of throwing error
              continue;
            }
            hasHeader = true;
          } else if (recordType === NEM12_RECORD_TYPES.NMI_DATA_DETAILS) {
            try {
              const header = validateNMIHeader(record, lineNumber);
              currentNMI = header.nmi;
              intervalLength = header.intervalLength;
            } catch {
              // Skip invalid NMI headers
              continue;
            }
          } else if (recordType === NEM12_RECORD_TYPES.INTERVAL_DATA && currentNMI) {
            try {
              const readings = processRecord(record, currentNMI, intervalLength, lineNumber);
              if (readings.length > 0) {
                currentBatch.push(...readings);

                if (currentBatch.length >= STREAMING_BATCH_SIZE) {
                  yield currentBatch;
                  currentBatch = [];
                }
              }
            } catch {
              // Skip invalid interval data
              continue;
            }
          } else if (recordType === NEM12_RECORD_TYPES.END) {
            validateEndRecord(record, currentNMI, lineNumber);
          }
        } catch {
          // Skip lines that can't be parsed
          continue;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  // Process any remaining data in the buffer
  if (buffer.trim()) {
    lineNumber++;
    try {
      const record = parseCSVLine(buffer);
      if (record.length > 0) {
        const recordType = validateNEM12Record(record, lineNumber);

        if (recordType === NEM12_RECORD_TYPES.INTERVAL_DATA && currentNMI) {
          try {
            const readings = processRecord(record, currentNMI, intervalLength, lineNumber);
            if (readings.length > 0) {
              currentBatch.push(...readings);
            }
          } catch {
            // Skip invalid interval data
          }
        }
      }
    } catch {
      // Skip lines that can't be parsed
    }
  }

  // Yield any remaining records
  if (currentBatch.length > 0) {
    yield currentBatch;
  }

  // If no header was found, yield an empty batch instead of throwing error
  if (!hasHeader) {
    yield [];
  }
}
