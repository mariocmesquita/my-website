'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type FieldValues, useForm, type UseFormProps } from 'react-hook-form';
import { type ZodType } from 'zod';

export function useZodForm<T extends FieldValues>(
  schema: ZodType<T, T>,
  options?: Omit<UseFormProps<T>, 'resolver'>,
) {
  return useForm<T>({
    ...options,
    resolver: zodResolver(schema),
  });
}
