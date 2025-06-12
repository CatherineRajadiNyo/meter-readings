"use client";

import FileUpload from "@/components/ui/FileUpload";
import { ExcelMimeType } from "@/enums/file";
import React, { useState } from "react";
import SqlDisplay from "./components/SqlDisplay";
import { Button } from "@/components/ui/Button";
import { Loader2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import clsx from "clsx";

export default function CsvToSqlPanel() {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState({
    totalBatches: 0,
    totalReadings: 0,
  });
  const [sqlStatements, setSqlStatements] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (file?: File) => {
    setSqlStatements([]);
    setFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage(undefined);
    setSqlStatements([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/nem12/process", {
        method: "POST",
        body: formData,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value);
        const lines = buffer.split("\n");

        // Keep the last line in the buffer if it's incomplete
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              switch (data.type) {
                case "progress":
                  setProgress({
                    totalBatches: data.totalBatches,
                    totalReadings: data.totalReadings,
                  });
                  setSqlStatements((prev) => [...prev, data.sql]);
                  break;
                case "complete":
                  console.log("Processing complete!", data);
                  break;
                case "error":
                  setErrorMessage(data.error);
                  break;
              }
            } catch (parseError) {
              console.error("Error parsing JSON:", parseError, "Line:", line);
              setErrorMessage("Error parsing server response");
            }
          }
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full gap-8 grid grid-cols-12">
      <div className="col-span-12 sm:col-span-6 sm:col-start-4">
        <Alert
          variant="destructive"
          className={clsx("mb-0 h-0 opacity-0", {
            "mb-4 h-fit opacity-100": errorMessage,
          })}
        >
          <AlertTitle>Error:</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FileUpload
            file={file}
            onChange={handleFileChange}
            acceptType={[ExcelMimeType.CSV]}
            setErrorMessage={setErrorMessage}
          />

          <Button type="submit" disabled={!file || isProcessing}>
            {isProcessing ? (
              <>
                <Loader2Icon className="animate-spin" /> Processing...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>

      {sqlStatements.length > 0 && (
        <div className="col-span-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="text-lg font-bold ">Generated SQL Statements</div>
            <div className="text-sm flex gap-4 text-green-700">
              <span>Total Batches: {progress.totalBatches}</span>
              <span>Total Readings Processed: {progress.totalReadings}</span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            {sqlStatements.map((sql, index) => (
              <SqlDisplay key={`sql_${index}`} sql={sql} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
