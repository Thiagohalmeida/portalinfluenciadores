
import { createClient } from '@supabase/supabase-js';
import type { Influencer } from '@/types/influencer';
import { toast } from 'sonner';

// Initialize Supabase client
// Since we're using the Lovable Supabase integration, we can access these values
// from the window object, which is set by the Lovable Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
  (typeof window !== 'undefined' ? (window as any).__SUPABASE_URL__ : '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  (typeof window !== 'undefined' ? (window as any).__SUPABASE_ANON_KEY__ : '');

// Check if Supabase configuration is available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or API key is missing. Make sure you have connected to Supabase via the Lovable integration.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

// Database functions for influencers
export const db = {
  // Create a new influencer in Supabase
  async createInfluencer(data: Partial<Influencer>): Promise<{ data: Influencer | null; error: any }> {
    if (!supabaseUrl || !supabaseAnonKey) {
      toast('Configuration error: Supabase not properly configured', {
        description: 'Please check your Supabase integration settings',
      });
      return { data: null, error: new Error('Supabase not configured') };
    }

    // First, create in Supabase
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

    // Trigger BigQuery sync (we'll need to implement this with Edge Functions)
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
        console.error('Failed to sync with BigQuery:', syncError);
        // We don't fail the operation if BigQuery sync fails
      }
    }

    return { data: newInfluencer, error };
  },

  // Get all influencers
  async getInfluencers(): Promise<{ data: Influencer[] | null; error: any }> {
    return await supabase
      .from('influencers')
      .select('*')
      .order('data_cadastro', { ascending: false });
  },

  // Update an influencer
  async updateInfluencer(id: string, data: Partial<Influencer>): Promise<{ data: Influencer | null; error: any }> {
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
        console.error('Failed to sync update with BigQuery:', syncError);
      }
    }

    return { data: updatedInfluencer, error };
  },

  // Delete an influencer
  async deleteInfluencer(id: string): Promise<{ error: any }> {
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
        console.error('Failed to sync deletion with BigQuery:', syncError);
      }
    }

    return { error };
  },

  // Publish influencers (for future implementation)
  async publishInfluencers(): Promise<{ count: number; names: string[] }> {
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
  }
};
