
import type { PsychologicalConcept } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Info, RefreshCcw, CheckCircle, Lightbulb, Filter, Search } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useStore } from '@/context/store-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ConceptCardProps {
  concept: PsychologicalConcept;
  showAddToCart?: boolean;
  showReturn?: boolean;
  isPurchased?: boolean;
  isInCart?: boolean;
  onCategoryClick?: (category: string) => void;
}

export function ConceptCard({ concept, showAddToCart = false, showReturn = false, isPurchased = false, isInCart = false, onCategoryClick }: ConceptCardProps) {
  const { addToCart, returnConcept, removeFromCart } = useStore();
  const IconComponent = concept.icon || Lightbulb;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(concept);
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromCart(concept.id);
  };

  const handleReturnConcept = (e: React.MouseEvent) => {
     e.stopPropagation();
    returnConcept(concept.id);
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCategoryClick) {
      onCategoryClick(concept.category);
    }
  };

  const handleSearchOnScholar = (e: React.MouseEvent) => {
    e.stopPropagation();
    const searchTerm = `${concept.name} ${concept.category}`;
    const scholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(searchTerm)}`;
    window.open(scholarUrl, '_blank');
  };

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
         <div className="space-y-1">
           <CardTitle className="text-lg font-bold flex items-center gap-2">
             <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
             <span>{concept.name}</span>
           </CardTitle>
           <CardDescription className="text-sm">{concept.basicDescription}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-2 pb-4">
        <TooltipProvider delayDuration={100}>
           <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="w-full mb-3 justify-start text-left h-auto py-1 px-2" aria-label={`Ver detalhes sobre ${concept.name}`}>
                  <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Ver detalhes</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" className="max-w-lg bg-popover text-popover-foreground p-3 rounded-md border shadow-lg z-50">
              <ScrollArea className="h-72"> {/* Increased height */}
                <p className="text-sm whitespace-pre-wrap">{concept.complexDescription || 'Descrição detalhada não disponível.'}</p>
              </ScrollArea>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
         
         <div className="flex justify-between items-center">
             <span className="text-lg font-bold text-primary">{concept.price} Ψ</span>
             {isPurchased && <Badge variant="outline" className="text-accent-foreground border-accent"><CheckCircle className="h-4 w-4 mr-1"/>Adquirido</Badge>}
        </div>
      </CardContent>
      <CardFooter className="pt-4 flex flex-col items-center">
        <div className="text-center mb-3 flex items-center justify-center gap-2">
          {onCategoryClick ? (
            <Button
              variant="link"
              className="text-xs text-muted-foreground hover:text-primary p-0 h-auto"
              onClick={handleCategoryClick}
              aria-label={`Filtrar por categoria: ${concept.category}`}
            >
              <Filter className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="whitespace-normal break-words">{concept.category}</span>
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground break-words">{concept.category}</span>
          )}
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-primary"
                  onClick={handleSearchOnScholar}
                  aria-label={`Pesquisar "${concept.name} ${concept.category}" no Google Scholar`}
                >
                  <Search className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Pesquisar no Google Scholar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {showAddToCart && (
           isInCart ? (
              <Button variant="outline" className="w-full whitespace-normal h-auto py-2" onClick={handleRemoveFromCart} aria-label={`Remover ${concept.name} do carrinho`}>
                <RefreshCcw className="mr-2 h-4 w-4" /> Remover do Carrinho
              </Button>
            ) : isPurchased ? (
             <Button variant="ghost" className="w-full cursor-not-allowed flex items-center justify-center" disabled aria-label={`${concept.name} já adquirido`}>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Já Adquirido
            </Button>
          ) : (
            <Button className="w-full bg-primary hover:bg-primary/90 whitespace-normal h-auto py-2" onClick={handleAddToCart} aria-label={`Adicionar ${concept.name} ao carrinho`}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar ao Carrinho
            </Button>
          )
        )}
        {showReturn && (
          <Button variant="destructive" className="w-full whitespace-normal h-auto py-2" onClick={handleReturnConcept} aria-label={`Devolver o conceito ${concept.name}`}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Devolver Conceito
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
