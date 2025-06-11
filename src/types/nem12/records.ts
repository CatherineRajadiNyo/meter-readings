/**
 * Represents a single meter reading with NMI, timestamp, and consumption data.
 * @interface MeterReading
 * @property {string} nmi - The National Meter Identifier (NMI) for the meter
 * @property {string} timestamp - ISO 8601 formatted timestamp of the reading
 * @property {number} consumption - The consumption value in kWh
 */
export interface MeterReading {
  nmi: string;
  timestamp: string;
  consumption: number;
}

/**
 * Represents the header information for a specific NMI in the NEM12 file.
 * @interface NMIHeader
 * @property {string} nmi - The National Meter Identifier (NMI) for the meter
 * @property {number} intervalLength - The length of the interval in minutes
 */
export interface NMIHeader {
  nmi: string;
  intervalLength: number;
}

/**
 * Represents a single record from the CSV file as an array of strings.
 * Each element in the array corresponds to a column in the CSV file.
 * @typedef {string[]} CSVRecord
 */
export type CSVRecord = string[];
