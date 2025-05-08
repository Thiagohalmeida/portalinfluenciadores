
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Influencer } from '@/types/influencer';
import { api } from '@/services/api';
import { format } from 'date-fns';

const InfluencerStatusList: React.FC = () => {
  const { toast } = useToast();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Status dos Influenciadores</h2>
        <button 
          onClick={fetchInfluencers}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-10">Carregando influenciadores...</div>
      ) : influencers.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          Nenhum influenciador encontrado.
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Rede Social</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Campanha</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {influencers.map((influencer) => (
                <TableRow key={influencer.id}>
                  <TableCell className="font-medium">{influencer.nome}</TableCell>
                  <TableCell>{influencer.rede_social}</TableCell>
                  <TableCell>{influencer.cliente || '-'}</TableCell>
                  <TableCell>{influencer.campanha || '-'}</TableCell>
                  <TableCell>
                    {influencer.periodo_inicio && influencer.periodo_fim 
                      ? `${format(new Date(influencer.periodo_inicio), 'dd/MM/yyyy')} - ${format(new Date(influencer.periodo_fim), 'dd/MM/yyyy')}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      influencer.status === 'Finalizada' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : influencer.status === 'Em andamento'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {influencer.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default InfluencerStatusList;
