
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function SupabaseStatus() {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase.from('influencers').select('count()', { count: 'exact', head: true });
        if (error) {
          console.error("Supabase connection error:", error);
          setConnected(false);
        } else {
          setConnected(true);
        }
      } catch (err) {
        console.error("Error checking Supabase connection:", err);
        setConnected(false);
      }
    }

    checkConnection();
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
          : "Há um problema na conexão com o Supabase. Verifique se você configurou a integração corretamente."}
      </AlertDescription>
    </Alert>
  );
}
