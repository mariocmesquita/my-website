'use client';

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
      <p className="text-sm text-destructive">{message}</p>
    </div>
  );
}
