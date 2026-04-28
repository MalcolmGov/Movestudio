import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Copy, Check, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { REGISTRY } from '../registry/index'

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copy}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function ComponentPage() {
  const { category, component } = useParams()
  const key = `${category}/${component}`
  const data = REGISTRY[key]
  const [tab, setTab] = useState<'preview' | 'code'>('preview')

  if (!data) {
    return (
      <div className="component-detail" style={{ paddingTop: 60, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⬡</div>
        <h2 style={{ marginBottom: 8 }}>Component coming soon</h2>
        <p style={{ color: 'var(--text-muted)' }}>This component is being built. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="component-detail">
      <div className="component-detail-header">
        <div className="breadcrumb">
          <span>Components</span>
          <ChevronRight size={12} />
          <span style={{ textTransform: 'capitalize' }}>{category?.replace('-', ' ')}</span>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--text)' }}>{data.name}</span>
        </div>
        <h2>{data.name}</h2>
        <p>{data.description}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {(['preview', 'code'] as const).map(t => (
          <button key={t} className={`toolbar-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'preview' ? (
        <motion.div
          className="preview-panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ minHeight: 360 }}
        >
          <div className="preview-panel-toolbar">
            <button className="toolbar-btn" onClick={() => setTab('code')}>View Code</button>
          </div>
          {data.preview}
        </motion.div>
      ) : (
        <div className="code-panel">
          <div className="code-panel-header">
            <span>{data.name}.tsx</span>
            <CopyButton code={data.code} />
          </div>
          <pre style={{ color: '#e2e8f0' }}>
            <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(data.code) }} />
          </pre>
        </div>
      )}

      {/* Props */}
      {data.props && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Props</h3>
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Prop', 'Type', 'Default', 'Description'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.props.map((p: any, i: number) => (
                  <tr key={p.name} style={{ borderBottom: i < data.props.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '10px 16px', fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 12 }}>{p.name}</td>
                    <td style={{ padding: '10px 16px', fontFamily: 'var(--mono)', color: '#c4b5fd', fontSize: 12 }}>{p.type}</td>
                    <td style={{ padding: '10px 16px', fontFamily: 'var(--mono)', color: 'var(--text-muted)', fontSize: 12 }}>{p.default}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--text-subtle)', fontSize: 12 }}>{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// Minimal syntax highlighter (no dependencies)
function syntaxHighlight(code: string): string {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(["'`])(.*?)\1/g, '<span style="color:#86efac">$1$2$1</span>')
    .replace(/\b(import|export|from|default|const|let|var|function|return|type|interface|extends|implements|new|true|false|null|undefined|if|else|for|while|class|async|await|of|in)\b/g, '<span style="color:#93c5fd">$1</span>')
    .replace(/\b(React|useState|useEffect|useRef|motion)\b/g, '<span style="color:#c4b5fd">$1</span>')
    .replace(/(\/\/.*)/g, '<span style="color:#475569">$1</span>')
}
