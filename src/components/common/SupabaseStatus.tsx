import { useEffect, useState } from 'react'
import { db } from '@/lib/supabase'

export default function SupabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await db.getInfluencers()

        if (error) {
          console.error('SupabaseStatus → erro em getInfluencers():', error)
          setStatus('error')
        } else {
          // mesmo que data seja [], consideramos OK
          setStatus('ok')
        }
      } catch (err) {
        console.error('SupabaseStatus.catch →', err)
        setStatus('error')
      }
    }

    checkConnection()
  }, [])

  if (status === 'loading') {
    return <p>Verificando status da integração…</p>
  }
  if (status === 'ok') {
    return <p style={{ color: 'green' }}>✅ Integração com Supabase OK</p>
  }
  return <p style={{ color: 'red' }}>❌ Erro na conexão com Supabase</p>
}
