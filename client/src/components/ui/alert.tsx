import React from "react";

export function Alert({ children, variant, className }: { children: React.ReactNode; variant: string; className?: string }) {
  return (
    <div className={`alert alert-${variant} ${className}`}>
      {children}
    </div>
  );
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <div className="alert-description">{children}</div>;
}