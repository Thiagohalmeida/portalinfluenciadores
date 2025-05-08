
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Save, X, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Influencer, InfluencerStatus } from '@/types/influencer';
import { api } from '@/services/api';
import { format } from 'date-fns';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface InfluencerTableProps {
  onPublish: () => void;
}

const InfluencerTable: React.FC<InfluencerTableProps> = ({ onPublish }) => {
  const { toast } = useToast();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Influencer>>({});

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

  const handleEdit = (influencer: Influencer) => {
    setEditingId(influencer.id);
    setEditForm({
      cliente: influencer.cliente || '',
      campanha: influencer.campanha || '',
      periodo_inicio: influencer.periodo_inicio || '',
      periodo_fim: influencer.periodo_fim || '',
      status: influencer.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await api.updateInfluencer(id, editForm);
      
      // Update the local state
      setInfluencers(prev => 
        prev.map(inf => 
          inf.id === id ? { ...inf, ...editForm } : inf
        )
      );
      
      toast({
        title: "Atualizado com sucesso",
        description: "As informações do influenciador foram atualizadas.",
      });
      
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) {
      return;
    }
    
    try {
      await api.deleteInfluencer(id);
      
      // Remove from local state
      setInfluencers(prev => prev.filter(inf => inf.id !== id));
      
      toast({
        title: "Excluído com sucesso",
        description: "O registro foi removido do staging.",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível remover o registro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleFormChange = (field: keyof Influencer, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (field: 'periodo_inicio' | 'periodo_fim', value: Date | undefined) => {
    if (!value) return;
    const dateStr = format(value, 'yyyy-MM-dd');
    handleFormChange(field, dateStr);
  };

  const renderDateCell = (date: string | undefined, field: 'periodo_inicio' | 'periodo_fim') => {
    if (editingId) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={`w-[130px] justify-start text-left font-normal ${!editForm[field] ? 'text-muted-foreground' : ''}`}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {editForm[field] ? format(new Date(editForm[field] as string), 'dd/MM/yyyy') : 'Selecionar'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={editForm[field] ? new Date(editForm[field] as string) : undefined}
              onSelect={(date) => handleDateSelect(field, date)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      );
    }
    return date ? format(new Date(date), 'dd/MM/yyyy') : '-';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={fetchInfluencers} variant="outline" disabled={loading}>
          {loading ? 'Carregando...' : 'Atualizar Lista'}
        </Button>
        
        <Button onClick={onPublish} disabled={influencers.length === 0}>
          Publicar Todos
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-10">Carregando influenciadores...</div>
      ) : influencers.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          Nenhum influenciador encontrado no staging.
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rede</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Campanha</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {influencers.map((influencer) => (
                <TableRow key={influencer.id}>
                  <TableCell className="font-medium">{influencer.nome}</TableCell>
                  <TableCell>{influencer.email}</TableCell>
                  <TableCell>{influencer.rede_social}</TableCell>
                  
                  <TableCell>
                    {editingId === influencer.id ? (
                      <Input
                        value={editForm.cliente || ''}
                        onChange={(e) => handleFormChange('cliente', e.target.value)}
                        className="max-w-[150px]"
                      />
                    ) : (
                      influencer.cliente || '-'
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {editingId === influencer.id ? (
                      <Input
                        value={editForm.campanha || ''}
                        onChange={(e) => handleFormChange('campanha', e.target.value)}
                        className="max-w-[150px]"
                      />
                    ) : (
                      influencer.campanha || '-'
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {renderDateCell(
                      editingId === influencer.id ? editForm.periodo_inicio : influencer.periodo_inicio,
                      'periodo_inicio'
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {renderDateCell(
                      editingId === influencer.id ? editForm.periodo_fim : influencer.periodo_fim,
                      'periodo_fim'
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {editingId === influencer.id ? (
                      <Select
                        value={editForm.status}
                        onValueChange={(value) => handleFormChange('status', value)}
                      >
                        <SelectTrigger className="max-w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Em andamento">Em andamento</SelectItem>
                          <SelectItem value="Finalizada">Finalizada</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        influencer.status === 'Finalizada' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : influencer.status === 'Em andamento'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {influencer.status}
                      </span>
                    )}
                  </TableCell>
                  
                  <TableCell className="text-right space-x-2">
                    {editingId === influencer.id ? (
                      <>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleSaveEdit(influencer.id)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleEdit(influencer)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleDelete(influencer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
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

export default InfluencerTable;
