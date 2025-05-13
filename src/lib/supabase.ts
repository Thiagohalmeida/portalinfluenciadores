// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type { Influencer } from '@/types/influencer';
import { toast } from 'sonner';

// 1) Debug das env vars
console.log('▶ VITE_SUPABASE_URL →', import.meta.env.VITE_SUPABASE_URL);
console.log('▶ VITE_SUPABASE_ANON_KEY →', import.meta.env.VITE_SUPABASE_ANON_KEY);

// 2) Leitura das variáveis
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 3) Checagem e guard
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Supabase] falta VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY em .env.local'
  );
}

// 4) Criação condicional do client
export const supabase: SupabaseClient<Database> | null =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null;

// 5) Funções CRUD
export const db = {
  async createInfluencer(data: Database['public']['Tables']['influencers']['Insert']) {
    if (!supabase) {
      toast.error('Supabase não configurado');
      return { data: null, error: new Error('Cliente Supabase ausente') };
    }
    try {
      const { data: newInf, error } = await supabase
        .from('influencers')
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      // opcional: sincroniza no BigQuery
      supabase.functions
        .invoke('sync_to_bigquery', {
          body: { table: 'influencers', operation: 'insert', data: newInf },
        })
        .catch((e) =>
          console.warn('Sync BigQuery (insert) falhou:', (e as Error).message)
        );
      return { data: newInf, error: null };
    } catch (err) {
      console.error('[createInfluencer]', err);
      toast.error('Erro ao criar influenciador');
      return { data: null, error: err };
    }
  },

  async getInfluencers() {
    if (!supabase) {
      toast.error('Supabase não configurado');
      return { data: null, error: new Error('Cliente Supabase ausente') };
    }
    try {
      const { data, error } = await supabase
        .from('influencers')
        .select('*')
        .order('data_cadastro', { ascending: false });
      return { data, error };
    } catch (err) {
      console.error('[getInfluencers]', err);
      return { data: null, error: err };
    }
  },

  async updateInfluencer(
    id: string,
    changes: Database['public']['Tables']['influencers']['Update']
  ) {
    if (!supabase) {
      toast.error('Supabase não configurado');
      return { data: null, error: new Error('Cliente Supabase ausente') };
    }
    try {
      const { data: updated, error } = await supabase
        .from('influencers')
        .update(changes)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      supabase.functions
        .invoke('sync_to_bigquery', {
          body: { table: 'influencers', operation: 'update', data: updated },
        })
        .catch((e) =>
          console.warn('Sync BigQuery (update) falhou:', (e as Error).message)
        );
      return { data: updated, error: null };
    } catch (err) {
      console.error('[updateInfluencer]', err);
      toast.error('Erro ao atualizar influenciador');
      return { data: null, error: err };
    }
  },

  async deleteInfluencer(id: string) {
    if (!supabase) {
      toast.error('Supabase não configurado');
      return { error: new Error('Cliente Supabase ausente') };
    }
    try {
      const { error } = await supabase
        .from('influencers')
        .delete()
        .eq('id', id);
      if (error) throw error;
      supabase.functions
        .invoke('sync_to_bigquery', {
          body: { table: 'influencers', operation: 'delete', id },
        })
        .catch((e) =>
          console.warn('Sync BigQuery (delete) falhou:', (e as Error).message)
        );
      return { error: null };
    } catch (err) {
      console.error('[deleteInfluencer]', err);
      toast.error('Erro ao excluir influenciador');
      return { error: err };
    }
  },
};
