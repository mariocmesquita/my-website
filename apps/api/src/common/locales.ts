export const SUPPORTED_LOCALES = ['en', 'pt'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function resolveLocale(locale?: string): string {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale) ? locale! : 'en';
}
