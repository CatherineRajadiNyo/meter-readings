/**
 * Custom error class for CSV parsing errors.
 * Extends the base Error class to include line number information.
 * @class CSVParseError
 * @extends {Error}
 * @property {number} lineNumber - The line number where the parsing error occurred
 */
export class CSVParseError extends Error {
  constructor(message: string, public lineNumber: number) {
    super(message);
    this.name = "CSVParseError";
  }
}

/**
 * Custom error class for NEM12 validation errors.
 * Extends the base Error class to include record type and line number information.
 * @class NEM12ValidationError
 * @extends {Error}
 * @property {string} recordType - The type of NEM12 record that caused the validation error
 * @property {number} lineNumber - The line number where the validation error occurred
 */
export class NEM12ValidationError extends Error {
  constructor(message: string, public recordType: string, public lineNumber: number) {
    super(message);
    this.name = "NEM12ValidationError";
  }
}
