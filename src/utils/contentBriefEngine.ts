// Content Brief Engine — generates a personalised 7-day posting plan

export interface DaySlot {
  day: string
  date: string
  format: string
  formatLabel: string
  formatIcon: string
  type: string
  typeLabel: string
  typeIcon: string
  headline: string
  caption: string
  hashtags: string[]
  bestTime: string
  tip: string
}

export interface WeeklyBrief {
  industry: string
  tone: string
  generatedAt: string
  weekStart: string
  slots: DaySlot[]
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const FORMATS = [
  { value: 'instagram-post',  label: 'Instagram Post',  icon: '📷' },
  { value: 'instagram-reel',  label: 'Instagram Reel',  icon: '🎬' },
  { value: 'instagram-story', label: 'Instagram Story', icon: '⭕' },
  { value: 'linkedin-post',   label: 'LinkedIn Post',   icon: '💼' },
  { value: 'facebook-ad',     label: 'Facebook Ad',     icon: '📘' },
  { value: 'twitter-x',       label: 'Twitter/X Post',  icon: '𝕏' },
  { value: 'facebook-reel',   label: 'Facebook Reel',   icon: '🎥' },
]

// Industry-specific content themes
const THEMES: Record<string, string[][]> = {
  SaaS:     [['Product Feature', '⚡'], ['Social Proof', '🌟'], ['Educational', '📚'], ['Behind the Scenes', '🎬'], ['Customer Story', '💬'], ['Flash Offer', '🏷'], ['Team Culture', '👥']],
  Fintech:  [['Security Tip', '🔒'], ['Market Insight', '📊'], ['Product Update', '⚡'], ['Customer Win', '🌟'], ['Regulatory News', '📋'], ['Savings Tip', '💰'], ['Weekend Recap', '📰']],
  Retail:   [['Product Spotlight', '🛍'], ['Flash Sale', '🔥'], ['Customer Review', '⭐'], ['Behind the Scenes', '🎬'], ['Style Tip', '✨'], ['Weekend Deal', '🎉'], ['UGC Feature', '📸']],
  Agency:   [['Case Study', '📈'], ['Industry Insight', '🔍'], ['Team Spotlight', '👥'], ['Process Reveal', '🛠'], ['Client Win', '🏆'], ['Creative Tip', '🎨'], ['Weekend Inspiration', '💡']],
  default:  [['Brand Story', '✦'], ['Product Feature', '⚡'], ['Educational', '📚'], ['Social Proof', '🌟'], ['Behind the Scenes', '🎬'], ['Promotional', '🏷'], ['Community', '💬']],
}

const BEST_TIMES: Record<string, string> = {
  Monday: '8:00am – 9:00am',
  Tuesday: '9:00am – 10:00am',
  Wednesday: '11:00am – 1:00pm',
  Thursday: '11:00am – 12:00pm',
  Friday: '10:00am – 11:00am',
  Saturday: '9:00am – 11:00am',
  Sunday: '6:00pm – 8:00pm',
}

const TIPS: Record<string, string> = {
  Monday:    'Start the week with value — share a quick tip or insight.',
  Tuesday:   'Tuesday posts get 20% higher engagement. Use it for product features.',
  Wednesday: 'Midweek is perfect for social proof — share a testimonial.',
  Thursday:  'Behind-the-scenes content performs best Thu–Fri.',
  Friday:    'End the week with a CTA — invite your audience to take action.',
  Saturday:  'Weekend posts get higher saves. Focus on inspirational content.',
  Sunday:    'Sunday evening is peak scroll time. Go emotional or storytelling.',
}

// Tone-based caption openers
const OPENERS: Record<string, string[]> = {
  Premium:      ['Introducing', 'Elevate your', 'The future of', 'Experience', 'Redefining'],
  Bold:         ['Stop scrolling.', 'Hot take:', "Here's the truth:", 'Unpopular opinion:', 'Game changer alert:'],
  Friendly:     ["We're so excited to share", 'Quick question:', "Here's something we love", 'Fun fact:', 'Have you ever wondered'],
  Professional: ['Announcing', 'Key insight:', 'Industry update:', 'Important reminder:', 'A word on'],
  Playful:      ['Okay but hear us out 👀', 'Not to brag but…', 'Plot twist:', 'POV:', '🚨 Alert:'],
  default:      ['Introducing', 'Sharing', 'Today we explore', 'Did you know', 'Meet'],
}

function getHashtags(industry: string, type: string): string[] {
  const base: Record<string, string[]> = {
    SaaS:    ['#SaaS', '#TechStartup', '#ProductUpdate', '#B2B', '#GrowthHacking'],
    Fintech: ['#Fintech', '#DigitalBanking', '#Payments', '#FinancialInclusion', '#MoneyTech'],
    Retail:  ['#Retail', '#ShopNow', '#NewArrival', '#Fashion', '#Lifestyle'],
    Agency:  ['#Agency', '#CreativeAgency', '#Marketing', '#Branding', '#DigitalMarketing'],
    default: ['#Business', '#Innovation', '#Growth', '#Brand', '#Digital'],
  }
  const typeTag = type.toLowerCase().replace(/ /g, '')
  const indu = base[industry] || base.default
  return [...indu.slice(0, 3), `#${typeTag}`, '#MoveDigital']
}

export function generateWeeklyBrief(industry: string, tone: string): WeeklyBrief {
  const themes = THEMES[industry] || THEMES.default
  const openers = OPENERS[tone] || OPENERS.default

  const now = new Date()
  // Snap to next Monday
  const diff = (1 - now.getDay() + 7) % 7 || 7
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() + (now.getDay() === 1 ? 0 : diff))

  const slots: DaySlot[] = DAYS.map((day, i) => {
    const [typeLabel, typeIcon] = themes[i]
    const format = FORMATS[i % FORMATS.length]
    const opener = openers[i % openers.length]
    const slotDate = new Date(weekStart)
    slotDate.setDate(weekStart.getDate() + i)

    return {
      day,
      date: slotDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }),
      format: format.value,
      formatLabel: format.label,
      formatIcon: format.icon,
      type: typeLabel.toLowerCase().replace(/ /g, '-'),
      typeLabel,
      typeIcon,
      headline: `${opener} — ${typeLabel} for ${industry}`,
      caption: `${opener} our latest ${typeLabel.toLowerCase()} content. Built specifically for ${industry} brands who want to stand out. ${tone === 'Bold' ? "Don't sleep on this." : 'See the link in bio.'} 💡`,
      hashtags: getHashtags(industry, typeLabel),
      bestTime: BEST_TIMES[day],
      tip: TIPS[day],
    }
  })

  return {
    industry,
    tone,
    generatedAt: now.toISOString(),
    weekStart: weekStart.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' }),
    slots,
  }
}
