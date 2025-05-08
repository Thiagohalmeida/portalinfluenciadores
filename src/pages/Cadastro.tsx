
import React from 'react';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import RegistrationForm from '@/components/cadastro/RegistrationForm';

const Cadastro = () => {
  return (
    <Layout>
      <PageContainer title="Cadastro de Influenciador">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground mb-8">
            Preencha o formulário abaixo para registrar um novo influenciador em nossa base de dados.
            Após o cadastro, você poderá gerenciar as campanhas no painel de administração.
          </p>
          <RegistrationForm />
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Cadastro;
