// src/types/supabase.ts

import type { Influencer } from './influencer';

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

/** Reflete o schema “public” do seu projeto Supabase */
export interface Database {
  public: {
    Tables: {
      influencers: {
        Row: Influencer;
        Insert: {
          nome: string;
          email: string;
          rede_social: string;
          modo_compartilhamento: string;
          link: string | null;
          email_autorizacao: string | null;
          cliente: string | null;
          campanha: string | null;
          periodo_inicio: string | null;
          periodo_fim: string | null;
          status: string;
          data_cadastro?: string;  // gerado pelo client, opcional no insert
          id?: string;             // UUID gerado no banco, opcional no insert
        };
        Update: Partial<Omit<Database['public']['Tables']['influencers']['Insert'], 'id'>>;
      };
    };
    Views: {};
    Functions: {
      sync_to_bigquery: {
        Args: {
          table: string;
          operation: 'insert' | 'update' | 'delete';
          data?: any;
          id?: string;
        };
        Returns: unknown;
      };
    };
    Enums: {};
  };
}
