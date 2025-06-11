import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

const SqlDisplay = ({ sql }: { sql: string }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = (sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div
      className={
        "relative col-span-12 sm:col-span-6 bg-slate-200 border-1 border-gray-800 p-4 rounded-md"
      }
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 z-[1] size-8"
            onClick={() => {
              copyToClipboard(sql);
            }}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied" : "Copy"}</p>
        </TooltipContent>
      </Tooltip>
      <pre className="overflow-x-auto whitespace-pre text-xs max-h-80">{sql}</pre>
    </div>
  );
};

export default SqlDisplay;
