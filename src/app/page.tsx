
"use client"; // Required because we're using hooks like useStore

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConceptList } from "@/components/concept-list";
import { ShoppingCartDisplay } from "@/components/shopping-cart";
import { PurchasedConcepts } from "@/components/purchased-concepts";
import { MotivationalResult } from "@/components/motivational-result";
import { ShoppingBag, ShoppingCart, BookHeart, Sparkles } from 'lucide-react';
import ClientCartBadge from "@/components/client-cart-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useStore } from "@/context/store-context"; // Import useStore

export default function Home() {
  const { newResultIsAvailable, setNewResultIsAvailable } = useStore(); // Get state and setter

  const handleTabChange = (value: string) => {
    if (value === "results" && newResultIsAvailable) {
      setNewResultIsAvailable(false); // Clear indicator when results tab is viewed
    }
  };

  return (
    <main className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <header className="mb-8 text-center">
         <div className="flex justify-end mb-2">
             <ThemeToggle />
         </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
           🧠 Conceito Psi Store ✨
        </h1>
        <p className="text-md md:text-lg text-muted-foreground">
          Explore, adquira e integre conceitos psicológicos para sua jornada de autoconhecimento!
        </p>
      </header>

      <Tabs defaultValue="store" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-secondary rounded-lg p-1">
          <TabsTrigger value="store" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 rounded-md">
             <ShoppingBag className="h-5 w-5" /> Loja
          </TabsTrigger>
          <TabsTrigger value="cart" className="relative flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 rounded-md">
             <ShoppingCart className="h-5 w-5" /> Carrinho
             <ClientCartBadge />
          </TabsTrigger>
          <TabsTrigger value="purchased" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 rounded-md">
             <BookHeart className="h-5 w-5" /> Meus Conceitos
          </TabsTrigger>
          <TabsTrigger value="results" className="relative flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 rounded-md">
            <Sparkles className="h-5 w-5" /> Resultados
            {newResultIsAvailable && (
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store">
           <h2 className="text-2xl font-semibold mb-4 pl-4 md:pl-6">Disponíveis para Aquisição</h2>
          <ConceptList />
        </TabsContent>

        <TabsContent value="cart">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2">
                 <h2 className="text-2xl font-semibold mb-4">Revise seu Carrinho</h2>
                 <p className="text-muted-foreground mb-4">Confira os conceitos que você selecionou antes de finalizar a compra. Lembre-se, o limite total é de 3 conceitos (incluindo os já adquiridos).</p>
                 <div className="mt-6 p-4 border rounded-md bg-secondary/30">
                    <h3 className="font-semibold mb-2">Como funciona?</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        <li>Adicione até 3 conceitos (totalizando com os já comprados).</li>
                        <li>Use sua moeda fictícia Psi (Ψ) para "comprar".</li>
                        <li>Ao adquirir 3 conceitos, um texto motivacional exclusivo será gerado na aba "Resultados"!</li>
                        <li>Você pode devolver conceitos a qualquer momento para liberar espaço e reaver Psi.</li>
                    </ul>
                 </div>
            </div>
            <div className="lg:col-span-1">
                <ShoppingCartDisplay />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="purchased">
           <h2 className="text-2xl font-semibold mb-4">Seu Inventário Psicológico</h2>
          <PurchasedConcepts />
        </TabsContent>

        <TabsContent value="results">
          <h2 className="text-2xl font-semibold mb-4">Sua Integração Personalizada</h2>
          <MotivationalResult />
        </TabsContent>
      </Tabs>

       <footer className="mt-12 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Conceito Psi Store. Uma simulação lúdica para aprendizado.
      </footer>
    </main>
  );
}
