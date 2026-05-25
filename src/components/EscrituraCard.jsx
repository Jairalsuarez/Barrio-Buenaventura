import { useState, useRef, useCallback, useEffect } from 'react'
import { getCookie, setCookie } from '../lib/cookies'
import { getFraseDelDia } from '../lib/frases'

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    const test = current ? current + ' ' + word : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function fitTextLines(ctx, text, maxWidth, maxHeight, maxSize, minSize, lineRatio = 1.18) {
  for (let size = maxSize; size >= minSize; size -= 2) {
    ctx.font = `700 ${size}px Georgia, "Times New Roman", serif`
    const lines = wrapText(ctx, text, maxWidth)
    const lineHeight = size * lineRatio
    if (lines.length * lineHeight <= maxHeight) {
      return { lines, size, lineHeight }
    }
  }
  ctx.font = `700 ${minSize}px Georgia, "Times New Roman", serif`
  return { lines: wrapText(ctx, text, maxWidth), size: minSize, lineHeight: minSize * lineRatio }
}

async function generarImagen(frase) {
  await document.fonts.ready
  const w = 1080
  const h = 1080
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#f8f3eb'
  ctx.fillRect(0, 0, w, h)

  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#fbf8f2')
  bg.addColorStop(0.55, '#f3eadf')
  bg.addColorStop(1, '#efe2d2')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = 'rgba(140, 106, 67, 0.08)'
  ctx.beginPath()
  ctx.arc(90, 120, 210, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(1060, 930, 290, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = 'rgba(140, 106, 67, 0.18)'
  ctx.lineWidth = 3
  drawRoundRect(ctx, 64, 64, 952, 952, 46)
  ctx.stroke()

  ctx.fillStyle = '#8c6a43'
  ctx.font = '800 38px "Plus Jakarta Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '6px'
  ctx.fillText('BARRIO BUENAVENTURA', w / 2, 135)
  ctx.letterSpacing = '0px'

  ctx.strokeStyle = 'rgba(140, 106, 67, 0.36)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(405, 168)
  ctx.lineTo(675, 168)
  ctx.stroke()

  ctx.fillStyle = 'rgba(140, 106, 67, 0.12)'
  ctx.beginPath()
  ctx.ellipse(540, 824, 300, 38, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#8c6a43'
  ctx.lineWidth = 6
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(186, 268)
  ctx.bezierCurveTo(278, 206, 412, 206, 540, 268)
  ctx.bezierCurveTo(668, 206, 802, 206, 894, 268)
  ctx.lineTo(894, 784)
  ctx.bezierCurveTo(762, 718, 648, 718, 540, 784)
  ctx.bezierCurveTo(432, 718, 318, 718, 186, 784)
  ctx.closePath()
  ctx.stroke()

  ctx.strokeStyle = 'rgba(140, 106, 67, 0.74)'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(224, 318)
  ctx.bezierCurveTo(326, 274, 430, 278, 540, 322)
  ctx.bezierCurveTo(650, 278, 754, 274, 856, 318)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(222, 728)
  ctx.bezierCurveTo(330, 692, 432, 702, 540, 752)
  ctx.bezierCurveTo(648, 702, 750, 692, 858, 728)
  ctx.stroke()

  const maxTextWidth = 660
  const maxTextHeight = 300
  const maxSize = frase.texto.length > 145 ? 54 : frase.texto.length > 95 ? 66 : 78
  const fitted = fitTextLines(ctx, frase.texto, maxTextWidth, maxTextHeight, maxSize, 38)

  ctx.fillStyle = '#172033'
  ctx.textAlign = 'center'
  ctx.font = `700 ${fitted.size}px "EB Garamond", serif`
  const textStartY = 520 - ((fitted.lines.length - 1) * fitted.lineHeight) / 2
  fitted.lines.forEach((line, index) => {
    ctx.fillText(line, w / 2, textStartY + index * fitted.lineHeight)
  })

  ctx.fillStyle = '#8c6a43'
  ctx.font = '800 27px "Plus Jakarta Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(frase.referencia.toUpperCase(), w / 2, 690)

  ctx.strokeStyle = 'rgba(140, 106, 67, 0.26)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(430, 720)
  ctx.lineTo(650, 720)
  ctx.stroke()

  ctx.fillStyle = 'rgba(30, 41, 59, 0.62)'
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Escritura del dia', w / 2, 892)

  ctx.fillStyle = '#c6a27b'
  ctx.font = '700 18px "Plus Jakarta Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Creado por Fizzia', w / 2, 938)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.95))
}

function getScriptureLengthClass(texto) {
  if (texto.length > 145) return 'scripture-text-long'
  if (texto.length > 95) return 'scripture-text-medium'
  return 'scripture-text-short'
}

export default function EscrituraCard() {
  const [liked, setLiked] = useState(() => getCookie('scripture_liked') === true)

  useEffect(() => {
    const next = !liked
    setCookie('scripture_liked', next)
  }, [liked])

  const compartir = useCallback(async () => {
    if (!shareBlob) return
    setSharing(true)
    try {
      const file = new File([shareBlob], 'escritura-del-dia.png', { type: 'image/png' })
      const link = 'https://barriobuenaventura.vercel.app'
      const shareData = {
        files: [file],
        text: `Si vives en Buena Fe y buscas respuestas divinas, te invitamos a visitar nuestra capilla. Aprende mas en ${link}`
      }
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
      } else {
        const url = URL.createObjectURL(shareBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'escritura-del-dia.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (e) {
      if (e.name !== 'AbortError') console.error(e)
    }
    setSharing(false)
  }, [frase, shareBlob])

  return (
    <div className="mt-5 flex flex-col items-center">
      <div ref={cardRef} className="relative w-[92vw] max-w-[520px] mx-auto mt-4 scripture-book-revealed" style={{ perspective: '1200px' }}>
        <div className="relative scripture-animation-stage">
          <svg viewBox="0 0 500 425" className="w-full h-full overflow-visible" fill="none" aria-hidden="true">
            <g className="scripture-book-camera">
              <g className="scripture-book-shadow">
                <ellipse cx="250" cy="328" rx="156" ry="22" />
              </g>

              <g className="scripture-simple-book">
                <path d="M96 116C132 92 183 88 250 112C317 88 368 92 404 116V326C356 302 302 302 250 326C198 302 144 302 96 326V116Z" />
                <path d="M111 136C150 118 195 119 250 138C305 119 350 118 389 136" />
                <path d="M113 306C153 291 196 294 250 314C304 294 347 291 387 306" />

                <foreignObject x="106" y="136" width="288" height="154" className="scripture-page-copy scripture-page-copy-main">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="scripture-page-copy-inner">
                    <p className={textSizeClass}>{frase.texto}</p>
                  </div>
                </foreignObject>

                <foreignObject x="112" y="292" width="276" height="28" className="scripture-page-copy scripture-page-reference">
                  <div xmlns="http://www.w3.org/1999/xhtml" className="scripture-page-copy-inner">
                    <span>{frase.referencia}</span>
                  </div>
                </foreignObject>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={toggleLike}
            className="inline-flex items-center gap-1.5 text-xs text-[#64748b] dark:text-slate-400 bg-white dark:bg-white/8 rounded-full px-3.5 py-2 border border-[#e4dcd0] dark:border-white/10 hover:border-[#8c6a43]/30 transition-colors active:scale-95">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>
              favorite
            </span>
            {liked ? 'Te gusta' : 'Me gusta'}
          </button>
          <button onClick={compartir} disabled={sharing || !shareBlob}
            className="inline-flex items-center gap-1.5 text-xs text-[#64748b] dark:text-slate-400 bg-white dark:bg-white/8 rounded-full px-3.5 py-2 border border-[#e4dcd0] dark:border-white/10 hover:border-[#8c6a43]/30 transition-colors active:scale-95 disabled:opacity-50">
            <span className="material-symbols-outlined text-sm">ios_share</span>
            {!shareBlob ? 'Preparando...' : sharing ? 'Compartiendo...' : 'Compartir'}
          </button>
        </div>
      <div className="relative mt-5 w-full max-w-[340px]">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e4dcd0] dark:border-white/8" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#faf7f2] dark:bg-[#0f0f14] px-3 text-[9px] text-[#8c6a43]/60 dark:text-[#c6a27b]/50 uppercase tracking-[0.2em] font-semibold">social</span>
        </div>
      </div>
    </div>
  )
}
