/**
 * WhatsAppShareButton.tsx
 * Self-contained button for sharing Ad Special posters to WhatsApp (status + chat)
 * and copying share links. Drops into the editor toolbar.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { posterToShareableBlob, shareViaWhatsApp } from '../utils/whatsappShare'
import { addNotification } from '../utils/notifications'

interface Props {
  canvasElementId: string  // e.g. 'ad-special-canvas-root'
  brandColor: string       // kit.primary; used as background fill behind the poster
  filenameBase: string     // e.g. 'movestudio-weekend-specials'
  posterSummary: string    // one-line summary for the share text, e.g. 'Weekend Specials at Khwema Tuck Shop'
}

type ShareMode = 'status' | 'chat' | 'link'

export default function WhatsAppShareButton({
  canvasElementId,
  brandColor,
  filenameBase,
  posterSummary,
}: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<ShareMode | null>(null)

  const handleShareStatus = async () => {
    setLoading('status')
    try {
      const blob = await posterToShareableBlob(canvasElementId, 'status', brandColor)
      if (!blob) {
        addNotification(
          'Could not prepare image',
          'The poster element is missing. Check the editor is fully loaded.',
          'warning'
        )
        return
      }

      const fallbackText = `📱 ${posterSummary}\n\nShare this with your customers on WhatsApp!`
      const result = await shareViaWhatsApp(blob, fallbackText, fallbackText)

      if (result === 'native') {
        addNotification('Sharing…', 'Your device is handling the share.', 'success')
      } else if (result === 'wa.me') {
        addNotification(
          'Opening WhatsApp Web',
          'Your browser is opening WhatsApp Web. Paste the image there.',
          'info'
        )
      } else {
        addNotification(
          'Share failed',
          'Could not open WhatsApp. Check your connection or try manually.',
          'warning'
        )
      }
      setOpen(false)
    } catch (err) {
      console.error('Share to status failed:', err)
      addNotification('Share failed', 'An error occurred. Check the console.', 'warning')
    } finally {
      setLoading(null)
    }
  }

  const handleShareChat = async () => {
    setLoading('chat')
    try {
      const blob = await posterToShareableBlob(canvasElementId, 'square', brandColor)
      if (!blob) {
        addNotification(
          'Could not prepare image',
          'The poster element is missing. Check the editor is fully loaded.',
          'warning'
        )
        return
      }

      const fallbackText = `📱 ${posterSummary}\n\nShare this with your customers on WhatsApp!`
      const result = await shareViaWhatsApp(blob, fallbackText, fallbackText)

      if (result === 'native') {
        addNotification('Sharing…', 'Your device is handling the share.', 'success')
      } else if (result === 'wa.me') {
        addNotification(
          'Opening WhatsApp Web',
          'Your browser is opening WhatsApp Web. Paste the image there.',
          'info'
        )
      } else {
        addNotification(
          'Share failed',
          'Could not open WhatsApp. Check your connection or try manually.',
          'warning'
        )
      }
      setOpen(false)
    } catch (err) {
      console.error('Share to chat failed:', err)
      addNotification('Share failed', 'An error occurred. Check the console.', 'warning')
    } finally {
      setLoading(null)
    }
  }

  const handleCopyLink = async () => {
    setLoading('link')
    try {
      const fallbackText = `📱 ${posterSummary}\n\nShare this with your customers on WhatsApp!`
      const encodedText = encodeURIComponent(fallbackText)
      const waLink = `https://wa.me/?text=${encodedText}`

      await navigator.clipboard.writeText(waLink)
      addNotification('Link copied!', 'WhatsApp share link is in your clipboard.', 'success')
      setOpen(false)
    } catch (err) {
      console.error('Copy link failed:', err)
      addNotification(
        'Could not copy',
        'Your browser might not support clipboard. Try a different browser.',
        'warning'
      )
    } finally {
      setLoading(null)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        style={{
          padding: '9px 14px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.04)',
          color: 'white',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
          fontFamily: 'var(--font)',
        }}
      >
        💬 Share on WhatsApp
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Click-outside overlay */}
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 999,
              }}
              onClick={() => setOpen(false)}
            />

            {/* Popover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: -8 }}
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                zIndex: 1000,
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(15, 20, 36, 0.98)',
                borderRadius: 12,
                padding: 12,
                minWidth: 240,
                backdropFilter: 'blur(8px)',
              }}
            >
              <ShareOption
                icon="📱"
                label="Share to Status"
                sublabel="1080×1920 vertical"
                loading={loading === 'status'}
                onClick={handleShareStatus}
              />
              <ShareOption
                icon="💬"
                label="Share to Chat"
                sublabel="1080×1080 square"
                loading={loading === 'chat'}
                onClick={handleShareChat}
              />
              <ShareOption
                icon="🔗"
                label="Copy share link"
                sublabel="wa.me with poster info"
                loading={loading === 'link'}
                onClick={handleCopyLink}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function ShareOption({
  icon,
  label,
  sublabel,
  loading,
  onClick,
}: {
  icon: string
  label: string
  sublabel: string
  loading: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 10px',
        borderRadius: 8,
        border: '1px solid transparent',
        background: 'transparent',
        color: 'white',
        cursor: loading ? 'wait' : 'pointer',
        fontFamily: 'var(--font)',
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 6,
        textAlign: 'left',
        transition: 'background-color 0.2s ease',
      }}
    >
      <span style={{ fontSize: 18, minWidth: 24, textAlign: 'center' }}>
        {loading ? '⏳' : icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: 'white', fontWeight: 600, marginBottom: 2 }}>{label}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}>
          {sublabel}
        </div>
      </div>
    </motion.button>
  )
}
