// src/components/painel/InfluencerRow.tsx (exemplo)
import { useAuth } from '@/components/auth/AuthProvider'
import { toast } from 'sonner'

export default function InfluencerRow({ influencer }) {
  const { user } = useAuth()

  const sendInstructions = async () => {
    try {
      const res = await fetch('/api/send-instructions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          influencerId: influencer.id,
          fromEmail:    user?.email,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Unknown')
      toast.success('📧 Instruções enviadas com sucesso!')
    } catch (err: any) {
      toast.error('Erro ao enviar email: ' + err.message)
    }
  }

  return (
    <tr>
      {/* suas colunas... */}
      <td>
        <button onClick={sendInstructions}>
          📩 Enviar instruções
        </button>
      </td>
    </tr>
  )
}
