/**
 * paydayPromoTemplates.ts
 * Pre-built campaign templates for promo events, keyed by event category.
 * Shop owners can one-click load these to auto-populate Ad Special drafts
 * with suggested titles, products, validity, and disclaimers.
 *
 * Each template pairs an event category (grant | corporate | school | holiday | cultural)
 * with a promotional angle, suggesting which product categories fit best and how many
 * days the sale should run. Templates are designed around SA retail consumer behaviour
 * tied to cash influx (SASSA payouts, corporate paydays, school-term breaks).
 */

export type EventCategory = "grant" | "corporate" | "school" | "holiday" | "cultural"

export interface PromoTemplate {
  id: string
  eventCategory: EventCategory
  title: string
  subtitle: string
  suggestedProductCategoryIds: string[]  // refs PRESET_CATEGORIES ids
  suggestedValidityDays: number
  defaultDisclaimer: string
  rationale: string
}

export const PROMO_TEMPLATES: PromoTemplate[] = [
  // ─────────────────────────────────────────────────────────
  // GRANT (SASSA) TEMPLATES
  // ─────────────────────────────────────────────────────────
  {
    id: 'grant-pension-pantry',
    eventCategory: 'grant',
    title: 'PENSION PAY-DAY PANTRY STOCK-UP',
    subtitle: 'Staples & essentials at unbeatable prices',
    suggestedProductCategoryIds: ['pantry', 'dairy', 'beverages', 'cleaning'],
    suggestedValidityDays: 5,
    defaultDisclaimer: 'While stocks last. Valid only on pay-day week. E&OE.',
    rationale: 'Older Persons grant recipients plan month-long household supplies. Focus on staples (flour, rice, oil, sugar, salt) and shelf-stable items. 5-day window captures peak foot traffic post-payout.',
  },
  {
    id: 'grant-pension-wellness',
    eventCategory: 'grant',
    title: 'CARING FOR OUR ELDERS',
    subtitle: 'Health & wellness specials for pension day',
    suggestedProductCategoryIds: ['personal', 'dairy', 'produce', 'pantry'],
    suggestedValidityDays: 4,
    defaultDisclaimer: 'Pension day special. While stocks last. E&OE.',
    rationale: 'Position personal care (soap, toothpaste, deodorant) and nutrient-dense foods (eggs, milk, fresh veg) as health investments. Builds loyalty with 55+ demographic.',
  },
  {
    id: 'grant-child-lunchbox',
    eventCategory: 'grant',
    title: 'CHILD GRANT LUNCHBOX SPECIALS',
    subtitle: 'Nutrition for school -- back-to-school savings',
    suggestedProductCategoryIds: ['dairy', 'produce', 'bakery', 'snacks', 'beverages'],
    suggestedValidityDays: 5,
    defaultDisclaimer: 'Child Support Grant special. While stocks last. E&OE.',
    rationale: 'Child Support grant peaks at month-end. Bundle milk, bread, fruit, peanut butter, juice. Families pack lunchboxes after payouts. 5-day run captures mom-and-child shoppers.',
  },
  {
    id: 'grant-child-back-to-school',
    eventCategory: 'grant',
    title: 'TERM BREAK TREAT BUNDLE',
    subtitle: 'School holiday snacks & supplies',
    suggestedProductCategoryIds: ['snacks', 'beverages', 'frozen', 'dairy', 'bakery'],
    suggestedValidityDays: 6,
    defaultDisclaimer: 'Holiday special. Limit 2 per customer. While stocks last. E&OE.',
    rationale: 'Align with school holidays (term-end bundles during closing weeks). Parents use grants to treat kids during breaks. Frozen items, drinks, treats move fast.',
  },
  {
    id: 'grant-disability-home-care',
    eventCategory: 'grant',
    title: 'DISABILITY GRANT HOME-CARE SPECIALS',
    subtitle: 'Essentials for living well, priced fairly',
    suggestedProductCategoryIds: ['cleaning', 'personal', 'dairy', 'pantry'],
    suggestedValidityDays: 5,
    defaultDisclaimer: 'Disability Support Grant special. While stocks last. E&OE.',
    rationale: 'Disability grant recipients often manage chronic care and home upkeep. Cleaning supplies, personal care, nutritious foods are priorities. Steady 5-day window.',
  },
  {
    id: 'grant-bulk-buy-family',
    eventCategory: 'grant',
    title: 'PAY DAY FAMILY BULK-BUY',
    subtitle: 'Big savings when you stock up',
    suggestedProductCategoryIds: ['pantry', 'dairy', 'meat', 'frozen', 'snacks'],
    suggestedValidityDays: 6,
    defaultDisclaimer: 'Pay day special. Multi-pack discounts apply. While stocks last. E&OE.',
    rationale: 'Post-payout window sees families restocking. Bundle pantry items (maize meal, rice, oil) with frozen meats and proteins. 6-day run maximizes bulk-buy opportunity.',
  },

  // ─────────────────────────────────────────────────────────
  // CORPORATE PAYDAYS (25TH) TEMPLATES
  // ─────────────────────────────────────────────────────────
  {
    id: 'corporate-payday-premium',
    eventCategory: 'corporate',
    title: 'PAY DAY TREATS & INDULGENCES',
    subtitle: 'Quality products at premium savings',
    suggestedProductCategoryIds: ['snacks', 'beverages', 'meat', 'dairy', 'frozen'],
    suggestedValidityDays: 4,
    defaultDisclaimer: 'Corporate pay-day special. While stocks last. E&OE.',
    rationale: 'Salaried workers treat themselves mid-month. Premium snacks, quality meats, premium beverages (beer, wine, energy drinks). Short 4-day burst captures highest spend.',
  },
  {
    id: 'corporate-payday-dinner',
    eventCategory: 'corporate',
    title: 'PAYDAY DINNER PARTY PACK',
    subtitle: 'Everything for a weekend feast',
    suggestedProductCategoryIds: ['meat', 'produce', 'beverages', 'dairy', 'pantry'],
    suggestedValidityDays: 5,
    defaultDisclaimer: 'Weekend entertaining special. While stocks last. E&OE.',
    rationale: 'Mid-month paycheck → weekend entertaining. Bundle fresh meat, veg, wine, dairy. Weekend window (Fri-Sun) captures 5-day meal-planning cycle.',
  },
  {
    id: 'corporate-payday-fitness',
    eventCategory: 'corporate',
    title: 'WELLNESS WEDNESDAY - PAYDAY FITNESS FUEL',
    subtitle: 'Nutritious eats for active lifestyles',
    suggestedProductCategoryIds: ['dairy', 'produce', 'beverages', 'snacks', 'meat'],
    suggestedValidityDays: 4,
    defaultDisclaimer: 'Wellness special. Valid mid-week. While stocks last. E&OE.',
    rationale: 'Corporate workers boost healthy buys post-paycheck. Position milk, eggs, fresh veg, nuts, sports drinks as fitness investments. Mid-week emphasis.',
  },
  {
    id: 'corporate-payday-office',
    eventCategory: 'corporate',
    title: 'OFFICE PANTRY RESTOCK',
    subtitle: 'Coffee, snacks & essentials for work',
    suggestedProductCategoryIds: ['pantry', 'beverages', 'snacks', 'dairy', 'bakery'],
    suggestedValidityDays: 3,
    defaultDisclaimer: 'Office supplies special. While stocks last. E&OE.',
    rationale: 'Mid-month paycheck → office workers top-up shared kitchen supplies. Tea, coffee, biscuits, milk, bread. Short 3-day sprint for commuter foot traffic.',
  },
  {
    id: 'corporate-payday-combo',
    eventCategory: 'corporate',
    title: 'PAY DAY COMBO DEALS',
    subtitle: 'Mix & match bundles -- stock up, save more',
    suggestedProductCategoryIds: ['pantry', 'snacks', 'beverages', 'dairy', 'meat'],
    suggestedValidityDays: 5,
    defaultDisclaimer: 'Pay day only. Combo pricing applies. While stocks last. E&OE.',
    rationale: 'Bundle 2-3 items at aggressive combo pricing (e.g., bread + milk + butter = special price). Drives basket size. 5-day window captures full paycheck cycle.',
  },

  // ─────────────────────────────────────────────────────────
  // SCHOOL TERM BOUNDARIES TEMPLATES
  // ─────────────────────────────────────────────────────────
  {
    id: 'school-term-end-treats',
    eventCategory: 'school',
    title: 'TERM-END TREAT BONANZA',
    subtitle: 'Holiday reward specials for kids',
    suggestedProductCategoryIds: ['snacks', 'beverages', 'frozen', 'bakery', 'candy'],
    suggestedValidityDays: 6,
    defaultDisclaimer: 'School holiday special. While stocks last. E&OE.',
    rationale: 'Last week of term: parents buy treats to celebrate school break with kids. Sweets, ice cream, juice, biscuits, snacks peak. 6-day holiday-break push.',
  },
  {
    id: 'school-term-lunch-prep',
    eventCategory: 'school',
    title: 'BACK-TO-SCHOOL LUNCHBOX PREP',
    subtitle: 'Start the term right with healthy lunch essentials',
    suggestedProductCategoryIds: ['dairy', 'bakery', 'produce', 'meat', 'snacks'],
    suggestedValidityDays: 5,
    defaultDisclaimer: 'School term special. While stocks last. E&OE.',
    rationale: 'Week before term opens: moms buy bread, milk, peanut butter, fruit, cold meat for lunch packing. 5-day window aligns with term-start preparation.',
  },
  {
    id: 'school-holiday-family',
    eventCategory: 'school',
    title: 'SCHOOL HOLIDAYS -- FAMILY FEAST WEEK',
    subtitle: 'Meals for families at home during break',
    suggestedProductCategoryIds: ['meat', 'produce', 'dairy', 'pantry', 'beverages'],
    suggestedValidityDays: 7,
    defaultDisclaimer: 'School holiday special. While stocks last. E&OE.',
    rationale: 'During school closure weeks (e.g., 2-week June winter break, 4-week December summer break): families eat more meals at home. Extend to full 7 days.',
  },
  {
    id: 'school-supplies-bundle',
    eventCategory: 'school',
    title: 'TERM START SUPPLY BUNDLE',
    subtitle: 'School prep essentials bundled & discounted',
    suggestedProductCategoryIds: ['snacks', 'beverages', 'bakery', 'dairy', 'personal'],
    suggestedValidityDays: 5,
    defaultDisclaimer: 'Back-to-school special. While stocks last. E&OE.',
    rationale: 'Week 1 of new term: bundle lunch items + personal care (soap, deodorant). Parents re-arm kids\' routines. 5-day term-start emphasis.',
  },

  // ─────────────────────────────────────────────────────────
  // PUBLIC HOLIDAYS & CULTURAL EVENTS TEMPLATES
  // ─────────────────────────────────────────────────────────
  {
    id: 'holiday-braai-pack',
    eventCategory: 'holiday',
    title: 'HERITAGE DAY BRAAI PACK',
    subtitle: 'Meats, sides & drinks for celebrations',
    suggestedProductCategoryIds: ['meat', 'produce', 'beverages', 'snacks', 'dairy'],
    suggestedValidityDays: 4,
    defaultDisclaimer: 'Heritage Day special. While stocks last. E&OE.',
    rationale: 'Heritage Day (24 Sept) is braai/grill season in SA. Bundle beef, sausages, beer, soft drinks, salad veg. 4-day weekend push.',
  },
  {
    id: 'holiday-new-year-party',
    eventCategory: 'holiday',
    title: 'NEW YEAR CELEBRATION DEALS',
    subtitle: 'Party supplies for ringing in the new year',
    suggestedProductCategoryIds: ['beverages', 'snacks', 'meat', 'dairy', 'bakery'],
    suggestedValidityDays: 5,
    defaultDisclaimer: 'New Year special. While stocks last. E&OE.',
    rationale: 'Dec 31 - Jan 1: parties, gatherings, family meals. Wine, beer, cider, snacks, meats, dips (cheese, milk-based). 5-day year-end/start window.',
  },
  {
    id: 'holiday-festive-feast',
    eventCategory: 'holiday',
    title: 'FESTIVE SEASON FEAST SPECIAL',
    subtitle: 'Everything for holiday family meals',
    suggestedProductCategoryIds: ['meat', 'dairy', 'produce', 'pantry', 'beverages'],
    suggestedValidityDays: 7,
    defaultDisclaimer: 'Festive season special. While stocks last. E&OE.',
    rationale: 'Dec 15 - 25 (Christmas festive): extended family at home. Meat, dairy (for desserts, sauces), fresh veg, wine. Full 7-day holiday push.',
  },
  {
    id: 'holiday-workers-day',
    eventCategory: 'holiday',
    title: 'WORKERS DAY WEEKEND GETAWAY',
    subtitle: 'Pack-and-go picnic & braai essentials',
    suggestedProductCategoryIds: ['meat', 'beverages', 'snacks', 'dairy', 'frozen'],
    suggestedValidityDays: 3,
    defaultDisclaimer: 'Workers Day special. While stocks last. E&OE.',
    rationale: 'Workers Day (1 May) long weekend: road trips, picnics, braais. Portable meat, drinks, snacks. Short 3-day burst for last-minute buyers.',
  },
  {
    id: 'cultural-stokvel-bulk',
    eventCategory: 'cultural',
    title: 'STOKVEL PAYOUT BULK-BUY SPECIAL',
    subtitle: 'Big savings for community savings groups',
    suggestedProductCategoryIds: ['pantry', 'meat', 'dairy', 'frozen', 'snacks'],
    suggestedValidityDays: 5,
    defaultDisclaimer: 'Stokvel payout special. Bulk discounts apply. While stocks last. E&OE.',
    rationale: 'Stokvel payouts (usually monthly community savings groups) trigger bulk household restocking. Position multi-pack savings, case discounts. 5-day community cycle.',
  },
  {
    id: 'cultural-church-gathering',
    eventCategory: 'cultural',
    title: 'COMMUNITY GATHERING SUPPLIES',
    subtitle: 'Food & drink for church & community events',
    suggestedProductCategoryIds: ['dairy', 'bakery', 'snacks', 'beverages', 'meat'],
    suggestedValidityDays: 4,
    defaultDisclaimer: 'Community event special. While stocks last. E&OE.',
    rationale: 'Church potlucks, community celebrations, traditional gatherings. Milk, bread, muffins, drinks, cold meat platters. Weekend emphasis. 4 days.',
  },
  {
    id: 'cultural-ubuntu-family',
    eventCategory: 'cultural',
    title: 'UBUNTU FAMILY DINNER SPECIAL',
    subtitle: 'Everything for feeding a crowd at home',
    suggestedProductCategoryIds: ['meat', 'produce', 'pantry', 'dairy', 'beverages'],
    suggestedValidityDays: 5,
    defaultDisclaimer: 'Family gathering special. While stocks last. E&OE.',
    rationale: 'Extended family dinners (weekly/monthly traditions in many SA households). Large meat portions, bulk veg, gravy ingredients, drinks. 5-day family cycle.',
  },
]

/** Convenient lookup: category → array of templates. */
export const TEMPLATE_BY_CATEGORY: Record<EventCategory, PromoTemplate[]> =
  PROMO_TEMPLATES.reduce((acc, t) => {
    if (!acc[t.eventCategory]) acc[t.eventCategory] = []
    acc[t.eventCategory].push(t)
    return acc
  }, {} as Record<EventCategory, PromoTemplate[]>)
