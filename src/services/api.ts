
import { Influencer } from '@/types/influencer';

const API_BASE_URL = '/api';

// Mock data for initial development
const mockInfluencers: Influencer[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@example.com',
    rede_social: 'Instagram',
    modo_compartilhamento: 'automatico',
    status: 'Pendente',
    data_cadastro: new Date().toISOString(),
    link: 'https://instagram.com/joaosilva'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@example.com',
    rede_social: 'TikTok',
    modo_compartilhamento: 'manual',
    status: 'Pendente',
    data_cadastro: new Date().toISOString()
  },
  {
    id: '3',
    nome: 'Ana Pereira',
    email: 'ana@example.com',
    rede_social: 'YouTube',
    modo_compartilhamento: 'automatico',
    cliente: 'Nike',
    campanha: 'Verão 2025',
    status: 'Em andamento',
    periodo_inicio: '2025-06-01',
    periodo_fim: '2025-07-15',
    data_cadastro: new Date().toISOString(),
    link: 'https://youtube.com/anapereiravlogs'
  }
];

// This would usually interact with a backend, but for now we'll use mock data
export const api = {
  // Cadastro de influenciadores (staging)
  async registerInfluencer(data: Partial<Influencer>): Promise<Influencer> {
    // In a real implementation, this would be a POST to the server
    console.log('Registering influencer:', data);
    
    // Mock server-side processing
    const newInfluencer: Influencer = {
      id: Math.random().toString(36).substring(2, 11),
      nome: data.nome || '',
      email: data.email || '',
      rede_social: data.rede_social || 'Instagram',
      modo_compartilhamento: data.modo_compartilhamento || 'manual',
      status: 'Pendente', // Always set status to "Pendente" for new registrations
      data_cadastro: new Date().toISOString(),
      link: data.link,
      email_autorizacao: data.email_autorizacao,
      cliente: data.cliente,
      campanha: data.campanha,
      periodo_inicio: data.periodo_inicio,
      periodo_fim: data.periodo_fim,
    };
    
    mockInfluencers.push(newInfluencer);
    return Promise.resolve(newInfluencer);
  },

  // Listar influenciadores (staging)
  async getStagingInfluencers(): Promise<Influencer[]> {
    console.log('Fetching staging influencers');
    return Promise.resolve([...mockInfluencers]);
  },

  // Atualizar influenciador (staging)
  async updateInfluencer(id: string, data: Partial<Influencer>): Promise<Influencer> {
    console.log('Updating influencer:', id, data);
    
    const index = mockInfluencers.findIndex(inf => inf.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Influencer not found'));
    }
    
    const updatedInfluencer = {
      ...mockInfluencers[index],
      ...data
    };
    
    mockInfluencers[index] = updatedInfluencer;
    return Promise.resolve(updatedInfluencer);
  },

  // Excluir influenciador (staging)
  async deleteInfluencer(id: string): Promise<void> {
    console.log('Deleting influencer:', id);
    
    const index = mockInfluencers.findIndex(inf => inf.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Influencer not found'));
    }
    
    mockInfluencers.splice(index, 1);
    return Promise.resolve();
  },

  // Publicar influenciadores (merge para tabela final)
  async publishInfluencers(): Promise<{ count: number; names: string[] }> {
    console.log('Publishing influencers');
    
    // This would trigger a server-side merge operation
    const names = mockInfluencers.map(inf => inf.nome);
    const count = mockInfluencers.length;
    
    // In a real implementation, we would clear the staging table here
    // For the mock, we'll just return the count and names
    
    return Promise.resolve({
      count,
      names
    });
  }
};
