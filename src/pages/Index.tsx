
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import SupabaseStatus from '@/components/common/SupabaseStatus';

const Index = () => {
  return (
    <Layout>
      <PageContainer title="Home">
        <div className="max-w-4xl mx-auto pt-8 space-y-8">
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">Bem-vindo ao Sistema de Gerenciamento de Influenciadores</h2>
            <p className="text-muted-foreground">
              Esta aplicação permite o cadastro e gerenciamento de influenciadores para suas campanhas.
            </p>
            <p className="mt-4">
              Use a aba <strong>Cadastrar</strong> para adicionar novos influenciadores.
              <br />
              Administradores com email @controlf5.com.br podem acessar o <strong>Painel</strong> para gerenciar os registros.
            </p>

            <div className="mt-6">
              <h3 className="text-lg font-medium">Status da Integração</h3>
              <SupabaseStatus />
            </div>
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Index;
