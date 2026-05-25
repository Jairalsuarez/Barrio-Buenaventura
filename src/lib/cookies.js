const PREFIX = 'iglesia_bv_'
const YEAR = 365 * 24 * 60 * 60

export function getCookie(key) {
  const fullKey = PREFIX + key
  const match = document.cookie.match('(?:^|;)\\s*' + encodeURIComponent(fullKey) + '=([^;]*)')
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match[1]))
  } catch {
    return decodeURIComponent(match[1])
  }
}

export function setCookie(key, value, maxAge = YEAR) {
  const fullKey = PREFIX + key
  const encoded = encodeURIComponent(fullKey) + '=' + encodeURIComponent(JSON.stringify(value))
  document.cookie = encoded + `; path=/; max-age=${maxAge}; SameSite=Strict`
}

export function removeCookie(key) {
  const fullKey = PREFIX + key
  document.cookie = encodeURIComponent(fullKey) + '=; path=/; max-age=0'
}

export function getRawCookie(key) {
  const fullKey = PREFIX + key
  const match = document.cookie.match('(?:^|;)\\s*' + encodeURIComponent(fullKey) + '=([^;]*)')
  if (!match) return null
  return decodeURIComponent(match[1])
}
