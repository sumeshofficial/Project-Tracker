import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="stack" style={{ gap: "0.35rem" }}>
      <label>{label}</label>
      {children}
      {error ? <span className="error">{error}</span> : null}
    </div>
  );
}