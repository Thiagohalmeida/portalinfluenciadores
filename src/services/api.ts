
import { supabase } from '@/integrations/supabase/client';
import { Influencer } from '@/types/influencer';

export const api = {
  // Cadastro de influenciadores
  async registerInfluencer(data: Partial<Influencer>): Promise<Influencer> {
    const { data: newInfluencer, error } = await supabase
      .from('influencers')
      .insert([{
        nome: data.nome || '',
        email: data.email || '',
        rede_social: data.rede_social || 'Instagram',
        modo_compartilhamento: data.modo_compartilhamento || 'manual',
        status: 'Pendente', // Status padrão para novos registros
        data_cadastro: new Date().toISOString(),
        link: data.link,
        email_autorizacao: data.email_autorizacao,
        cliente: data.cliente,
        campanha: data.campanha,
        periodo_inicio: data.periodo_inicio,
        periodo_fim: data.periodo_fim,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao cadastrar influenciador:', error);
      throw new Error(error.message);
    }
    
    return newInfluencer as Influencer;
  },

  // Listar influenciadores
  async getStagingInfluencers(): Promise<Influencer[]> {
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .order('data_cadastro', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar influenciadores:', error);
      throw new Error(error.message);
    }
    
    return data as Influencer[];
  },

  // Atualizar influenciador
  async updateInfluencer(id: string, data: Partial<Influencer>): Promise<Influencer> {
    const { data: updatedInfluencer, error } = await supabase
      .from('influencers')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar influenciador:', error);
      throw new Error(error.message);
    }
    
    return updatedInfluencer as Influencer;
  },

  // Excluir influenciador
  async deleteInfluencer(id: string): Promise<void> {
    const { error } = await supabase
      .from('influencers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir influenciador:', error);
      throw new Error(error.message);
    }
    
    return;
  },

  // Publicar influenciadores (para implementação futura com função de borda)
  async publishInfluencers(): Promise<{ count: number; names: string[] }> {
    // Aqui você poderia chamar uma função de borda do Supabase para processar os dados
    // Por enquanto, apenas retornaremos informações sobre os influenciadores pendentes
    
    const { data, error } = await supabase
      .from('influencers')
      .select('nome')
      .eq('status', 'Pendente');
    
    if (error) {
      console.error('Erro ao publicar influenciadores:', error);
      throw new Error(error.message);
    }
    
    return {
      count: data.length,
      names: data.map(inf => inf.nome)
    };
  }
};
