
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SocialNetwork, SharingMode } from '@/types/influencer';
import { db } from '@/lib/supabase';
import SupabaseStatus from '../common/SupabaseStatus';

const socialNetworks: SocialNetwork[] = ['Instagram', 'TikTok', 'YouTube', 'Twitch', 'Twitter', 'Facebook'];

const RegistrationForm: React.FC = () => {
  const { toast: uiToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    modo_compartilhamento: 'manual' as SharingMode,
    rede_social: 'Instagram' as SocialNetwork,
    link: '',
    email_autorizacao: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModeChange = (value: SharingMode) => {
    setFormData(prev => ({ ...prev, modo_compartilhamento: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!formData.nome.trim() || !formData.email.trim()) {
      uiToast({
        title: "Erro de validação",
        description: "Nome e email são campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.modo_compartilhamento === 'automatico' && !formData.link) {
      uiToast({
        title: "Erro de validação",
        description: "Link do perfil é obrigatório para modo automático.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Usando a função db.createInfluencer do Supabase em vez de api.registerInfluencer
      const { data, error } = await db.createInfluencer(formData);
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Cadastro realizado com sucesso!", {
        description: "O influenciador foi cadastrado e está aguardando processamento."
      });
      
      // Resetar formulário
      setFormData({
        nome: '',
        email: '',
        modo_compartilhamento: 'manual',
        rede_social: 'Instagram',
        link: '',
        email_autorizacao: '',
      });
    } catch (error: any) {
      toast.error("Erro ao cadastrar", {
        description: `Ocorreu um erro ao processar o cadastro: ${error.message || "Tente novamente."}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SupabaseStatus />
      
      <Card className="w-full max-w-2xl mx-auto mt-4">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastro de Influenciador</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para cadastrar um novo influenciador.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Informações básicas */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input 
                  id="nome" 
                  name="nome" 
                  placeholder="Nome do influenciador"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {/* Modo de compartilhamento */}
            <div className="space-y-3">
              <Label htmlFor="modo_compartilhamento">Modo de compartilhamento</Label>
              <RadioGroup
                value={formData.modo_compartilhamento}
                onValueChange={(value) => handleModeChange(value as SharingMode)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manual" id="manual" />
                  <Label htmlFor="manual">Manual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="automatico" id="automatico" />
                  <Label htmlFor="automatico">Automático</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Campos específicos para cada modo */}
            {formData.modo_compartilhamento === 'manual' ? (
              <div className="p-4 bg-secondary/50 rounded-md">
                <p className="text-sm text-muted-foreground">
                  No modo manual, o influenciador deve enviar os arquivos diretamente por email ou outro meio combinado.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rede_social">Rede social</Label>
                  <Select 
                    value={formData.rede_social} 
                    onValueChange={(value) => handleSelectChange('rede_social', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a rede social" />
                    </SelectTrigger>
                    <SelectContent>
                      {socialNetworks.map(network => (
                        <SelectItem key={network} value={network}>
                          {network}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="link">Link do perfil</Label>
                  <Input 
                    id="link" 
                    name="link" 
                    placeholder={`https://${formData.rede_social.toLowerCase()}.com/usuario`}
                    value={formData.link}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email_autorizacao">Email para autorização</Label>
                  <Input 
                    id="email_autorizacao" 
                    name="email_autorizacao" 
                    type="email" 
                    placeholder="email_autorizacao@exemplo.com"
                    value={formData.email_autorizacao}
                    onChange={handleChange}
                  />
                </div>
              </div>
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
  );
};

export default RegistrationForm;
