'use client';

import ErrorMessage from '@/components/shared/errorMessage';
import FileUpload from '@/components/shared/fileUpload';
import { ExcelMimeType } from '@/enums/file';
import React, { useState } from 'react';
import SqlDisplay from './components/SqlDisplay';

export default function CsvToSqlPanel() {
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState({ totalBatches: 0, totalReadings: 0 });
  const [sqlStatements, setSqlStatements] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (file?: File) => {
    setSqlStatements([]);
    setFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setSqlStatements([]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/process-csv', {
        method: 'POST',
        body: formData,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            switch (data.type) {
              case 'progress':
                setProgress({
                  totalBatches: data.totalBatches,
                  totalReadings: data.totalReadings,
                });
                setSqlStatements((prev) => [...prev, data.sql]);
                break;
              case 'complete':
                console.log('Processing complete!', data);
                break;
              case 'error':
                setError(data.error);
                break;
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full gap-8 grid grid-cols-12">
      <div className="col-span-12 sm:col-span-6 sm:col-start-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FileUpload file={file} onChange={handleFileChange} acceptType={[ExcelMimeType.CSV]} />

          <button type="submit" className="btn btn-primary" disabled={!file || isProcessing}>
            {isProcessing ? 'Processing...' : 'Submit'}
          </button>
        </form>

        <ErrorMessage message={error} className="mt-2" />
      </div>

      {sqlStatements.length > 0 && (
        <div className="col-span-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <div className="text-lg font-bold ">Generated SQL Statements</div>
            <div className="text-sm flex gap-4 text-green-800">
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
