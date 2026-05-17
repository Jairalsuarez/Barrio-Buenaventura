import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

webpush.setVapidDetails(
  'mailto:admin@barriobv.com',
  process.env.VITE_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { title, body, url } = req.body || {}

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    )

    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')

    if (error) throw error

    const results = await Promise.allSettled(
      (subscriptions || []).map(sub =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify({ title, body, url })
        ).catch(() => {
          if (sub.id) {
            supabase.from('push_subscriptions').delete().eq('id', sub.id)
          }
        })
      )
    )

    const sent = results.filter(r => r.status === 'fulfilled').length

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json({ sent, total: subscriptions?.length || 0 })
  } catch (err) {
    console.error('send-push error:', err)
    res.status(500).json({ error: err.message })
  }
}
