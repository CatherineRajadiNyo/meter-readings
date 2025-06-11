# NEM12 Processing Module

This module handles the parsing, validation, and processing of NEM12 meter data files. It provides utilities for working with the NEM12 file format, which is a standard format for meter data in the Australian energy market.

## Components

### Parser (`parser.ts`)

- Handles the parsing of CSV files into NEM12 records
- Provides streaming support for large files
- Validates basic CSV structure
- Converts raw CSV data into typed NEM12 records

### Validator (`validator.ts`)

- Validates NEM12 records against the NEM12 specification
- Checks record types, field formats, and data consistency
- Provides detailed error messages for validation failures
- Supports incremental validation during streaming

### Processor (`processor.ts`)

- Coordinates the parsing and validation of NEM12 files
- Handles the business logic of processing meter readings
- Manages the streaming of data and progress updates
- Generates SQL statements for database storage

## Usage

```typescript
import { processNEM12Stream } from "@/utils/nem12/processor";

// Process a NEM12 file stream
const stream = file.stream();
const { readings, errors } = await processNEM12Stream(stream);

// Handle the results
if (errors.length > 0) {
  console.error("Processing errors:", errors);
} else {
  console.log(`Successfully processed ${readings.length} readings`);
}
```

## NEM12 File Format

The NEM12 file format consists of the following record types:

- **100**: Header Record
  - Contains file version and creation date
- **200**: NMI Data Details Record
  - Contains NMI and interval length information
- **300**: Interval Data Record
  - Contains actual meter readings
- **400**: Interval Event Record
  - Contains event information (e.g., quality flags)
- **500**: B2B Details Record
  - Contains business-to-business information
- **900**: End Record
  - Marks the end of the file

## Error Handling

The module provides two custom error types:

- `CSVParseError`: For errors during CSV parsing
- `NEM12ValidationError`: For errors during NEM12 validation

Both error types include line numbers and detailed error messages to help identify issues in the input files.

## Performance Considerations

- The module uses streaming to handle large files efficiently
- Processing is done incrementally to minimize memory usage
- Progress updates are provided through event streams
- SQL generation is optimized for bulk inserts
