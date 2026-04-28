/**
 * i18n.ts
 * Translation helper functions for Ad Specials feature.
 *
 * Provides:
 * - t(): lookup translatable strings by key and language
 * - formatValidityI18n(): format validity date range in target language
 * - badgeTextI18n(): generate discount badge text with translated "OFF" / "SAVE"
 */

import { TRANSLATIONS, Lang, TranslatableStrings } from '../data/translations'
import { CurrencyCode, CURRENCY_META } from './adSpecialEngine'

/** Language picker metadata for the editor UI. */
export interface LangMeta {
  code: Lang
  label: string         // English-language name
  nativeLabel: string   // endonym (what speakers call the language)
  flag: string          // emoji used in the language picker
}

export const LANG_META: LangMeta[] = [
  { code: 'en', label: 'English',  nativeLabel: 'English',   flag: '🇬🇧' },
  { code: 'zu', label: 'Zulu',     nativeLabel: 'isiZulu',   flag: '🇿🇦' },
  { code: 'xh', label: 'Xhosa',    nativeLabel: 'isiXhosa',  flag: '🇿🇦' },
  { code: 'af', label: 'Afrikaans',nativeLabel: 'Afrikaans', flag: '🇿🇦' },
  { code: 'st', label: 'Sesotho',  nativeLabel: 'Sesotho',   flag: '🇿🇦' },
]

/**
 * Look up a translatable string by key and language.
 *
 * @param key - Key in TranslatableStrings (e.g., 'visitUsToday', 'scanMe')
 * @param lang - Language code ('en' | 'zu' | 'xh' | 'af' | 'st')
 * @returns Translated string, or English fallback if language/key not found
 *
 * @example
 *   t('visitUsToday', 'zu')  // → 'Wakashela nami namuhla'
 *   t('visitUsToday', 'en')  // → 'Visit us today'
 */
export function t<K extends keyof TranslatableStrings>(
  key: K,
  lang: Lang = 'en'
): string {
  try {
    const translated = TRANSLATIONS[lang]?.[key]
    return translated ?? TRANSLATIONS.en[key] ?? ''
  } catch {
    return TRANSLATIONS.en[key] ?? ''
  }
}

/**
 * Format a validity date range in the target language.
 *
 * Locale mapping for Intl.DateTimeFormat:
 * - 'en' → 'en-ZA'
 * - 'zu' → 'en-ZA' (Zulu uses English numeral conventions)
 * - 'xh' → 'en-ZA' (Xhosa uses English numeral conventions)
 * - 'af' → 'af-ZA' (Afrikaans locale)
 * - 'st' → 'en-ZA' (Sesotho uses English numeral conventions)
 *
 * @param fromIso - From date as ISO string (e.g., '2026-04-28')
 * @param toIso - To date as ISO string (e.g., '2026-05-05')
 * @param lang - Language code
 * @returns Formatted string, e.g. "Valid 28 Apr – 5 May 2026" (en) or
 *          "Okwakade 28 Ape – 5 Meyi 2026" (zu)
 *
 * @example
 *   formatValidityI18n('2026-04-28', '2026-05-05', 'en')
 *   // → 'Valid 28 Apr – 5 May 2026'
 *   formatValidityI18n('2026-04-28', '2026-05-05', 'zu')
 *   // → 'Okwakade 28 Ape – 5 Meyi 2026'
 */
export function formatValidityI18n(
  fromIso: string,
  toIso: string,
  lang: Lang = 'en'
): string {
  const localeMap: Record<Lang, string> = {
    en: 'en-ZA',
    zu: 'en-ZA',
    xh: 'en-ZA',
    af: 'af-ZA',
    st: 'en-ZA',
  }
  const locale = localeMap[lang]

  try {
    const from = new Date(fromIso)
    const to = new Date(toIso)
    if (isNaN(+from) || isNaN(+to)) return ''

    const sameYear = from.getFullYear() === to.getFullYear()
    const fromFmt = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: sameYear ? undefined : 'numeric',
    }).format(from)
    const toFmt = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(to)

    const validPrefix = t('validPrefix', lang)
    return `${validPrefix} ${fromFmt} – ${toFmt}`
  } catch {
    return ''
  }
}

/**
 * Generate discount badge text with translated "OFF" or "SAVE" label.
 *
 * Logic (same as calcDiscount.badgeText):
 * - If percentOff >= 20: return "{percentOff}% {percentOff translation}"
 * - Else: return "{save translation} {formatted amount}"
 *
 * @param percentOff - Discount percentage (rounded integer, e.g., 25)
 * @param amountOff - Discount amount in currency units (e.g., 50.00)
 * @param currency - Currency code ('ZAR' | 'USD' | etc.)
 * @param lang - Language code
 * @returns Badge text, e.g. "25% OFF" (en) or "25% KHUPHA" (zu)
 *
 * @example
 *   badgeTextI18n(25, 50, 'ZAR', 'en')
 *   // → '25% OFF'
 *   badgeTextI18n(15, 30, 'ZAR', 'en')
 *   // → 'SAVE R 30'
 *   badgeTextI18n(25, 50, 'ZAR', 'zu')
 *   // → '25% KHUPHA'
 */
export function badgeTextI18n(
  percentOff: number,
  amountOff: number,
  currency: CurrencyCode,
  lang: Lang = 'en'
): string {
  const percentOffLabel = t('percentOff', lang)
  const saveLabel = t('save', lang)

  if (percentOff >= 20) {
    return `${percentOff}% ${percentOffLabel}`
  }

  const { symbol, locale } = CURRENCY_META[currency]
  const isWhole = Number.isInteger(amountOff)
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amountOff)

  return `${saveLabel} ${symbol} ${formatted}`
}
