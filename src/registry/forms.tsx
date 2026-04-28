import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'

function InputDemo() {
  const [focused, setFocused] = useState(false)
  const [val, setVal] = useState('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 280 }}>
      {[{ label: 'Email', placeholder: 'you@move.africa', type: 'email' }, { label: 'Password', placeholder: '••••••••', type: 'password' }].map(({ label, placeholder, type }) => (
        <div key={label}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>{label}</label>
          <input type={type} placeholder={placeholder}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${focused ? 'rgba(103,232,249,0.5)' : 'rgba(255,255,255,0.1)'}`, background: 'rgba(255,255,255,0.04)', color: 'white', fontFamily: 'var(--font)', fontSize: 13, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
        </div>
      ))}
    </div>
  )
}

function TextareaDemo() {
  return (
    <div style={{ width: 280 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Message</label>
      <textarea placeholder="Type your message..." rows={4}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontFamily: 'var(--font)', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = 'rgba(103,232,249,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
    </div>
  )
}

function SelectDemo() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('Select country...')
  const options = ['South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Egypt']
  return (
    <div style={{ position: 'relative', width: 240 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${open ? 'rgba(103,232,249,0.5)' : 'rgba(255,255,255,0.1)'}`, background: 'rgba(255,255,255,0.04)', color: selected.includes('Select') ? 'var(--text-muted)' : 'white', fontFamily: 'var(--font)', fontSize: 13, cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {selected}
        <motion.span animate={{ rotate: open ? 180 : 0 }} style={{ color: '#67e8f9', fontSize: 10 }}>▼</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden', zIndex: 50 }}>
            {options.map(o => (
              <div key={o} onClick={() => { setSelected(o); setOpen(false) }}
                style={{ padding: '9px 14px', fontSize: 13, color: o === selected ? '#67e8f9' : 'white', cursor: 'pointer', background: o === selected ? 'rgba(103,232,249,0.08)' : 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = o === selected ? 'rgba(103,232,249,0.08)' : 'transparent')}>
                {o}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CheckboxDemo() {
  const items = ['Payments', 'KYC Verification', 'Analytics', 'Notifications']
  const [checked, setChecked] = useState<string[]>(['Payments'])
  const toggle = (item: string) => setChecked(c => c.includes(item) ? c.filter(i => i !== item) : [...c, item])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map(item => (
        <label key={item} onClick={() => toggle(item)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <motion.div animate={{ background: checked.includes(item) ? '#3b82f6' : 'rgba(255,255,255,0.05)', borderColor: checked.includes(item) ? '#3b82f6' : 'rgba(255,255,255,0.2)' }}
            style={{ width: 18, height: 18, borderRadius: 5, border: '1.5px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {checked.includes(item) && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: 'white', fontSize: 11 }}>✓</motion.span>}
          </motion.div>
          <span style={{ fontSize: 13, color: 'white' }}>{item}</span>
        </label>
      ))}
    </div>
  )
}

function RadioDemo() {
  const [val, setVal] = useState('monthly')
  const opts = [{ value: 'monthly', label: 'Monthly', sub: 'Billed every month' }, { value: 'annual', label: 'Annual', sub: 'Save 20%' }]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 260 }}>
      {opts.map(o => (
        <label key={o.value} onClick={() => setVal(o.value)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: `1px solid ${val === o.value ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`, background: val === o.value ? 'rgba(59,130,246,0.08)' : 'transparent', cursor: 'pointer' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${val === o.value ? '#3b82f6' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {val === o.value && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{o.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.sub}</div>
          </div>
        </label>
      ))}
    </div>
  )
}

function SliderDemo() {
  const [val, setVal] = useState(65)
  return (
    <div style={{ width: 260 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Transaction Limit</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#67e8f9' }}>R{val}k</span>
      </div>
      <div style={{ position: 'relative', height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>
        <div style={{ position: 'absolute', left: 0, width: `${val}%`, height: '100%', borderRadius: 99, background: 'linear-gradient(to right,#3b82f6,#8b5cf6)' }} />
        <input type="range" min={0} max={100} value={val} onChange={e => setVal(+e.target.value)}
          style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', cursor: 'pointer' }} />
        <motion.div style={{ position: 'absolute', top: '50%', left: `${val}%`, transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: '50%', background: 'white', boxShadow: '0 0 0 3px #3b82f6, 0 2px 8px rgba(0,0,0,0.4)', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}

function OTPDemo() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null))
  const handleChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return
    const next = [...otp]; next[i] = v; setOtp(next)
    if (v && i < 5) refs[i + 1].current?.focus()
  }
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, textAlign: 'center' }}>Enter verification code</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {otp.map((d, i) => (
          <input key={i} ref={refs[i]} value={d} maxLength={1} onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => e.key === 'Backspace' && !d && i > 0 && refs[i - 1].current?.focus()}
            style={{ width: 44, height: 52, textAlign: 'center', fontSize: 20, fontWeight: 700, borderRadius: 10, border: `1.5px solid ${d ? 'rgba(103,232,249,0.6)' : 'rgba(255,255,255,0.1)'}`, background: 'rgba(255,255,255,0.04)', color: '#67e8f9', fontFamily: 'var(--mono)', outline: 'none' }} />
        ))}
      </div>
    </div>
  )
}

function SwitchDemo() {
  const items = [{ label: 'Two-Factor Auth', on: true }, { label: 'Email Alerts', on: false }, { label: 'SMS Notifications', on: true }]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map(({ label, on: defaultOn }) => {
        const [on, setOn] = useState(defaultOn)
        return (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 260 }}>
            <span style={{ fontSize: 13, color: 'white' }}>{label}</span>
            <div onClick={() => setOn(o => !o)} style={{ width: 44, height: 24, borderRadius: 99, cursor: 'pointer', position: 'relative', background: on ? '#3b82f6' : 'rgba(255,255,255,0.1)', transition: 'background 0.25s' }}>
              <motion.div animate={{ x: on ? 22 : 2 }} style={{ position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: 'white' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const FORMS_REGISTRY: Record<string, any> = {
  'forms/input': { name: 'Input', description: 'Styled text input with focus ring and label — supports all HTML input types.', preview: <InputDemo />, code: `// Install: npm install radix-ui\nimport * as Label from '@radix-ui/react-label'\n\nexport function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {\n  return (\n    <div>\n      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>{label}</label>\n      <input\n        {...props}\n        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 13, outline: 'none' }}\n        onFocus={e => e.target.style.borderColor = 'rgba(103,232,249,0.5)'}\n        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}\n      />\n    </div>\n  )\n}`, props: [{ name: 'label', type: 'string', default: '—', desc: 'Input label text' }, { name: '...props', type: 'InputHTMLAttributes', default: '—', desc: 'All native input props' }] },
  'forms/textarea': { name: 'Textarea', description: 'Auto-styled multiline input with focus ring — resizable by default.', preview: <TextareaDemo />, code: `export function Textarea({ label, rows = 4, ...props }: { label: string; rows?: number } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {\n  return (\n    <div>\n      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>{label}</label>\n      <textarea rows={rows} {...props}\n        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: 13, outline: 'none', resize: 'vertical' }}\n      />\n    </div>\n  )\n}`, props: [{ name: 'label', type: 'string', default: '—', desc: 'Textarea label' }, { name: 'rows', type: 'number', default: '4', desc: 'Initial visible rows' }] },
  'forms/select': { name: 'Select', description: 'Custom dropdown select with animated option list — built on Radix Select primitive.', preview: <SelectDemo />, code: `// Install: npm install radix-ui\nimport * as Select from '@radix-ui/react-select'\n\nexport function SelectField({ label, options, placeholder }: { label?: string; options: string[]; placeholder?: string }) {\n  return (\n    <Select.Root>\n      {label && <Select.Label>{label}</Select.Label>}\n      <Select.Trigger style={{ /* your dark styles */ }}>\n        <Select.Value placeholder={placeholder} />\n        <Select.Icon>▼</Select.Icon>\n      </Select.Trigger>\n      <Select.Portal>\n        <Select.Content style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}>\n          <Select.Viewport>\n            {options.map(opt => (\n              <Select.Item key={opt} value={opt} style={{ padding: '9px 14px', cursor: 'pointer' }}>\n                <Select.ItemText>{opt}</Select.ItemText>\n              </Select.Item>\n            ))}\n          </Select.Viewport>\n        </Select.Content>\n      </Select.Portal>\n    </Select.Root>\n  )\n}`, props: [{ name: 'options', type: 'string[]', default: '—', desc: 'Dropdown options' }, { name: 'placeholder', type: 'string', default: 'undefined', desc: 'Placeholder text' }] },
  'forms/checkbox': { name: 'Checkbox', description: 'Animated checkbox with spring check mark — group-friendly with controlled state.', preview: <CheckboxDemo />, code: `// Install: npm install radix-ui\nimport * as Checkbox from '@radix-ui/react-checkbox'\nimport { motion } from 'framer-motion'\n\nexport function CheckboxField({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {\n  return (\n    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>\n      <Checkbox.Root checked={checked} onCheckedChange={onCheckedChange}\n        style={{ width: 18, height: 18, borderRadius: 5, border: \`1.5px solid \${checked ? '#3b82f6' : 'rgba(255,255,255,0.2)'}\`, background: checked ? '#3b82f6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>\n        <Checkbox.Indicator>\n          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: 'white', fontSize: 11 }}>✓</motion.span>\n        </Checkbox.Indicator>\n      </Checkbox.Root>\n      {label}\n    </label>\n  )\n}`, props: [{ name: 'label', type: 'string', default: '—', desc: 'Checkbox label' }, { name: 'checked', type: 'boolean', default: 'false', desc: 'Controlled checked state' }, { name: 'onCheckedChange', type: '(v: boolean) => void', default: '—', desc: 'Change handler' }] },
  'forms/radio': { name: 'Radio Group', description: 'Card-style radio group with animated selection indicator — great for plan pickers.', preview: <RadioDemo />, code: `// Install: npm install radix-ui\nimport * as RadioGroup from '@radix-ui/react-radio-group'\n\nexport function RadioCard({ options }: { options: { value: string; label: string; sub?: string }[] }) {\n  return (\n    <RadioGroup.Root style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>\n      {options.map(o => (\n        <RadioGroup.Item key={o.value} value={o.value}\n          style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', cursor: 'pointer' }}>\n          <RadioGroup.Indicator />\n          <div style={{ fontWeight: 600 }}>{o.label}</div>\n          {o.sub && <div style={{ fontSize: 11, opacity: 0.5 }}>{o.sub}</div>}\n        </RadioGroup.Item>\n      ))}\n    </RadioGroup.Root>\n  )\n}`, props: [{ name: 'options', type: '{ value, label, sub? }[]', default: '—', desc: 'Radio options array' }] },
  'forms/slider': { name: 'Slider', description: 'Range slider with gradient track and custom thumb — great for limits and thresholds.', preview: <SliderDemo />, code: `// Install: npm install radix-ui\nimport * as Slider from '@radix-ui/react-slider'\n\nexport function SliderField({ label, value, onValueChange, min = 0, max = 100 }: { label: string; value: number; onValueChange: (v: number[]) => void; min?: number; max?: number }) {\n  return (\n    <div>\n      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>\n        <span>{label}</span><span>{value}</span>\n      </div>\n      <Slider.Root value={[value]} onValueChange={onValueChange} min={min} max={max}\n        style={{ position: 'relative', height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>\n        <Slider.Track><Slider.Range style={{ background: 'linear-gradient(to right,#3b82f6,#8b5cf6)' }} /></Slider.Track>\n        <Slider.Thumb style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', boxShadow: '0 0 0 3px #3b82f6' }} />\n      </Slider.Root>\n    </div>\n  )\n}`, props: [{ name: 'value', type: 'number', default: '0', desc: 'Controlled value' }, { name: 'min', type: 'number', default: '0', desc: 'Minimum value' }, { name: 'max', type: 'number', default: '100', desc: 'Maximum value' }] },
  'forms/otp-input': { name: 'OTP Input', description: 'Six-digit OTP input with auto-focus progression — perfect for 2FA flows.', preview: <OTPDemo />, code: `import { useState, useRef } from 'react'\n\nexport function OTPInput({ length = 6, onComplete }: { length?: number; onComplete?: (code: string) => void }) {\n  const [otp, setOtp] = useState(Array(length).fill(''))\n  const refs = Array.from({ length }, () => useRef<HTMLInputElement>(null))\n\n  const handleChange = (i: number, v: string) => {\n    if (!/^\\d?$/.test(v)) return\n    const next = [...otp]; next[i] = v; setOtp(next)\n    if (v && i < length - 1) refs[i + 1].current?.focus()\n    if (next.every(Boolean)) onComplete?.(next.join(''))\n  }\n\n  return (\n    <div style={{ display: 'flex', gap: 8 }}>\n      {otp.map((d, i) => (\n        <input key={i} ref={refs[i]} value={d} maxLength={1}\n          onChange={e => handleChange(i, e.target.value)}\n          onKeyDown={e => e.key === 'Backspace' && !d && i > 0 && refs[i-1].current?.focus()}\n          style={{ width: 44, height: 52, textAlign: 'center', fontSize: 20, fontWeight: 700, borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#67e8f9', fontFamily: 'monospace', outline: 'none' }}\n        />\n      ))}\n    </div>\n  )\n}`, props: [{ name: 'length', type: 'number', default: '6', desc: 'Number of OTP digits' }, { name: 'onComplete', type: '(code: string) => void', default: 'undefined', desc: 'Fires when all digits entered' }] },
  'forms/switch': { name: 'Switch', description: 'iOS-style toggle switch — use for settings, permissions, and preferences.', preview: <SwitchDemo />, code: `// Install: npm install radix-ui\nimport * as Switch from '@radix-ui/react-switch'\nimport { motion } from 'framer-motion'\n\nexport function SwitchField({ label, checked, onCheckedChange }: { label: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {\n  return (\n    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>\n      <span style={{ fontSize: 13, color: 'white' }}>{label}</span>\n      <Switch.Root checked={checked} onCheckedChange={onCheckedChange}\n        style={{ width: 44, height: 24, borderRadius: 99, background: checked ? '#3b82f6' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', border: 'none' }}>\n        <Switch.Thumb asChild>\n          <motion.div animate={{ x: checked ? 22 : 2 }}\n            style={{ position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: 'white' }} />\n        </Switch.Thumb>\n      </Switch.Root>\n    </div>\n  )\n}`, props: [{ name: 'label', type: 'string', default: '—', desc: 'Setting label' }, { name: 'checked', type: 'boolean', default: 'false', desc: 'Controlled on/off state' }, { name: 'onCheckedChange', type: '(v: boolean) => void', default: '—', desc: 'Change handler' }] },
}
