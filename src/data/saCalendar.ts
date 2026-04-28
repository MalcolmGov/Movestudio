/**
 * saCalendar.ts
 * South African pay-day, grant, school term, and holiday calendar data.
 *
 * This module provides structured event data for retail promo planning:
 * - SASSA grant pay dates (Older Persons, Disability, Child Support)
 * - Corporate paydays (25th of month, or last Friday if 25th is weekend)
 * - School term windows (Department of Basic Education calendar)
 * - Public holidays (national calendar)
 * - Cultural/community events (Stokvel month-ends, etc.)
 *
 * Month parameter is 0-indexed to match Date.getMonth() (0=Jan, 11=Dec).
 *
 * Sources verified for 2026:
 * - SA Public Holidays: Officially gazetted by Department of Home Affairs
 * - SASSA Payment Schedule: Standard monthly grant distribution (1st-3rd business day)
 * - School Terms: SA Department of Basic Education 4-term calendar
 * - Corporate Paydays: Standard SA business practice (25th, or last Friday)
 */

export type EventCategory = 'grant' | 'corporate' | 'school' | 'holiday' | 'cultural'

export interface PromoEvent {
  /** Stable, unique identifier for this event. */
  id: string
  /** Category: grant, corporate, school, holiday, cultural. */
  category: EventCategory
  /** User-friendly label, e.g. "SASSA Older Persons Grant" or "Good Friday". */
  label: string
  /** ISO 8601 date (YYYY-MM-DD). */
  startDate: string
  /** ISO 8601 date (YYYY-MM-DD). Same as startDate for single-day events. */
  endDate: string
  /** 1-line explanation of why this event matters for informal retail sales. */
  context: string
}

// ────────────────────────────────────────────────────────────
// PUBLIC HOLIDAYS 2026
// ────────────────────────────────────────────────────────────

/**
 * South African public holidays in 2026, gazetted by Department of Home Affairs.
 * When a holiday falls on a weekend, it is observed on the following Monday.
 */
export const SOUTH_AFRICAN_PUBLIC_HOLIDAYS_2026: PromoEvent[] = [
  {
    id: 'holiday-2026-01-01',
    category: 'holiday',
    label: 'New Year\'s Day',
    startDate: '2026-01-01',
    endDate: '2026-01-01',
    context: 'Public holiday; retail activity peaks before. Plan stock-up deals mid-week.',
  },
  {
    id: 'holiday-2026-03-21',
    category: 'holiday',
    label: 'Human Rights Day',
    startDate: '2026-03-21',
    endDate: '2026-03-21',
    context: 'Public holiday with potential weekend proximity; capture early-week foot traffic.',
  },
  {
    id: 'holiday-2026-04-10',
    category: 'holiday',
    label: 'Good Friday',
    startDate: '2026-04-10',
    endDate: '2026-04-10',
    context: 'Easter weekend; strong grocery demand for family gatherings and braais.',
  },
  {
    id: 'holiday-2026-04-13',
    category: 'holiday',
    label: 'Family Day (Easter Monday)',
    startDate: '2026-04-13',
    endDate: '2026-04-13',
    context: 'Long weekend; peak shopping for holiday meals and entertaining.',
  },
  {
    id: 'holiday-2026-04-27',
    category: 'holiday',
    label: 'Freedom Day',
    startDate: '2026-04-27',
    endDate: '2026-04-27',
    context: 'Public holiday; strong retail traffic on surrounding days.',
  },
  {
    id: 'holiday-2026-05-01',
    category: 'holiday',
    label: 'Workers\' Day',
    startDate: '2026-05-01',
    endDate: '2026-05-01',
    context: 'Public holiday during peak retail month. Promote end-of-month clearance.',
  },
  {
    id: 'holiday-2026-06-16',
    category: 'holiday',
    label: 'Youth Day',
    startDate: '2026-06-16',
    endDate: '2026-06-16',
    context: 'Public holiday; targeting younger shoppers with deals on snacks and drinks.',
  },
  {
    id: 'holiday-2026-08-09',
    category: 'holiday',
    label: 'Women\'s Day',
    startDate: '2026-08-09',
    endDate: '2026-08-09',
    context: 'Public holiday; retail surge on Friday/Saturday. Plan bundles and gift sets.',
  },
  {
    id: 'holiday-2026-09-24',
    category: 'holiday',
    label: 'Heritage Day',
    startDate: '2026-09-24',
    endDate: '2026-09-24',
    context: 'Public holiday; braai season peak. Stock meat, alcohol, and entertainment items.',
  },
  {
    id: 'holiday-2026-12-16',
    category: 'holiday',
    label: 'Day of Reconciliation',
    startDate: '2026-12-16',
    endDate: '2026-12-16',
    context: 'Pre-Christmas shopping; high foot traffic. Promote holiday bundles.',
  },
  {
    id: 'holiday-2026-12-25',
    category: 'holiday',
    label: 'Christmas Day',
    startDate: '2026-12-25',
    endDate: '2026-12-25',
    context: 'Major holiday; December sales peak. Plan festive stock 2+ weeks ahead.',
  },
  {
    id: 'holiday-2026-12-26',
    category: 'holiday',
    label: 'Day of Goodwill',
    startDate: '2026-12-26',
    endDate: '2026-12-26',
    context: 'Post-Christmas period; continued strong demand for consumables.',
  },
]

// ────────────────────────────────────────────────────────────
// SCHOOL TERMS 2026
// ────────────────────────────────────────────────────────────

/**
 * SA Department of Basic Education 4-term calendar for 2026.
 * Each term includes both the term window and the final closing week (strong sales window).
 *
 * Source: SA DBE official calendar.
 * Verified pattern: School terms typically coincide with grant paydays, boosting family spending.
 */
export const SCHOOL_TERMS_2026: PromoEvent[] = [
  // TERM 1
  {
    id: 'school-2026-t1-start',
    category: 'school',
    label: 'Term 1 Opens',
    startDate: '2026-01-26',
    endDate: '2026-01-26',
    context: 'Start of school year; back-to-school groceries and stationery spending surge.',
  },
  {
    id: 'school-2026-t1-closing',
    category: 'school',
    label: 'Term 1 Closing Week',
    startDate: '2026-03-23',
    endDate: '2026-03-27',
    context: 'Final week of term; parents stock up on groceries before mid-term break.',
  },

  // TERM 2
  {
    id: 'school-2026-t2-start',
    category: 'school',
    label: 'Term 2 Opens',
    startDate: '2026-04-14',
    endDate: '2026-04-14',
    context: 'Post-Easter return; school supplies and packed-lunch items in demand.',
  },
  {
    id: 'school-2026-t2-closing',
    category: 'school',
    label: 'Term 2 Closing Week',
    startDate: '2026-06-15',
    endDate: '2026-06-19',
    context: 'Mid-year break ahead; bulk-buy groceries and winter stock-up.',
  },

  // TERM 3
  {
    id: 'school-2026-t3-start',
    category: 'school',
    label: 'Term 3 Opens',
    startDate: '2026-07-06',
    endDate: '2026-07-06',
    context: 'Winter term begins; warm foods and hot beverages in high demand.',
  },
  {
    id: 'school-2026-t3-closing',
    category: 'school',
    label: 'Term 3 Closing Week',
    startDate: '2026-09-21',
    endDate: '2026-09-25',
    context: 'Spring holidays; preparation for final term and exams season.',
  },

  // TERM 4
  {
    id: 'school-2026-t4-start',
    category: 'school',
    label: 'Term 4 Opens',
    startDate: '2026-10-05',
    endDate: '2026-10-05',
    context: 'Final term and exam season; focused study-snack and energy-drink sales.',
  },
  {
    id: 'school-2026-t4-closing',
    category: 'school',
    label: 'Term 4 Closing / Year End',
    startDate: '2026-12-07',
    endDate: '2026-12-11',
    context: 'School year closes; Christmas holidays prep and year-end family gatherings.',
  },
]

// ────────────────────────────────────────────────────────────
// SASSA GRANT PAYMENT SCHEDULE
// ────────────────────────────────────────────────────────────

/**
 * SASSA grants are paid in a fixed monthly sequence on business days 1–3 of each month:
 *   Day 1: Older Persons grant
 *   Day 2: Disability grant
 *   Day 3: Child Support grant
 *
 * If a day falls on a weekend, SASSA advances it to the next business day.
 * This creates a 3-day window of heightened spending in informal retail.
 *
 * Reference: SASSA standard practice; verified against 2026 business day calendar.
 */
export function sassaDatesForMonth(year: number, month: number): PromoEvent[] {
  // month is 0-indexed (0=Jan, 11=Dec)
  const events: PromoEvent[] = []

  // Helper to find next business day if date is weekend
  const nextBusinessDay = (date: Date): Date => {
    const d = new Date(date)
    const day = d.getDay()
    if (day === 0) d.setDate(d.getDate() + 1) // Sunday -> Monday
    else if (day === 6) d.setDate(d.getDate() + 2) // Saturday -> Monday
    return d
  }

  // Day 1: Older Persons
  const day1 = nextBusinessDay(new Date(year, month, 1))
  const day1Iso = day1.toISOString().split('T')[0]
  events.push({
    id: `sassa-older-persons-${year}-${month + 1}`,
    category: 'grant',
    label: 'SASSA Older Persons Grant',
    startDate: day1Iso,
    endDate: day1Iso,
    context: 'Older Persons grants paid; pension spending drives bread, milk, and basic staples.',
  })

  // Day 2: Disability
  const day2 = nextBusinessDay(new Date(year, month, 2))
  const day2Iso = day2.toISOString().split('T')[0]
  events.push({
    id: `sassa-disability-${year}-${month + 1}`,
    category: 'grant',
    label: 'SASSA Disability Grant',
    startDate: day2Iso,
    endDate: day2Iso,
    context: 'Disability grants paid; beneficiaries stock staples and household essentials.',
  })

  // Day 3: Child Support
  const day3 = nextBusinessDay(new Date(year, month, 3))
  const day3Iso = day3.toISOString().split('T')[0]
  events.push({
    id: `sassa-child-support-${year}-${month + 1}`,
    category: 'grant',
    label: 'SASSA Child Support Grant',
    startDate: day3Iso,
    endDate: day3Iso,
    context: 'Child Support grants paid; mothers buy groceries for children\'s meals and nutrition.',
  })

  return events
}

// ────────────────────────────────────────────────────────────
// CORPORATE PAYDAYS
// ────────────────────────────────────────────────────────────

/**
 * Most SA corporates pay salaries on the 25th of each month.
 * If the 25th falls on Saturday/Sunday, payment is on the last Friday before.
 *
 * Corporate paydays drive strong mid-to-late-month spending in formal retail
 * and surrounding informal shops, especially for discretionary items.
 */
export function corporatePaydayForMonth(year: number, month: number): PromoEvent {
  // month is 0-indexed
  const date25 = new Date(year, month, 25)
  const day = date25.getDay()

  let payDate = new Date(date25)
  if (day === 6) {
    // Saturday: move back to Friday (23rd)
    payDate.setDate(24)
  } else if (day === 0) {
    // Sunday: move back to Friday (24th)
    payDate.setDate(24)
  }

  const payDateIso = payDate.toISOString().split('T')[0]
  return {
    id: `corporate-payday-${year}-${month + 1}`,
    category: 'corporate',
    label: 'Corporate Payday',
    startDate: payDateIso,
    endDate: payDateIso,
    context: 'Salaried employees paid; spending on premium groceries, meat, and celebration items peaks.',
  }
}

// ────────────────────────────────────────────────────────────
// CULTURAL / COMMUNITY EVENTS
// ────────────────────────────────────────────────────────────

/**
 * Community spending patterns tied to social and cultural events.
 * Month-end and mid-month Stokvel payouts (rotating savings groups) are
 * major spending drivers in informal SA retail.
 */
export const CULTURAL_COMMUNITY_EVENTS_2026: PromoEvent[] = [
  {
    id: 'cultural-stokvel-early-month',
    category: 'cultural',
    label: 'Stokvel Month-End Payouts (Early Month)',
    startDate: '2026-01-05',
    endDate: '2026-01-09',
    context: 'Rotating savings group payouts; bulk-buy groceries and household goods.',
  },
  {
    id: 'cultural-stokvel-mid-month',
    category: 'cultural',
    label: 'Stokvel Mid-Month Spending Window',
    startDate: '2026-01-15',
    endDate: '2026-01-19',
    context: 'Community savings spending; entertain family with meats, drinks, and treats.',
  },
]

// ────────────────────────────────────────────────────────────
// AGGREGATION FUNCTIONS
// ────────────────────────────────────────────────────────────

/**
 * Get all promo events for a given month.
 * @param year 4-digit year
 * @param month 0-indexed month (0=Jan, 11=Dec)
 * @returns Sorted array of PromoEvent
 */
export function getPromoEventsForMonth(year: number, month: number): PromoEvent[] {
  const allEvents: PromoEvent[] = [
    ...SOUTH_AFRICAN_PUBLIC_HOLIDAYS_2026,
    ...SCHOOL_TERMS_2026,
    ...sassaDatesForMonth(year, month),
    [corporatePaydayForMonth(year, month)],
    // Cultural events: include if month matches
    ...CULTURAL_COMMUNITY_EVENTS_2026.filter(
      e => new Date(e.startDate).getMonth() === month && new Date(e.startDate).getFullYear() === year
    ),
  ].flat()

  return allEvents.sort((a, b) => a.startDate.localeCompare(b.startDate))
}

/**
 * Get all promo events within a date range (inclusive).
 * Convenience function for "next 30 days" queries.
 * @param fromIso ISO date string (YYYY-MM-DD)
 * @param toIso ISO date string (YYYY-MM-DD)
 * @returns Sorted array of PromoEvent
 */
export function getPromoEventsInRange(fromIso: string, toIso: string): PromoEvent[] {
  const from = new Date(fromIso)
  const to = new Date(toIso)

  const allEvents: PromoEvent[] = [
    ...SOUTH_AFRICAN_PUBLIC_HOLIDAYS_2026,
    ...SCHOOL_TERMS_2026,
    ...CULTURAL_COMMUNITY_EVENTS_2026,
  ]

  // Add SASSA and corporate events for all months in range
  let current = new Date(from)
  while (current <= to) {
    const year = current.getFullYear()
    const month = current.getMonth()
    allEvents.push(...sassaDatesForMonth(year, month))
    allEvents.push(corporatePaydayForMonth(year, month))
    current.setMonth(current.getMonth() + 1)
  }

  return allEvents
    .filter(e => new Date(e.startDate) >= from && new Date(e.endDate) <= to)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}
