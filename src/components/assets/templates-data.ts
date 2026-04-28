import type { AssetType } from '../../pages/BrandAssetsPage'

export interface Template {
  id: string
  label: string
  style: 'Bold' | 'Minimal' | 'Luxury' | 'Vibrant'
  text: Record<string, string>
}

const TEMPLATES: Record<string, Template[]> = {
  'business-card': [
    { id: 'bc-bold',    label: 'Bold',    style: 'Bold',    text: { name: 'Alex Johnson',  title: 'Chief Executive Officer',    tagline: 'Leading with purpose.', email: 'alex@company.com',  phone: '+27 82 000 0000', website: 'www.company.com' } },
    { id: 'bc-minimal', label: 'Minimal', style: 'Minimal', text: { name: 'Sam Williams', title: 'Creative Director',           tagline: 'Design is thinking.', email: 'sam@studio.com',    phone: '+27 83 000 0000', website: 'www.studio.com' } },
    { id: 'bc-luxury',  label: 'Luxury',  style: 'Luxury',  text: { name: 'Morgan Blake',  title: 'Managing Director',          tagline: 'Excellence in everything.', email: 'morgan@firm.com', phone: '+27 84 000 0000', website: 'www.firm.co.za' } },
    { id: 'bc-vibrant', label: 'Vibrant', style: 'Vibrant', text: { name: 'Jordan Lee',    title: 'Head of Growth & Innovation', tagline: 'Scale without limits.', email: 'jordan@startup.io', phone: '+27 85 000 0000', website: 'www.startup.io' } },
  ],
  'social-banner': [
    { id: 'sb-bold',    label: 'Bold',    style: 'Bold',    text: { headline: 'Launch Day is Here.', subheadline: 'The product the industry has been waiting for.', cta: 'Get Early Access' } },
    { id: 'sb-minimal', label: 'Minimal', style: 'Minimal', text: { headline: 'Introducing Something New.', subheadline: 'Clean. Simple. Powerful.', cta: 'Learn More' } },
    { id: 'sb-luxury',  label: 'Luxury',  style: 'Luxury',  text: { headline: 'Crafted for the Few.', subheadline: 'Premium solutions for discerning professionals.', cta: 'Request Access' } },
    { id: 'sb-vibrant', label: 'Vibrant', style: 'Vibrant', text: { headline: 'We\'re Growing Fast 🚀', subheadline: 'Join 10,000+ users already on the platform.', cta: 'Join Free' } },
  ],
  instagram: [
    { id: 'ig-bold',    label: 'Bold',    style: 'Bold',    text: { headline: 'Big Things Coming.', subheadline: 'Stay tuned', emoji: '⚡', company: 'Brand' } },
    { id: 'ig-minimal', label: 'Minimal', style: 'Minimal', text: { headline: 'Less is more.', subheadline: 'Minimalism redefined', emoji: '○', company: 'Brand' } },
    { id: 'ig-luxury',  label: 'Luxury',  style: 'Luxury',  text: { headline: 'Crafted with Care.', subheadline: 'Premium by design', emoji: '✦', company: 'Brand' } },
    { id: 'ig-vibrant', label: 'Vibrant', style: 'Vibrant', text: { headline: 'Let\'s Go! 🎉', subheadline: 'New drop alert', emoji: '🔥', company: 'Brand' } },
  ],
  'email-header': [
    { id: 'eh-bold',    label: 'Bold',    style: 'Bold',    text: { headline: 'Monthly Dispatch', subheadline: 'All the updates worth reading.', company: 'Company' } },
    { id: 'eh-minimal', label: 'Minimal', style: 'Minimal', text: { headline: 'The Brief',        subheadline: 'Simple. Direct. Useful.', company: 'Company' } },
    { id: 'eh-luxury',  label: 'Luxury',  style: 'Luxury',  text: { headline: 'The Insider',      subheadline: 'Curated for the discerning few.', company: 'Company' } },
    { id: 'eh-vibrant', label: 'Vibrant', style: 'Vibrant', text: { headline: 'This Week 🚀',    subheadline: 'Fresh content, hot off the press.', company: 'Company' } },
  ],
  flyer: [
    { id: 'fl-bold',    label: 'Bold',    style: 'Bold',    text: { headline: 'Grand Opening', body: 'You\'re invited to celebrate the launch of our newest location. Food, music, and exclusive deals await.', date: '26 April 2025', location: 'Cape Town, SA', cta: 'RSVP Today' } },
    { id: 'fl-minimal', label: 'Minimal', style: 'Minimal', text: { headline: 'Exclusive Event', body: 'An intimate evening for our top clients and partners. Limited seats available.', date: '10 May 2025', location: 'Sandton, JHB', cta: 'Reserve Your Seat' } },
    { id: 'fl-luxury',  label: 'Luxury',  style: 'Luxury',  text: { headline: 'Private Gala',   body: 'Join us for an evening of fine dining, networking, and celebrating another year of excellence.', date: '15 June 2025', location: 'Franschhoek, WC', cta: 'Request Invitation' } },
    { id: 'fl-vibrant', label: 'Vibrant', style: 'Vibrant', text: { headline: 'Pop-Up Market 🎊', body: 'Shop local, eat great food, and vibe with your community. Family friendly. Free entry.', date: '5 April 2025', location: 'Sea Point, CT', cta: 'See You There!' } },
  ],
  poster: [
    { id: 'po-bold',    label: 'Bold',    style: 'Bold',    text: { headline: 'Change Starts Now.', body: 'Bold ideas deserve bold execution. We help ambitious brands grow without limits.', cta: 'Start Today', website: 'www.company.com' } },
    { id: 'po-minimal', label: 'Minimal', style: 'Minimal', text: { headline: 'Less Noise.\nMore Signal.', body: 'In a world of distractions, clarity is your competitive advantage.', cta: 'Learn More', website: 'www.company.com' } },
    { id: 'po-luxury',  label: 'Luxury',  style: 'Luxury',  text: { headline: 'The Standard\nof Excellence.', body: 'For those who refuse to compromise. Premium service, bespoke results.', cta: 'Enquire Now', website: 'www.company.com' } },
    { id: 'po-vibrant', label: 'Vibrant', style: 'Vibrant', text: { headline: 'Built Different. 🚀', body: 'We\'re not just another agency. We\'re the last one you\'ll ever need.', cta: 'Get Started', website: 'www.company.com' } },
  ],
}

export function getTemplates(asset: AssetType): Template[] {
  return TEMPLATES[asset] || []
}
