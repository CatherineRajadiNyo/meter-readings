import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";

const SqlDisplay = ({ sql }: { sql: string }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = (sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div
      className={clsx(
        "relative col-span-12 sm:col-span-6 bg-gray-100 text-black p-4 rounded-md transition-all duration-200 ease-linear border-2 border-transparent",
        {
          "!border-orange-800": copied,
        }
      )}
    >
      <button
        onClick={() => {
          copyToClipboard(sql);
        }}
        className="btn btn-secondary absolute top-2 right-2 z-[1]"
      >
        <DocumentDuplicateIcon className="size-4" />
      </button>
      <pre className="overflow-x-auto whitespace-pre text-xs max-h-80">{sql}</pre>
    </div>
  );
};

export default SqlDisplay;
