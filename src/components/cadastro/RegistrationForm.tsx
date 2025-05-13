// src/components/cadastro/RegistrationForm.tsx
import React, { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SocialNetwork, SharingMode } from '@/types/influencer'
import { db } from '@/lib/supabase'
import SupabaseStatus from '../common/SupabaseStatus'

// Valores válidos conforme seu type SharingMode
const sharingModes: SharingMode[] = ['manual', 'automatico']
// Valores válidos conforme seu type SocialNetwork
const socialNetworks: SocialNetwork[] = [
  'Instagram',
  'TikTok',
  'YouTube',
  'Twitch',
  'Twitter',
  'Facebook',
]

export default function RegistrationForm() {
  const { toast: uiToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Precisamos incluir todos os campos do Insert
  const [formData, setFormData] = useState<{
    nome: string
    email: string
    modo_compartilhamento: SharingMode
    rede_social: SocialNetwork
    link: string
    email_autorizacao: string
    cliente: string | null
    campanha: string | null
    periodo_inicio: string | null
    periodo_fim: string | null
    status: string
  }>({
    nome: '',
    email: '',
    modo_compartilhamento: 'manual',
    rede_social: 'Instagram',
    link: '',
    email_autorizacao: '',
    cliente: null,
    campanha: null,
    periodo_inicio: null,
    periodo_fim: null,
    status: 'Pendente',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleModeChange = (value: SharingMode) => {
    setFormData((prev) => ({
      ...prev,
      modo_compartilhamento: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação mínima
    if (!formData.nome.trim() || !formData.email.trim()) {
      uiToast({
        title: 'Erro de validação',
        description: 'Nome e email são obrigatórios.',
        variant: 'destructive',
      })
      return
    }
    if (
      formData.modo_compartilhamento === 'automatico' &&
      !formData.link.trim()
    ) {
      uiToast({
        title: 'Erro de validação',
        description: 'Link do perfil é obrigatório no modo automático.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Passamos o objeto completo, incluindo status e campos opcionais
      const { data, error } = await db.createInfluencer({
        nome: formData.nome,
        email: formData.email,
        rede_social: formData.rede_social,
        modo_compartilhamento: formData.modo_compartilhamento,
        link: formData.link || null,
        email_autorizacao: formData.email_autorizacao || null,
        cliente: formData.cliente,
        campanha: formData.campanha,
        periodo_inicio: formData.periodo_inicio,
        periodo_fim: formData.periodo_fim,
        status: formData.status,
      })

      if (error) throw error

      toast.success('Cadastro realizado com sucesso!', {
        description: 'O influenciador está aguardando processamento.',
      })

      // Resetar
      setFormData((prev) => ({
        ...prev,
        nome: '',
        email: '',
        link: '',
        email_autorizacao: '',
        modo_compartilhamento: 'manual',
        rede_social: 'Instagram',
        // campos opcionais já vazios
        cliente: null,
        campanha: null,
        periodo_inicio: null,
        periodo_fim: null,
        status: 'Pendente',
      }))
    } catch (err: any) {
      toast.error('Erro ao cadastrar', {
        description: `Detalhes: ${err.message || 'Tente novamente.'}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SupabaseStatus />

      <Card className="w-full max-w-2xl mx-auto mt-4">
        <CardHeader>
          <CardTitle>Cadastro de Influenciador</CardTitle>
          <CardDescription>
            Preencha abaixo para cadastrar um novo influenciador.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Nome */}
            <div>
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Modo de Compartilhamento */}
            <div>
              <Label>Modo de Compartilhamento</Label>
              <RadioGroup
                value={formData.modo_compartilhamento}
                onValueChange={(v) =>
                  handleModeChange(v as SharingMode)
                }
                className="flex space-x-4"
              >
                {sharingModes.map((mode) => (
                  <div key={mode} className="flex items-center space-x-2">
                    <RadioGroupItem value={mode} id={mode} />
                    <Label htmlFor={mode}>
                      {mode === 'manual' ? 'Manual' : 'Automático'}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Campos adicionais no modo automático */}
            {formData.modo_compartilhamento === 'manual' ? (
              <div className="p-4 bg-secondary/50 rounded">
                <p className="text-sm text-muted-foreground">
                  No modo manual, o influenciador será notificado para envio por email.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <Label>Rede social</Label>
                  <Select
                    value={formData.rede_social}
                    onValueChange={(v) => handleChange({ target: { name: 'rede_social', value: v } } as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {socialNetworks.map((sn) => (
                        <SelectItem key={sn} value={sn}>
                          {sn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="link">Link do perfil</Label>
                  <Input
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email_autorizacao">
                    Email para autorização
                  </Label>
                  <Input
                    id="email_autorizacao"
                    name="email_autorizacao"
                    type="email"
                    value={formData.email_autorizacao}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  )
}
