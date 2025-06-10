import { ReactNode } from "react";
import clsx from "clsx";

export default function ErrorMessage({
  message,
  className,
}: {
  message?: ReactNode;
  className?: string;
}) {
  return message ? <div className={clsx("text-red-600", className)}>{message}</div> : <></>;
}
