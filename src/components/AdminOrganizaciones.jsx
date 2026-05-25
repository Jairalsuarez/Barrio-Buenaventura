import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { LLAMAMIENTOS } from '../lib/session'
import Spinner from './ui/Spinner'
import Card from './ui/Card'

const ORGS_BY_LLAMAMIENTO = {
  'Obispo': null,
  'Presidente Quorum Elderes': 'Presidencia del Quórum de Élderes',
  'Presidenta Sociedad Socorro': 'Presidencia de la Sociedad de Socorro',
  'Presidenta Escuela Dominical': 'Presidencia de la Escuela Dominical',
  'Presidenta Primaria': 'Presidencia de la Primaria',
  'Presidenta Mujeres Jovenes': 'Presidencia de las Mujeres Jóvenes',
}

const ORG_LABELS = {
  'Presidente Quorum Elderes': { org: 'Quórum de Élderes', title: 'Presidencia del Quórum de Élderes' },
  'Presidenta Sociedad Socorro': { org: 'Sociedad de Socorro', title: 'Presidencia de la Sociedad de Socorro' },
  'Presidenta Escuela Dominical': { org: 'Escuela Dominical', title: 'Presidencia de la Escuela Dominical' },
  'Presidenta Primaria': { org: 'Primaria', title: 'Presidencia de la Primaria' },
  'Presidenta Mujeres Jovenes': { org: 'Mujeres Jóvenes', title: 'Presidencia de las Mujeres Jóvenes' },
}

export default function AdminOrganizaciones({ userLlamamiento }) {
  const [miembros, setMiembros] = useState([])
  const [loading, setLoading] = useState(true)

  const isObispo = userLlamamiento === 'Obispo'
  const esPresidente = LLAMAMIENTOS.some(l => l.value === userLlamamiento && l.value.startsWith('President'))
  const miOrg = !isObispo && esPresidente ? ORG_LABELS[userLlamamiento] : null

  useEffect(() => {
    setLoading(true)

    let llamamientosFilter = []

    if (isObispo) {
      llamamientosFilter = [
        'Presidente Quorum Elderes',
        'Presidenta Sociedad Socorro',
        'Presidenta Escuela Dominical',
        'Presidenta Primaria',
        'Presidenta Mujeres Jovenes',
        'Primer Consejero',
        'Segundo Consejero',
        'Secretario de Barrio',
      ]
    } else if (esPresidente) {
      const llamamientoKey = userLlamamiento
      const orgInfo = ORGS_BY_LLAMAMIENTO[llamamientoKey]
      supabase
        .from('usuarios')
        .select('*')
        .eq('llamamiento', llamamientoKey)
        .order('apellido')
        .then(({ data }) => {
          if (data) setMiembros(data)
          setLoading(false)
        })
      return
    }

    if (llamamientosFilter.length > 0) {
      supabase
        .from('usuarios')
        .select('*')
        .in('llamamiento', llamamientosFilter)
        .order('llamamiento')
        .order('apellido')
        .then(({ data }) => {
          if (data) setMiembros(data)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [userLlamamiento, isObispo, esPresidente])

  if (loading) return <div className="flex justify-center py-8"><Spinner /></div>

  const showAllOrgs = (miembros.length > 0 && isObispo)

  if (showAllOrgs) {
    const grouped = {}
    miembros.forEach(m => {
      const key = m.llamamiento
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(m)
    })

    return (
      <div className="space-y-5">
        <p className="text-sm text-gray-500 dark:text-slate-400">Presidencias y líderes del barrio</p>
        {Object.entries(grouped).map(([llamamiento, group]) => (
          <div key={llamamiento}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8c6a43] dark:text-[#c6a27b] mb-2">
              {LLAMAMIENTOS.find(l => l.value === llamamiento)?.label || llamamiento}
            </h4>
            <div className="space-y-1.5">
              {group.map(m => (
                <Card key={m.id} className="!p-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#8c6a43]/10 dark:bg-[#8c6a43]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-[#8c6a43] dark:text-[#c6a27b]">{m.nombre.charAt(0)}{m.apellido.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{m.nombre} {m.apellido}</span>
                    {m.telefono && (
                      <a href={`tel:${m.telefono}`} className="ml-auto text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>call</span>
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (miOrg) {
    return (
      <div>
        <div className="mb-4">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{miOrg.title}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400">{miembros.length} miembro{miembros.length !== 1 ? 's' : ''} en la presidencia</p>
        </div>
        <div className="space-y-1.5">
          {miembros.map(m => (
            <Card key={m.id} className="!p-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#8c6a43]/10 dark:bg-[#8c6a43]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-[#8c6a43] dark:text-[#c6a27b]">{m.nombre.charAt(0)}{m.apellido.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{m.nombre} {m.apellido}</span>
                {m.telefono && (
                  <a href={`tel:${m.telefono}`} className="ml-auto text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>call</span>
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return <p className="text-sm text-gray-400 text-center py-8">No hay información de organización disponible</p>
}
