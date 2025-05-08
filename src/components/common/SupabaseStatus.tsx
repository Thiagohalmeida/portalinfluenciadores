
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function SupabaseStatus() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase.from('influencers').select('count()', { count: 'exact', head: true });
        
        if (error) {
          console.error("Erro de conexão com Supabase:", error);
          setConnected(false);
          setErrorMessage(error.message);
        } else {
          setConnected(true);
          setErrorMessage(null);
        }
      } catch (err: any) {
        console.error("Erro ao verificar conexão com Supabase:", err);
        setConnected(false);
        setErrorMessage(err.message || "Erro desconhecido");
      }
    }

    // Small delay to ensure configurations are loaded
    const timer = setTimeout(() => {
      checkConnection();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (connected === null) {
    return <div>Verificando conexão com o Supabase...</div>;
  }

  return (
    <Alert variant={connected ? "default" : "destructive"} className="mt-4">
      {connected ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle>
        {connected ? "Supabase conectado" : "Supabase desconectado"}
      </AlertTitle>
      <AlertDescription>
        {connected
          ? "Sua aplicação está conectada corretamente ao Supabase."
          : (
            <>
              <p>
                {errorMessage 
                  ? `Há um problema na conexão com o Supabase: ${errorMessage}` 
                  : "Há um problema na conexão com o Supabase."}
              </p>
              <p className="mt-2 font-medium">
                Para conectar, clique no botão verde do Supabase no canto superior direito da tela e siga as instruções.
              </p>
            </>
          )
        }
      </AlertDescription>
    </Alert>
  );
}
