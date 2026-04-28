/**
 * notifications.ts
 * In-app notification queue stored in localStorage.
 */

export type NotificationType = 'success' | 'info' | 'warning'

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  read: boolean
  createdAt: string
}

const KEY = 'ms_notifications'

export function getNotifications(): AppNotification[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function addNotification(title: string, body: string, type: NotificationType = 'info'): void {
  const notifications = getNotifications()
  notifications.unshift({
    id: Math.random().toString(36).slice(2),
    type, title, body, read: false,
    createdAt: new Date().toISOString(),
  })
  // Keep max 20 notifications
  localStorage.setItem(KEY, JSON.stringify(notifications.slice(0, 20)))
  // Dispatch custom event so the bell re-renders
  window.dispatchEvent(new Event('ms_notification'))
}

export function markAllRead(): void {
  const notifications = getNotifications().map(n => ({ ...n, read: true }))
  localStorage.setItem(KEY, JSON.stringify(notifications))
  window.dispatchEvent(new Event('ms_notification'))
}

export function clearNotifications(): void {
  localStorage.setItem(KEY, '[]')
  window.dispatchEvent(new Event('ms_notification'))
}

export function unreadCount(): number {
  return getNotifications().filter(n => !n.read).length
}
