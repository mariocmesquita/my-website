'use client';

import { type ButtonHTMLAttributes } from 'react';

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
  return (
    <button
      type="submit"
      disabled={disabled}
      {...props}
      className="mt-2 rounded-lg bg-olive px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60 transition"
    >
      {disabled ? loadingText : children}
    </button>
  );
}
