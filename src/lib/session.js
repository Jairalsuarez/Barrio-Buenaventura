import { getCookie, setCookie, removeCookie } from './cookies'

export function getNombre() {
  return getCookie('nombre') || ''
}

export function setNombre(name) {
  setCookie('nombre', name)
}

export function clearNombre() {
  removeCookie('nombre')
}

export function getDarkMode() {
  return getCookie('dark') === true
}

export function setDarkMode(dark) {
  setCookie('dark', dark)
}

export const LLAMAMIENTOS = [
  { value: 'Obispo', label: 'Obispo' },
  { value: 'Primer Consejero', label: 'Primer Consejero' },
  { value: 'Segundo Consejero', label: 'Segundo Consejero' },
  { value: 'Presidente Quorum Elderes', label: 'Presidente del Quórum de Élderes' },
  { value: 'Presidenta Sociedad Socorro', label: 'Presidenta de la Sociedad de Socorro' },
  { value: 'Presidente Escuela Dominical', label: 'Presidente(a) de la Escuela Dominical' },
  { value: 'Secretario de Barrio', label: 'Secretario de Barrio' },
  { value: 'Presidenta Primaria', label: 'Presidenta de la Primaria' },
  { value: 'Presidenta Mujeres Jovenes', label: 'Presidenta de las Mujeres Jóvenes' },
  { value: 'Otro', label: 'Otro' },
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
