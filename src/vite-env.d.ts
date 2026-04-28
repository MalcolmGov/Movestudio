/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORAGE_PROVIDER?: 'local' | 'supabase'
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_PUBLISH_PROVIDER?: 'local' | 'vercel'
  readonly VITE_PUBLISH_API_URL?: string
  readonly VITE_PUBLISH_DOMAIN_ROOT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
