
'use client';

import { useStore } from '@/context/store-context';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Info, Loader2 } from 'lucide-react'; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';

export function MotivationalResult() {
  const { purchased, motivationalText, isGenerating } = useStore();

  return (
    <Card className="shadow-lg">
      <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-6 w-6 text-primary" />
          Sua Motivação Personalizada
          </CardTitle>
            <CardDescription>
              Ao adquirir 3 conceitos, um texto motivacional exclusivo é gerado aqui, integrando suas novas ferramentas psicológicas!
            </CardDescription>
      </CardHeader>
      <CardContent>
          {isGenerating ? (
              <div className="flex flex-col items-center justify-center space-y-4 p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Gerando sua integração personalizada...</p>
                  <div className="w-full max-w-md space-y-2">
                      <Skeleton className="h-4 w-[80%]" />
                      <Skeleton className="h-4 w-[95%]" />
                      <Skeleton className="h-4 w-[70%]" />
                      <Skeleton className="h-4 w-[85%]" />
                  </div>
              </div>
          ) : motivationalText ? (
              <ScrollArea className="h-[250px] p-4 border rounded-md bg-muted dark:bg-card">
                  <p className="text-muted-foreground dark:text-card-foreground whitespace-pre-wrap leading-relaxed">{motivationalText}</p>
              </ScrollArea>
          ) : purchased.length === 3 ? (
              <Alert>
                  <Info className="h-4 w-4"/>
                  <AlertTitle>Preparando Integração</AlertTitle>
                  <AlertDescription>
                    Seu texto motivacional está sendo preparado. Isso pode levar alguns instantes.
                  </AlertDescription>
              </Alert>
          ) : (
              <Alert variant="default">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Adquira 3 Conceitos</AlertTitle>
                  <AlertDescription>
                      Adquira exatamente 3 conceitos na loja para gerar seu texto motivacional personalizado nesta seção. Atualmente você possui {purchased.length}.
                  </AlertDescription>
              </Alert>
          )}
      </CardContent>
    </Card>
  );
}
