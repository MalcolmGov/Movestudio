/**
 * PaydayCalendar.tsx
 * Interactive calendar view of SA pay-day events (SASSA grants, corporate paydays,
 * school terms, public holidays, cultural events) with pre-built promo campaign suggestions.
 * Mounted in AdSpecialsTab.tsx ListView between header and saved-specials grid.
 *
 * Features:
 * - Month navigation (prev/next, year selector)
 * - Event-coloured calendar grid with promo window badges
 * - Event list with expandable campaign suggestions per event
 * - One-click "Use Template" to load campaign into Ad Special draft
 */

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BrandKit } from '../types'
import {
  getPromoEventsForMonth,
  PromoEvent,
} from '../data/saCalendar'
import {
  TEMPLATE_BY_CATEGORY,
  PromoTemplate,
} from '../data/paydayPromoTemplates'
import { newSpecial, AdSpecial } from '../utils/adSpecialEngine'
import { PRESET_BY_CATEGORY } from '../data/presetProducts'

interface PaydayCalendarProps {
  kit: BrandKit
  projectId: string
  onUseTemplate: (special: AdSpecial) => void  // fires when user clicks "Use Template"
}

export const PaydayCalendar: React.FC<PaydayCalendarProps> = ({
  kit,
  projectId,
  onUseTemplate,
}) => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())

  // Get all promo events for the current month (0-indexed).
  const events = useMemo(
    () => getPromoEventsForMonth(year, month),
    [year, month]
  )

  // Expand/collapse controls for campaign suggestions.
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null)

  // Navigate months.
  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1)
      setMonth(11)
    } else {
      setMonth(month - 1)
    }
  }

  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1)
      setMonth(0)
    } else {
      setMonth(month + 1)
    }
  }

  // Generate Ad Special draft from template.
  const handleUseTemplate = (event: PromoEvent, template: PromoTemplate) => {
    const draft = newSpecial()

    // Auto-populate from template.
    draft.title = template.title
    draft.subtitle = template.subtitle
    draft.disclaimer = template.defaultDisclaimer

    // Set validity dates aligned to the event.
    const eventStart = new Date(event.startDate)
    const eventEnd = new Date(event.startDate)
    eventEnd.setDate(eventEnd.getDate() + template.suggestedValidityDays)

    draft.validFrom = event.startDate
    draft.validTo = eventEnd.toISOString().slice(0, 10)

    // Pre-fill with suggested product category (first few items from suggestions).
    // The user can modify in the draft editor.
    const suggestedProducts: string[] = []
    for (const catId of template.suggestedProductCategoryIds) {
      const category = PRESET_BY_CATEGORY[catId]
      if (category && suggestedProducts.length < 4) {
        // Pick first item from each suggested category, up to 4 total.
        suggestedProducts.push(category.items[0]?.name || '')
      }
    }

    // Store reference data (user will pick actual product IDs in the editor).
    draft.subtitle = `${template.subtitle} — Suggested: ${suggestedProducts.filter(Boolean).join(', ')}`

    // Invoke parent handler to load draft into editor.
    onUseTemplate(draft)
  }

  const eventColor = (category: PromoEvent['category']): string => {
    switch (category) {
      case 'grant':
        return 'rgba(34, 197, 94, 0.2)'  // green
      case 'corporate':
        return 'rgba(59, 130, 246, 0.2)'  // blue
      case 'school':
        return 'rgba(168, 85, 247, 0.2)'  // purple
      case 'holiday':
        return 'rgba(239, 68, 68, 0.2)'   // red
      case 'cultural':
        return 'rgba(249, 115, 22, 0.2)'  // orange
      default:
        return 'rgba(156, 163, 175, 0.2)' // gray
    }
  }

  const eventBorderColor = (category: PromoEvent['category']): string => {
    switch (category) {
      case 'grant':
        return '#22c55e'
      case 'corporate':
        return '#3b82f6'
      case 'school':
        return '#a855f7'
      case 'holiday':
        return '#ef4444'
      case 'cultural':
        return '#f97316'
      default:
        return '#9ca3af'
    }
  }

  const monthName = new Date(year, month).toLocaleDateString('en-ZA', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div
      style={{
        padding: '18px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        background: 'rgba(255, 255, 255, 0.015)',
        marginBottom: '24px',
        fontFamily: kit.font,
      }}
    >
      {/* ──── Header + Navigation ──── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--text)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Pay-Day Promo Calendar
        </h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={prevMonth}
            style={{
              background: 'none',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'var(--text)',
              cursor: 'pointer',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            ← Prev
          </button>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'var(--text)',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(year, i).toLocaleDateString('en-ZA', { month: 'short' })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'var(--text)',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            onClick={nextMonth}
            style={{
              background: 'none',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'var(--text)',
              cursor: 'pointer',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* ──── Month Display ──── */}
      <div
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '12px',
        }}
      >
        {monthName}
      </div>

      {/* ──── Event List with Campaign Suggestions ──── */}
      {events.length === 0 ? (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            padding: '12px',
          }}
        >
          No major promo events this month.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.map((event) => {
            const isExpanded = expandedEventId === event.id
            const templates = TEMPLATE_BY_CATEGORY[event.category] || []

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: eventColor(event.category),
                    border: `1px solid ${eventBorderColor(event.category)}`,
                  }}
                >
                  {/* Event summary header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      setExpandedEventId(isExpanded ? null : event.id)
                    }
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          color: 'var(--text)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {event.label}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          marginTop: '2px',
                        }}
                      >
                        {new Date(event.startDate).toLocaleDateString('en-ZA', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                        {event.endDate && event.endDate !== event.startDate
                          ? ` – ${new Date(event.endDate).toLocaleDateString('en-ZA', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })}`
                          : ''}
                      </div>
                      {event.context && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            marginTop: '4px',
                            maxWidth: '300px',
                          }}
                        >
                          {event.context}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '18px',
                        color: eventBorderColor(event.category),
                        userSelect: 'none',
                      }}
                    >
                      {isExpanded ? '▼' : '▶'}
                    </div>
                  </div>

                  {/* Campaign suggestions (expanded) */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ marginTop: '12px' }}
                    >
                      <div
                        style={{
                          paddingTop: '12px',
                          borderTop: `1px solid ${eventBorderColor(
                            event.category
                          )}`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                        }}
                      >
                        {templates.length === 0 ? (
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--text-muted)',
                              fontStyle: 'italic',
                            }}
                          >
                            No templates for this category.
                          </div>
                        ) : (
                          templates.map((template) => (
                            <div
                              key={template.id}
                              style={{
                                padding: '8px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '6px',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  color: 'var(--text)',
                                  marginBottom: '2px',
                                }}
                              >
                                {template.title}
                              </div>
                              <div
                                style={{
                                  fontSize: '10px',
                                  color: 'var(--text-muted)',
                                  marginBottom: '6px',
                                  lineHeight: '1.4',
                                }}
                              >
                                {template.subtitle}
                              </div>
                              <div
                                style={{
                                  fontSize: '10px',
                                  color: 'var(--text-muted)',
                                  marginBottom: '6px',
                                  lineHeight: '1.3',
                                  fontStyle: 'italic',
                                }}
                              >
                                {template.rationale}
                              </div>
                              <button
                                onClick={() =>
                                  handleUseTemplate(event, template)
                                }
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: kit.accent,
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  padding: 0,
                                  textDecoration: 'underline',
                                }}
                              >
                                Use Template
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ──── Legend ──── */}
      <div
        style={{
          marginTop: '18px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
            }}
          />
          Grant (SASSA)
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#3b82f6',
            }}
          />
          Corporate Payday
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#a855f7',
            }}
          />
          School Term
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#ef4444',
            }}
          />
          Public Holiday
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#f97316',
            }}
          />
          Cultural Event
        </div>
      </div>
    </div>
  )
}
