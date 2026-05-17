const PALABRAS_BLOQUEADAS = [
  'pendejo', 'puta', 'puto', 'mierda', 'coño', 'carajo', 'verga',
  'chingada', 'chingar', 'cabron', 'cabrón', 'estupido', 'estúpido',
  'idiota', 'imbecil', 'imbécil', 'tonto', 'tarado', 'maldito',
  'hijueputa', 'hp', 'gtfo', 'fuck', 'shit', 'bitch', 'asshole',
  'bastardo', 'desgraciado', 'pendejada', 'webon', 'wey', 'güey',
  'pendejazo', 'culero', 'cula', 'marica', 'maricon', 'maricón',
]

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

export function validarNombreCompleto(valor) {
  const partes = sanitizarNombre(valor).split(' ')
  if (partes.length < 2) return 'Ingresa tu nombre y apellido separados por un espacio'
  if (partes.length > 2) return 'Solo ingresa tu nombre y un apellido'
  const [nombre, apellido] = partes
  if (nombre.length < 2) return 'El nombre debe tener al menos 2 caracteres'
  if (apellido.length < 2) return 'El apellido debe tener al menos 2 caracteres'
  if (!soloLetras(nombre)) return 'El nombre solo puede contener letras'
  if (!soloLetras(apellido)) return 'El apellido solo puede contener letras'

  const textoCompleto = (nombre + ' ' + apellido).toLowerCase()
  for (const palabra of PALABRAS_BLOQUEADAS) {
    if (textoCompleto.includes(palabra)) return 'Ingresa un nombre válido'
  }

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
