
export type SocialNetwork = 'Instagram' | 'TikTok' | 'YouTube' | 'Twitch' | 'Twitter' | 'Facebook';

export type SharingMode = 'manual' | 'automatico';

export type InfluencerStatus = 'Em andamento' | 'Finalizada' | 'Pendente';

export interface Influencer {
  id: string;
  nome: string;
  email: string;
  rede_social: SocialNetwork;
  modo_compartilhamento: SharingMode;
  status: InfluencerStatus;
  cliente?: string;
  campanha?: string;
  periodo_inicio?: string;
  periodo_fim?: string;
  data_cadastro: string;
  link?: string;
  email_autorizacao?: string;
}
