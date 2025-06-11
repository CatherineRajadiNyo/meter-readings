export * from "./errors";
export * from "./records";

// NEM12 specific constants
export const NEM12_RECORD_TYPES = {
  HEADER: "100",
  NMI_DATA_DETAILS: "200",
  INTERVAL_DATA: "300",
  INTERVAL_EVENT: "400",
  B2B_DETAILS: "500",
  END: "900",
} as const;

export type NEM12RecordType = (typeof NEM12_RECORD_TYPES)[keyof typeof NEM12_RECORD_TYPES];
