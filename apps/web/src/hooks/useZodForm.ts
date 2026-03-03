'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type FieldValues, useForm, type UseFormProps } from 'react-hook-form';
import { type ZodType } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useZodForm<T extends FieldValues>(
  schema: ZodType<T, any>,
  options?: Omit<UseFormProps<T>, 'resolver'>,
) {
  return useForm<T>({
    ...options,
    resolver: zodResolver(schema),
  });
}
