import { MeterReading } from "@/types/nem12";

/**
 * Generates SQL INSERT statements for meter readings.
 * Creates a single INSERT statement that can insert multiple meter readings efficiently.
 *
 * @param {MeterReading[]} readings - Array of meter readings to be inserted
 * @returns {string} A complete SQL INSERT statement, or an empty string if no readings are provided
 *
 * @example
 * const readings = [
 *   { nmi: "NMI123", timestamp: "2024-01-01T00:00:00Z", consumption: 1.5 },
 *   { nmi: "NMI123", timestamp: "2024-01-01T00:30:00Z", consumption: 2.0 }
 * ];
 * const sql = generateSQLStatements(readings);
 * // Returns: INSERT INTO meter_readings (nmi, timestamp, consumption) VALUES
 * //     ('NMI123', '2024-01-01T00:00:00Z', 1.5),
 * //     ('NMI123', '2024-01-01T00:30:00Z', 2.0);
 */
export function generateSQLStatements(readings: MeterReading[]): string {
  if (readings.length === 0) return "";

  const values = readings
    .map((reading) => `('${reading.nmi}', '${reading.timestamp}', ${reading.consumption})`)
    .join(",\n    ");

  return `INSERT INTO meter_readings (nmi, timestamp, consumption) VALUES\n    ${values};`;
}
