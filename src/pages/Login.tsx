
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <Layout>
      <PageContainer title="Acesso ao Painel">
        <div className="max-w-4xl mx-auto pt-8">
          <LoginForm />
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Login;
