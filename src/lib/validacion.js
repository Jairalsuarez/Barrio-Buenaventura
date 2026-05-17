export function soloLetras(valor) {
  return /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(valor)
}

export function sanitizarNombre(valor) {
  return valor.trim().replace(/\s+/g, ' ')
}

export function validarNombre(valor, campo) {
  const limpio = sanitizarNombre(valor)
  if (!limpio) return `El ${campo} es obligatorio`
  if (limpio.length < 2) return `El ${campo} debe tener al menos 2 caracteres`
  if (limpio.length > 100) return `El ${campo} es demasiado largo`
  if (!soloLetras(limpio)) return `El ${campo} solo puede contener letras`
  return ''
}

export function validarLlamamientoPersonalizado(valor) {
  const limpio = sanitizarNombre(valor)
  if (!limpio) return ''
  if (!soloLetras(limpio)) return 'Solo puede contener letras'
  if (limpio.length > 200) return 'Es demasiado largo'
  return ''
}

export function validarTelefono(valor) {
  const limpio = valor.trim()
  if (!limpio) return 'El teléfono es obligatorio'
  const soloDigitos = limpio.replace(/[\s\-+]/g, '')
  if (soloDigitos.length < 7 || soloDigitos.length > 20) return 'Ingresa un teléfono válido'
  return ''
}

export function validarFeedback(valor) {
  const limpio = valor.trim()
  if (!limpio) return 'Escribe un mensaje'
  if (limpio.length > 2000) return 'El mensaje es demasiado largo (máx. 2000 caracteres)'
  return ''
}
