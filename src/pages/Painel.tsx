
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import InfluencerTable from '@/components/painel/InfluencerTable';
import NovaCampanhaForm from '@/components/painel/NovaCampanhaForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/services/api';

const Painel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('influencers');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  
  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      const result = await api.publishInfluencers();
      
      if (result.count > 0) {
        toast({
          title: "Publicação bem-sucedida",
          description: `${result.count} influenciador(es) publicado(s) com sucesso.`,
        });
      } else {
        toast({
          title: "Nenhum dado para publicar",
          description: "Não há registros no staging para publicar.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na publicação",
        description: "Ocorreu um erro ao tentar publicar os dados.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Layout>
      <PageContainer title="Painel de Gerenciamento">
        <Tabs 
          defaultValue="influencers" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="influencers">Lista de Influenciadores</TabsTrigger>
            <TabsTrigger value="campaign">Nova Campanha</TabsTrigger>
          </TabsList>
          
          <TabsContent value="influencers" className="mt-6">
            <InfluencerTable onPublish={handlePublish} />
          </TabsContent>
          
          <TabsContent value="campaign" className="mt-6">
            <div className="max-w-3xl mx-auto">
              <NovaCampanhaForm />
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </Layout>
  );
};

export default Painel;
