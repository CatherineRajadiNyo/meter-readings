"use client";

import { ChangeEvent, DragEvent, useRef } from "react";
import { AllMimeType, FileTypeMapping } from "@/constants/file";
import { DownloadIcon } from "lucide-react";

const checkFileType = (file: File, acceptType?: AllMimeType[]) => {
  if (!acceptType) return true;

  const uploadedFileType = acceptType.find((format) => format === file.type);

  return !!uploadedFileType;
};

interface FileUploadProps {
  file?: File;
  onChange: (file?: File) => void;
  acceptType?: AllMimeType[];
  setErrorMessage?: (message?: string) => void;
}

export default function FileUpload({
  file,
  onChange,
  acceptType,
  setErrorMessage,
}: FileUploadProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const isValidFileType = checkFileType(file, acceptType);
    if (isValidFileType) {
      onChange(file);
      setErrorMessage?.(undefined);
    } else {
      onChange(undefined);
      setErrorMessage?.("Please select a valid file.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => {
    ref.current?.click();
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        className="border-2 border-dashed border-gray-700 p-6 rounded-md text-center cursor-pointer hover:border-gray-700 hover:bg-gray-100"
      >
        <DownloadIcon className="mx-auto size-6 text-gray-900" />
        <div className="text-sm text-gray-900 mt-2">
          {file
            ? file.name
            : `Drag & drop a ${
                acceptType?.map((el) => FileTypeMapping[el]).join(", ") ?? ""
              } file here, or click to browse`}
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept={acceptType ? acceptType.join(",") : undefined}
        onChange={handleFileChange}
        className="hidden"
        data-testid="file-input"
      />
    </div>
  );
}
