const SESSION_KEY = 'iglesia_bv_session'
const GUEST_KEY = 'iglesia_bv_guest'

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  localStorage.removeItem(GUEST_KEY)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(GUEST_KEY)
}

export function isGuest() {
  return localStorage.getItem(GUEST_KEY) === 'true'
}

export function setGuest() {
  localStorage.setItem(GUEST_KEY, 'true')
  localStorage.removeItem(SESSION_KEY)
}

export function isLoggedIn() {
  return !!getSession() || isGuest()
}

export const LLAMAMIENTOS = [
  { value: 'Obispo', label: 'Obispo' },
  { value: 'Primer Consejero', label: 'Primer Consejero' },
  { value: 'Segundo Consejero', label: 'Segundo Consejero' },
  { value: 'Presidente Quorum Elderes', label: 'Presidente del Quórum de Élderes' },
  { value: 'Presidenta Sociedad Socorro', label: 'Presidenta de la Sociedad de Socorro' },
  { value: 'Presidenta Escuela Dominical', label: 'Presidenta de la Escuela Dominical' },
  { value: 'Secretario de Barrio', label: 'Secretario(a) de Barrio' },
  { value: 'Presidenta Primaria', label: 'Presidenta de la Primaria' },
  { value: 'Presidenta Mujeres Jovenes', label: 'Presidenta de las Mujeres Jóvenes' },
  { value: 'Otro', label: 'Otro' },
  { value: 'Ninguno', label: 'Ninguno' },
]

export function esLlamamientoPredefinido(llamamiento) {
  return llamamiento && llamamiento !== 'Otro' && llamamiento !== 'Ninguno'
}

export const PERFILES = [
  { value: 'miembro', label: 'Miembro de la Iglesia' },
  { value: 'conociendo', label: 'Estoy conociendo la Iglesia' },
  { value: 'regresando', label: 'Estoy regresando a la Iglesia' },
  { value: 'invitado', label: 'Invitado / Visitante' },
]
