'use client';

import { useStore } from '@/context/store-context';
import { ConceptCard } from './concept-card';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { BookHeart } from 'lucide-react';


export function PurchasedConcepts() {
  const { purchased } = useStore(); // Removed motivationalText and isGenerating

  return (
    <div className="space-y-6">
       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
                <BookHeart className="h-6 w-6 text-primary"/>
                Meus Conceitos Adquiridos ({purchased.length} / 3)
            </CardTitle>
             <CardDescription>
                Gerencie os conceitos que você adquiriu. Você pode devolver um conceito para liberar espaço e recuperar Psi.
             </CardDescription>
          </CardHeader>
          <CardContent>
              {purchased.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Você ainda não adquiriu nenhum conceito.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {purchased.map((concept) => (
                    <ConceptCard key={concept.id} concept={concept} showReturn={true} isPurchased={true}/>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>

        {/* Motivational text section removed from here */}
    </div>
  );
}
