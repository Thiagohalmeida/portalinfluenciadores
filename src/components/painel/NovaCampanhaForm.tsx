
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Influencer, InfluencerStatus, SocialNetwork, SharingMode } from '@/types/influencer';
import { api } from '@/services/api';
import { Calendar } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

const NovaCampanhaForm: React.FC = () => {
  const { toast } = useToast();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    email: '',
    rede_social: '' as SocialNetwork,
    modo_compartilhamento: 'manual' as SharingMode,
    cliente: '',
    campanha: '',
    periodo_inicio: '',
    periodo_fim: '',
    status: 'Em andamento' as InfluencerStatus,
    link: '',
    email_autorizacao: '',
  });

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      const data = await api.getStagingInfluencers();
      setInfluencers(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível buscar a lista de influenciadores.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInfluencerSelect = (id: string) => {
    const influencer = influencers.find(inf => inf.id === id);
    if (influencer) {
      setFormData({
        ...formData,
        id: influencer.id,
        nome: influencer.nome,
        email: influencer.email,
        rede_social: influencer.rede_social,
        modo_compartilhamento: influencer.modo_compartilhamento || 'manual',
        link: influencer.link || '',
        email_autorizacao: influencer.email_autorizacao || '',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (field: 'periodo_inicio' | 'periodo_fim', value: Date | undefined) => {
    if (!value) return;
    const dateStr = format(value, 'yyyy-MM-dd');
    setFormData(prev => ({ ...prev, [field]: dateStr }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id || !formData.cliente || !formData.campanha || !formData.periodo_inicio || !formData.periodo_fim) {
      toast({
        title: "Campos incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // This would typically go to a different endpoint to create a campaign
      // For now, we'll use the update method
      await api.updateInfluencer(formData.id, {
        cliente: formData.cliente,
        campanha: formData.campanha,
        periodo_inicio: formData.periodo_inicio,
        periodo_fim: formData.periodo_fim,
        status: formData.status,
        modo_compartilhamento: formData.modo_compartilhamento,
        link: formData.link,
        email_autorizacao: formData.email_autorizacao,
      });
      
      toast({
        title: "Campanha criada",
        description: `A campanha ${formData.campanha} foi criada com sucesso.`,
      });
      
      // Reset form
      setFormData({
        id: '',
        nome: '',
        email: '',
        rede_social: '' as SocialNetwork,
        modo_compartilhamento: 'manual' as SharingMode,
        cliente: '',
        campanha: '',
        periodo_inicio: '',
        periodo_fim: '',
        status: 'Em andamento' as InfluencerStatus,
        link: '',
        email_autorizacao: '',
      });
    } catch (error) {
      toast({
        title: "Erro ao criar campanha",
        description: "Ocorreu um erro ao processar a requisição.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Campanha</CardTitle>
        <CardDescription>
          Crie uma nova campanha para um influenciador existente.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="influencer">Selecionar influenciador</Label>
            <Select 
              value={formData.id} 
              onValueChange={handleInfluencerSelect}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Escolha um influenciador" />
              </SelectTrigger>
              <SelectContent>
                {influencers.map((inf) => (
                  <SelectItem key={inf.id} value={inf.id}>
                    {inf.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {formData.id && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Influenciador</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Nome completo"
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email de contato"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rede_social">Rede Social</Label>
                  <Select
                    value={formData.rede_social}
                    onValueChange={(value) => handleSelectChange('rede_social', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="Twitch">Twitch</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modo_compartilhamento">Modo de Compartilhamento</Label>
                  <Select 
                    value={formData.modo_compartilhamento} 
                    onValueChange={(value) => handleSelectChange('modo_compartilhamento', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatico">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {formData.modo_compartilhamento === 'automatico' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="link">Link do Perfil</Label>
                    <Input
                      id="link"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      placeholder="Link do perfil na rede social"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email_autorizacao">Email de Autorização</Label>
                    <Input
                      id="email_autorizacao"
                      name="email_autorizacao"
                      value={formData.email_autorizacao}
                      onChange={handleInputChange}
                      placeholder="Email para autorização da API"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input
                    id="cliente"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleInputChange}
                    placeholder="Nome do cliente"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="campanha">Campanha</Label>
                  <Input
                    id="campanha"
                    name="campanha"
                    value={formData.campanha}
                    onChange={handleInputChange}
                    placeholder="Nome da campanha"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="periodo_inicio">Data de início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={`w-full justify-start text-left ${!formData.periodo_inicio ? 'text-muted-foreground' : ''}`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.periodo_inicio 
                          ? format(new Date(formData.periodo_inicio), 'dd/MM/yyyy')
                          : 'Selecione a data de início'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={formData.periodo_inicio ? new Date(formData.periodo_inicio) : undefined}
                        onSelect={(date) => handleDateSelect('periodo_inicio', date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="periodo_fim">Data de término</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className={`w-full justify-start text-left ${!formData.periodo_fim ? 'text-muted-foreground' : ''}`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {formData.periodo_fim 
                          ? format(new Date(formData.periodo_fim), 'dd/MM/yyyy')
                          : 'Selecione a data de término'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={formData.periodo_fim ? new Date(formData.periodo_fim) : undefined}
                        onSelect={(date) => handleDateSelect('periodo_fim', date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                    <SelectItem value="Finalizada">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={!formData.id || submitting}>
            {submitting ? 'Criando...' : 'Criar Campanha'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NovaCampanhaForm;
