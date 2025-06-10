import { ExcelFileFormat, ExcelMimeType } from "@/enums/file";

export type AllMimeType = ExcelMimeType;
export type AllFileFormat = ExcelFileFormat;

export const FileTypeMapping: Record<AllMimeType, AllFileFormat> = {
  [ExcelMimeType.CSV]: ExcelFileFormat.CSV,
};

export const STREAMING_BATCH_SIZE = 100;
