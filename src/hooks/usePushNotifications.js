import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

export function usePushNotifications(userId) {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )
  const [subscribed, setSubscribed] = useState(false)
  const swRegRef = useRef(null)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(reg => {
        swRegRef.current = reg
        return reg.pushManager.getSubscription()
      }).then(sub => {
        if (sub) {
          setSubscribed(true)
          setPermission('granted')
        }
      })
    }
  }, [])

  const subscribe = useCallback(async () => {
    if (!userId) return
    if (!swRegRef.current) {
      if ('serviceWorker' in navigator) {
        swRegRef.current = await navigator.serviceWorker.ready
      } else {
        return
      }
    }
    const reg = swRegRef.current

    const perm = await Notification.requestPermission()
    setPermission(perm)
    if (perm !== 'granted') return

    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
    if (!vapidKey) return

    const existingSub = await reg.pushManager.getSubscription()
    if (existingSub) {
      await existingSub.unsubscribe()
    }

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(vapidKey),
    })

    const json = sub.toJSON()
    await supabase.from('push_subscriptions').upsert({
      usuario_id: userId,
      endpoint: json.endpoint,
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
      user_agent: navigator.userAgent,
    }, { onConflict: 'usuario_id' })

    setSubscribed(true)
  }, [userId])

  const unsubscribe = useCallback(async () => {
    if (!swRegRef.current) return
    const sub = await swRegRef.current.pushManager.getSubscription()
    if (sub) await sub.unsubscribe()

    if (userId) {
      await supabase.from('push_subscriptions')
        .delete()
        .eq('usuario_id', userId)
    }
    setSubscribed(false)
  }, [userId])

  return { permission, subscribed, subscribe, unsubscribe }
}
