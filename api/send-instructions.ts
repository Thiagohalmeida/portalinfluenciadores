// api/send-instructions.ts

import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

// --- Inicialize o Supabase com service key para rodar no server ---
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // use a SERVICE_ROLE_KEY aqui
)

// --- Configuração do Nodemailer (SMTP) via env vars ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true se usar 465, false para outros
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send({ error: 'Only POST allowed' })
  }

  const { influencerId, fromEmail } = req.body as {
    influencerId: string
    fromEmail: string
  }

  // 1) Busca no Supabase o influencer
  const { data: influencer, error: fetchError } = await supabase
    .from('influencers')
    .select('nome, email, rede_social')
    .eq('id', influencerId)
    .single()

  if (fetchError || !influencer) {
    return res.status(404).json({ error: 'Influencer not found' })
  }

  // 2) Escolhe o link certo conforme a rede_social
  const LINKS: Record<string, string> = {
    Instagram: 'https://x.gd/p2e7Z',
    Twitch:    'https://x.gd/2TrX0',
    // adicione outras redes aqui...
  }
  const guideUrl = LINKS[influencer.rede_social] || LINKS['Instagram']

  // 3) Monte o HTML/texto do email
  const mailOptions = {
    from:    fromEmail,
    to:      influencer.email,
    subject: `Tutorial de Envio de Conteúdo – ${influencer.rede_social}`,
    text: `
Olá ${influencer.nome},

Tudo bem?

Você está recebendo o tutorial de como compartilhar o resultado de suas campanhas. 
Por favor, siga as instruções de envio de conteúdo para a sua rede social (${influencer.rede_social}).

1) Abra o guia correspondente à sua rede:
   ${guideUrl}

2) O que você deve fazer:
   • Baixe o arquivo no link acima.
   • Preencha e gere os relatórios de acordo com as instruções do guia.
   • Envie o material de volta como resposta a este e-mail ou compartilhe um link do seu Drive.

3) Prazos e contato:
   Conclua esse envio até 5 dias úteis após receber este email.
   Em caso de dúvidas, responda a este e-mail ou fale com suporte@controlf5.com.br.

Atenciosamente,
Equipe Portal Influenciadores
    `,
  }

  // 4) Dispare o email
  try {
    await transporter.sendMail(mailOptions)
    return res.status(200).json({ success: true })
  } catch (err: any) {
    console.error('✉️ Error sending email', err)
    return res.status(500).json({ error: err.message })
  }
}
