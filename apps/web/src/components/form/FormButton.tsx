'use client';

import { type ButtonHTMLAttributes } from 'react';
import { useFormStatus } from 'react-dom';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loadingText?: string;
  children: string;
}

export function FormButton({
  children,
  loadingText = 'Processando...',
  disabled,
  ...props
}: FormButtonProps) {
  const { pending } = useFormStatus();
  const isLoading = pending || disabled;

  return (
    <button
      type="submit"
      disabled={isLoading}
      {...props}
      className="mt-2 rounded-lg bg-olive px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition"
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
