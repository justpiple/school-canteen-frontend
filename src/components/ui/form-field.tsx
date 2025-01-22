import { ReactNode } from "react";
import { Label } from "./label";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
  helpText?: string;
}

export default function FormField({
  label,
  htmlFor,
  children,
  required = false,
  className = "",
  helpText,
}: Readonly<FormFieldProps>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={htmlFor} className="flex gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {helpText && <p className="text-sm text-muted-foreground">{helpText}</p>}
    </div>
  );
}
