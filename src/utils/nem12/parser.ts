import { CSVRecord } from "@/types/nem12";

export function parseCSVLine(line: string): CSVRecord {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  let escapeNext = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (escapeNext) {
      current += char;
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Push the last field
  result.push(current.trim());

  // Skip empty lines
  if (result.length === 0 || (result.length === 1 && result[0] === "")) {
    return [];
  }

  // Remove quotes from fields and filter out empty fields
  return result.map((field) => field.replace(/^"|"$/g, "")).filter((field) => field !== "");
}
