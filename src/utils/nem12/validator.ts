import {
  NEM12_RECORD_TYPES,
  NEM12RecordType,
  NEM12ValidationError,
  CSVRecord,
  NMIHeader,
} from "@/types/nem12";

export function validateNEM12Record(record: CSVRecord, lineNumber: number): NEM12RecordType {
  const recordType = record[0];

  if (!Object.values(NEM12_RECORD_TYPES).includes(recordType as NEM12RecordType)) {
    throw new NEM12ValidationError(`Invalid record type: ${recordType}`, recordType, lineNumber);
  }

  return recordType as NEM12RecordType;
}

export function validateNMIHeader(record: CSVRecord, lineNumber: number): NMIHeader {
  if (record.length < 9) {
    throw new NEM12ValidationError(
      "NMI Data Details record must have at least 9 fields",
      NEM12_RECORD_TYPES.NMI_DATA_DETAILS,
      lineNumber
    );
  }

  const nmi = record[1];
  const intervalLength = parseInt(record[8], 10);

  if (!nmi || nmi.length !== 10) {
    throw new NEM12ValidationError(
      "Invalid NMI format",
      NEM12_RECORD_TYPES.NMI_DATA_DETAILS,
      lineNumber
    );
  }

  if (isNaN(intervalLength) || intervalLength <= 0 || intervalLength > 60) {
    throw new NEM12ValidationError(
      "Invalid interval length",
      NEM12_RECORD_TYPES.NMI_DATA_DETAILS,
      lineNumber
    );
  }

  return { nmi, intervalLength };
}

export function validateIntervalData(record: CSVRecord, lineNumber: number): void {
  if (record.length < 3) {
    throw new NEM12ValidationError(
      "Interval Data record must have at least 3 fields",
      NEM12_RECORD_TYPES.INTERVAL_DATA,
      lineNumber
    );
  }

  const intervalDate = record[1];
  if (!/^\d{8}$/.test(intervalDate)) {
    throw new NEM12ValidationError(
      "Invalid interval date format",
      NEM12_RECORD_TYPES.INTERVAL_DATA,
      lineNumber
    );
  }
}

export function validateEndRecord(record: CSVRecord, currentNMI: string, lineNumber: number): void {
  if (record.length < 2 || record[1] !== currentNMI) {
    throw new NEM12ValidationError("Invalid end record", NEM12_RECORD_TYPES.END, lineNumber);
  }
}
