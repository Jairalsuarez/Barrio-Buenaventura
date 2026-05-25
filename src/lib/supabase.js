import { createClient } from '@supabase/supabase-js'
import { getCookie, setCookie, removeCookie } from './cookies'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const cookieStorage = {
  getItem(key) {
    return getCookie('sb-' + key) || null
  },
  setItem(key, value) {
    setCookie('sb-' + key, value, 3600 * 24 * 365)
  },
  removeItem(key) {
    removeCookie('sb-' + key)
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: cookieStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
