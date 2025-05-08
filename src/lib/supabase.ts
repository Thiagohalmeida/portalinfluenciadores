
import { createClient } from '@supabase/supabase-js';
import type { Influencer } from '@/types/influencer';
import { toast } from 'sonner';

// Initialize Supabase client
// Since we're using the Lovable Supabase integration, we can access these values
// from the window object, which is defined by the Lovable Supabase integration
const supabaseUrl = 
  (typeof window !== 'undefined' && (window as any).__SUPABASE_URL__) || 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://placeholder.supabase.co'; // Fallback placeholder

const supabaseAnonKey = 
  (typeof window !== 'undefined' && (window as any).__SUPABASE_ANON_KEY__) || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'placeholder'; // Fallback placeholder

// Check if Supabase configuration is available
if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
  console.error('URL do Supabase ou chave API estão faltando. Certifique-se de ter conectado ao Supabase pela integração do Lovable.');
}

// Create the Supabase client even with placeholders to avoid hard crashes
// This will allow the app to render, but database operations will fail gracefully
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database functions for influencers
export const db = {
  // Create a new influencer in Supabase
  async createInfluencer(data: Partial<Influencer>): Promise<{ data: Influencer | null; error: any }> {
    if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder') {
      toast.error('Erro de configuração: Supabase não está configurado', {
        description: 'Por favor, clique no botão verde do Supabase no canto superior direito para conectar ao Supabase',
      });
      return { data: null, error: new Error('Supabase não configurado') };
    }

    // First, create in Supabase
    try {
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

      // Trigger sync with BigQuery (we'll need to implement this with Edge Functions)
      if (newInfluencer) {
        try {
          // Call edge function to sync with BigQuery
          await supabase.functions.invoke('sync-to-bigquery', {
            body: { 
              table: 'influencers',
              data: newInfluencer 
            }
          });
        } catch (syncError) {
          console.error('Falha ao sincronizar com BigQuery:', syncError);
          // We won't fail the operation if BigQuery sync fails
        }
      }

      return { data: newInfluencer, error };
    } catch (err) {
      console.error('Erro ao criar influenciador:', err);
      return { data: null, error: err };
    }
  },

  // Get all influencers
  async getInfluencers(): Promise<{ data: Influencer[] | null; error: any }> {
    if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder') {
      toast.error('Erro de configuração: Supabase não está configurado', {
        description: 'Por favor, clique no botão verde do Supabase no canto superior direito para conectar ao Supabase',
      });
      return { data: null, error: new Error('Supabase não configurado') };
    }

    try {
      return await supabase
        .from('influencers')
        .select('*')
        .order('data_cadastro', { ascending: false });
    } catch (err) {
      console.error('Erro ao buscar influenciadores:', err);
      return { data: null, error: err };
    }
  },

  // Update an influencer
  async updateInfluencer(id: string, data: Partial<Influencer>): Promise<{ data: Influencer | null; error: any }> {
    if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder') {
      toast.error('Erro de configuração: Supabase não está configurado', {
        description: 'Por favor, clique no botão verde do Supabase no canto superior direito para conectar ao Supabase',
      });
      return { data: null, error: new Error('Supabase não configurado') };
    }

    try {
      const { data: updatedInfluencer, error } = await supabase
        .from('influencers')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      // Sync with BigQuery
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
    } catch (err) {
      console.error('Erro ao atualizar influenciador:', err);
      return { data: null, error: err };
    }
  },

  // Delete an influencer
  async deleteInfluencer(id: string): Promise<{ error: any }> {
    if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder') {
      toast.error('Erro de configuração: Supabase não está configurado', {
        description: 'Por favor, clique no botão verde do Supabase no canto superior direito para conectar ao Supabase',
      });
      return { error: new Error('Supabase não configurado') };
    }

    try {
      const { error } = await supabase
        .from('influencers')
        .delete()
        .eq('id', id);

      // Sync deletion with BigQuery
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
    } catch (err) {
      console.error('Erro ao excluir influenciador:', err);
      return { error: err };
    }
  },

  // Publish influencers (for future implementation)
  async publishInfluencers(): Promise<{ count: number; names: string[] }> {
    if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder') {
      toast.error('Erro de configuração: Supabase não está configurado', {
        description: 'Por favor, clique no botão verde do Supabase no canto superior direito para conectar ao Supabase',
      });
      return { count: 0, names: [] };
    }
    
    try {
      // This would trigger a server-side merge operation
      // For now, we'll just return the count and names of all influencers
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
    } catch (err) {
      console.error('Erro ao publicar influenciadores:', err);
      return { count: 0, names: [] };
    }
  }
};
