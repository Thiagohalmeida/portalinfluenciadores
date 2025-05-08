
import React from 'react';
import { Users, BarChart3, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const features = [
  {
    title: "Cadastro de Influenciadores",
    description: "Registre novos influenciadores",
    icon: <Users className="h-6 w-6 text-brand-500" />,
    link: "/cadastro"
  },
  {
    title: "Gerenciamento de Campanhas",
    description: "Visualize, edite e publique as campanhas para os influenciadores cadastrados.",
    icon: <BarChart3 className="h-6 w-6 text-brand-500" />,
    link: "/painel"
  },
  {
    title: "Análise de Performance",
    description: "Acompanhe o desempenho das suas campanhas de marketing com influenciadores.",
    icon: <Sparkles className="h-6 w-6 text-brand-500" />,
    link: "/painel"
  }
];

const Index = () => {
  return (
    <Layout>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-100 to-transparent dark:from-brand-950/20 dark:to-transparent z-0" />
        
        <div className="relative z-10 pt-12 pb-16 md:pt-24 md:pb-32 px-4 md:px-6">
          <div className="container mx-auto flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="text-brand-600">Portal</span> Influenciadores
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-3xl text-muted-foreground">
              Plataforma para o gerenciamento de influenciadores e suas campanhas
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/cadastro">
                  Cadastrar Influenciador
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/painel">
                  Gerenciar Campanhas
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos da Plataforma</h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-lg p-6 shadow-sm border transition-all hover:shadow-md">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/20 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <Link to={feature.link} className="group inline-flex items-center text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                  Acessar
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
