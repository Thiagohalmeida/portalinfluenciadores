
import { createClient } from '@supabase/supabase-js';
import type { Influencer } from '@/types/influencer';
import { toast } from 'sonner';

// Inicializar cliente Supabase
// Já que estamos usando a integração Lovable Supabase, podemos acessar estes valores
// a partir do objeto window, que é definido pela integração Lovable Supabase
const supabaseUrl = 
  (typeof window !== 'undefined' && (window as any).__SUPABASE_URL__) || 
  import.meta.env.VITE_SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  (typeof window !== 'undefined' && (window as any).__SUPABASE_ANON_KEY__) || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  '';

// Verificar se a configuração do Supabase está disponível
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('URL do Supabase ou chave API estão faltando. Certifique-se de ter conectado ao Supabase pela integração do Lovable.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções de banco de dados para influenciadores
export const db = {
  // Criar um novo influenciador no Supabase
  async createInfluencer(data: Partial<Influencer>): Promise<{ data: Influencer | null; error: any }> {
    if (!supabaseUrl || !supabaseAnonKey) {
      toast('Erro de configuração: Supabase não está configurado corretamente', {
        description: 'Por favor, verifique suas configurações de integração do Supabase',
      });
      return { data: null, error: new Error('Supabase não configurado') };
    }

    // Primeiro, criar no Supabase
    const { data: newInfluencer, error } = await supabase
      .from('influencers')
      .insert([{
        nome: data.nome,
        email: data.email,
        rede_social: data.rede_social,
        modo_compartilhamento: data.modo_compartilhamento,
        link: data.link,
        email_autorizacao: data.email_autorizacao,
        cliente: data.cliente,
        campanha: data.campanha,
        periodo_inicio: data.periodo_inicio,
        periodo_fim: data.periodo_fim,
        status: 'Pendente',
        data_cadastro: new Date().toISOString(),
      }])
      .select()
      .single();

    // Acionar sincronização com BigQuery (precisaremos implementar isso com Edge Functions)
    if (newInfluencer) {
      try {
        // Chamar função de borda para sincronizar com BigQuery
        await supabase.functions.invoke('sync-to-bigquery', {
          body: { 
            table: 'influencers',
            data: newInfluencer 
          }
        });
      } catch (syncError) {
        console.error('Falha ao sincronizar com BigQuery:', syncError);
        // Não falharemos a operação se a sincronização com BigQuery falhar
      }
    }

    return { data: newInfluencer, error };
  },

  // Obter todos os influenciadores
  async getInfluencers(): Promise<{ data: Influencer[] | null; error: any }> {
    return await supabase
      .from('influencers')
      .select('*')
      .order('data_cadastro', { ascending: false });
  },

  // Atualizar um influenciador
  async updateInfluencer(id: string, data: Partial<Influencer>): Promise<{ data: Influencer | null; error: any }> {
    const { data: updatedInfluencer, error } = await supabase
      .from('influencers')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    // Sincronizar com BigQuery
    if (updatedInfluencer) {
      try {
        await supabase.functions.invoke('sync-to-bigquery', {
          body: { 
            table: 'influencers',
            data: updatedInfluencer,
            operation: 'update'
          }
        });
      } catch (syncError) {
        console.error('Falha ao sincronizar atualização com BigQuery:', syncError);
      }
    }

    return { data: updatedInfluencer, error };
  },

  // Excluir um influenciador
  async deleteInfluencer(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('influencers')
      .delete()
      .eq('id', id);

    // Sincronizar exclusão com BigQuery
    if (!error) {
      try {
        await supabase.functions.invoke('sync-to-bigquery', {
          body: { 
            table: 'influencers',
            id,
            operation: 'delete'
          }
        });
      } catch (syncError) {
        console.error('Falha ao sincronizar exclusão com BigQuery:', syncError);
      }
    }

    return { error };
  },

  // Publicar influenciadores (para implementação futura)
  async publishInfluencers(): Promise<{ count: number; names: string[] }> {
    // Isso acionaria uma operação de mesclagem do lado do servidor
    // Por enquanto, vamos apenas retornar a contagem e os nomes de todos os influenciadores
    const { data: influencers, error } = await supabase
      .from('influencers')
      .select('nome');
    
    if (error || !influencers) {
      return { count: 0, names: [] };
    }
    
    return {
      count: influencers.length,
      names: influencers.map(inf => inf.nome)
    };
  }
};
