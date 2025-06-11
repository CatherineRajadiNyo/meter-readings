import { STREAMING_BATCH_SIZE } from "@/constants/file";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface MeterReading {
  nmi: string;
  timestamp: string;
  consumption: number;
}

type CSVRecord = string[];

function parseCSVLine(line: string): CSVRecord {
  // Simple CSV parser that handles quoted fields and commas
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Push the last field
  result.push(current.trim());

  // Remove quotes from fields
  return result.map((field) => field.replace(/^"|"$/g, ""));
}

function processRecord(
  record: CSVRecord,
  currentNMI: string,
  intervalLength: number
): MeterReading[] {
  const readings: MeterReading[] = [];
  const intervalDate = record[1];

  // i start at 2, as 0 = record type, 1 = interval date
  for (let i = 2; i < record.length; i++) {
    const consumption = record[i];
    if (consumption && !isNaN(Number(consumption))) {
      const hour = Math.floor(((i - 2) * intervalLength) / 60);
      const minute = ((i - 2) * intervalLength) % 60;
      const timestamp = `${intervalDate} ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;

      readings.push({
        nmi: currentNMI,
        timestamp,
        consumption: Number(consumption),
      });
    }
  }
  return readings;
}

async function* processNEM12Stream(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<MeterReading[]> {
  let currentNMI = "";
  let intervalLength = 30;
  let currentBatch: MeterReading[] = [];

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
        if (!line.trim()) continue;

        const record = parseCSVLine(line);
        if (!record.length) continue;

        const recordType = record[0];

        if (recordType === "200") {
          currentNMI = record[1];
          intervalLength = parseInt(record[8], 10);
        } else if (recordType === "300" && currentNMI) {
          const readings = processRecord(record, currentNMI, intervalLength);
          currentBatch.push(...readings);

          if (currentBatch.length >= STREAMING_BATCH_SIZE) {
            yield currentBatch;
            currentBatch = [];
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  // Process any remaining data in the buffer
  if (buffer.trim()) {
    const record = parseCSVLine(buffer);
    if (record.length) {
      const recordType = record[0];
      if (recordType === "300" && currentNMI) {
        const intervalDate = record[1];
        for (let i = 2; i < record.length; i++) {
          const consumption = record[i];
          if (consumption && !isNaN(Number(consumption))) {
            const hour = Math.floor(((i - 2) * intervalLength) / 60);
            const minute = ((i - 2) * intervalLength) % 60;
            const timestamp = `${intervalDate} ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;

            currentBatch.push({
              nmi: currentNMI,
              timestamp,
              consumption: Number(consumption),
            });
          }
        }
      }
    }
  }

  // Yield any remaining records
  if (currentBatch.length > 0) {
    yield currentBatch;
  }
}

function generateSQLStatements(readings: MeterReading[]): string {
  if (readings.length === 0) return "";

  const values = readings
    .map((reading) => `('${reading.nmi}', '${reading.timestamp}', ${reading.consumption})`)
    .join(",\n    ");

  return `INSERT INTO meter_readings (nmi, timestamp, consumption) VALUES\n    ${values};`;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Create a new TransformStream for streaming the response
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Start processing in the background
  (async () => {
    try {
      const blob = file as Blob;
      const fileStream = blob.stream();
      let totalBatches = 0;
      let totalReadings = 0;

      for await (const batch of processNEM12Stream(fileStream)) {
        const sqlStatement = generateSQLStatements(batch);
        totalBatches++;
        totalReadings += batch.length;

        // Send progress update
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "progress",
              sql: sqlStatement,
              totalBatches,
              totalReadings,
            })}\n\n`
          )
        );
      }

      // Send completion message
      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "complete",
            totalBatches,
            totalReadings,
          })}\n\n`
        )
      );
    } catch (e: unknown) {
      // Send error message
      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "error",
            error: e instanceof Error ? e.message : "Failed to process file",
          })}\n\n`
        )
      );
    } finally {
      await writer.close();
    }
  })();

  // Return streaming response
  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
