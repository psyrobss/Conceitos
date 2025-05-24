
'use client';

import { useStore } from '@/context/store-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, RefreshCcw, Loader2 } from 'lucide-react';

export function ShoppingCartDisplay() {
  const { cart, removeFromCart, checkout, psiBalance, isGenerating, emptyCart } = useStore();
  const totalCost = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShoppingCart className="h-6 w-6" />
          Carrinho de Conceitos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cart.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Seu carrinho está vazio.</p>
        ) : (
          <>
            <ScrollArea className="h-[200px] mb-4 pr-4">
              <ul className="space-y-3">
                {cart.map((item) => (
                  <li key={item.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                       <span className="text-muted-foreground">{item.price} Ψ</span>
                       <Button
                         variant="ghost"
                         size="icon"
                         className="h-7 w-7 text-destructive hover:bg-destructive/10"
                         onClick={() => removeFromCart(item.id)}
                         aria-label={`Remover ${item.name}`}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
             <Button
                variant="outline"
                size="sm"
                className="w-full mb-4"
                onClick={emptyCart}
                aria-label="Esvaziar carrinho"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Esvaziar Carrinho
              </Button>
            <Separator />
            <div className="flex justify-between items-center mt-4 font-semibold">
              <span>Total:</span>
              <span>{totalCost} Ψ</span>
            </div>
          </>
        )}
      </CardContent>
      {cart.length > 0 && (
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground w-full text-right">Seu saldo: {psiBalance} Ψ</div>
          <Button
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={checkout}
            disabled={isGenerating || totalCost > psiBalance || cart.length === 0}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
               <>
                 <RefreshCcw className="mr-2 h-4 w-4" />
                 Finalizar Compra ({totalCost} Ψ)
               </>
            )}
          </Button>
          {totalCost > psiBalance && cart.length > 0 && (
             <p className="text-destructive text-xs text-center mt-1">Saldo insuficiente para finalizar a compra.</p>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

