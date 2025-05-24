
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import type { PsychologicalConcept } from '@/types';
import { initialPsiBalance, getConceptIcon } from '@/data/concepts';
import { useToast } from "@/hooks/use-toast";
import { generateMotivationalText, GenerateMotivationalTextInput } from '@/ai/flows/generate-motivational-text';
import { processPayment, PaymentResult } from '@/services/psi-currency';

export type SortOrder = 'default' | 'alphabetical' | 'random';

interface StoreContextProps {
  concepts: PsychologicalConcept[];
  isLoadingConcepts: boolean;
  cart: PsychologicalConcept[];
  purchased: PsychologicalConcept[];
  psiBalance: number;
  motivationalText: string | null;
  isGenerating: boolean;
  newResultIsAvailable: boolean;
  setNewResultIsAvailable: (value: boolean) => void;
  activeCategoryFilter: string | null;
  setActiveCategoryFilter: (category: string | null) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  searchTerm: string; // Added searchTerm
  setSearchTerm: (term: string) => void; // Added setSearchTerm
  addToCart: (concept: PsychologicalConcept) => void;
  removeFromCart: (conceptId: string) => void;
  emptyCart: () => void;
  checkout: () => Promise<void>;
  returnConcept: (conceptId: string) => void;
  getConceptById: (conceptId: string) => PsychologicalConcept | undefined;
}

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [concepts, setConcepts] = useState<PsychologicalConcept[]>([]);
  const [isLoadingConcepts, setIsLoadingConcepts] = useState<boolean>(true);
  const [cart, setCart] = useState<PsychologicalConcept[]>([]);
  const [purchased, setPurchased] = useState<PsychologicalConcept[]>([]);
  const [psiBalance, setPsiBalance] = useState<number>(initialPsiBalance);
  const [motivationalText, setMotivationalText] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [newResultIsAvailable, setNewResultIsAvailable] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const [searchTerm, setSearchTermState] = useState<string>(''); // Renamed to avoid conflict with prop
  const { toast } = useToast();

  useEffect(() => {
    const fetchConcepts = async () => {
      setIsLoadingConcepts(true);
      try {
        const response = await fetch('/concepts.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Omit<PsychologicalConcept, 'icon'>[] = await response.json();
        const conceptsWithIcons = data.map(concept => ({
          ...concept,
          icon: getConceptIcon(concept.iconName),
        }));
        setConcepts(conceptsWithIcons);
      } catch (error) {
        console.error("Failed to fetch concepts:", error);
        toast({
          title: "Erro ao Carregar Conceitos",
          description: "Não foi possível buscar os conceitos da loja. Tente recarregar a página.",
          variant: "destructive",
        });
        setConcepts([]);
      } finally {
        setIsLoadingConcepts(false);
      }
    };

    if (typeof window !== 'undefined') {
       fetchConcepts();

      const savedCart = localStorage.getItem('psiStoreCart');
      const savedPurchased = localStorage.getItem('psiStorePurchased');
      const savedBalance = localStorage.getItem('psiStoreBalance');
      const savedMotivationalText = localStorage.getItem('psiStoreMotivationalText');
      const savedNewResultAvailable = localStorage.getItem('psiStoreNewResultAvailable');
      const savedSortOrder = localStorage.getItem('psiStoreSortOrder') as SortOrder;
      const savedActiveCategoryFilter = localStorage.getItem('psiStoreActiveCategoryFilter');
      const savedSearchTerm = localStorage.getItem('psiStoreSearchTerm'); // Load searchTerm

      if (savedCart) {
        const parsedCart: Omit<PsychologicalConcept, 'icon' | 'id'>[] & { id: string }[] = JSON.parse(savedCart);
        const cartWithIcons = parsedCart.map(c => ({
          ...c,
          icon: getConceptIcon(c.iconName)
        }));
        setCart(cartWithIcons);
      }
      if (savedPurchased) {
        const parsedPurchased: Omit<PsychologicalConcept, 'icon' | 'id'>[] & { id: string }[] = JSON.parse(savedPurchased);
        const purchasedWithIcons = parsedPurchased.map(c => ({
          ...c,
          icon: getConceptIcon(c.iconName)
        }));
        setPurchased(purchasedWithIcons);
      }
      if (savedBalance) setPsiBalance(parseFloat(savedBalance));
      if (savedMotivationalText) setMotivationalText(JSON.parse(savedMotivationalText));
      if (savedNewResultAvailable) setNewResultIsAvailable(JSON.parse(savedNewResultAvailable));
      if (savedSortOrder && ['default', 'alphabetical', 'random'].includes(savedSortOrder)) {
        setSortOrder(savedSortOrder);
      } else {
        setSortOrder('default');
      }
      if (savedActiveCategoryFilter) setActiveCategoryFilter(JSON.parse(savedActiveCategoryFilter));
      if (savedSearchTerm) setSearchTermState(JSON.parse(savedSearchTerm)); // Set loaded searchTerm

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]); 


  useEffect(() => {
     if (typeof window !== 'undefined') {
      const serializableCart = cart.map(({ icon, ...rest }) => rest);
      localStorage.setItem('psiStoreCart', JSON.stringify(serializableCart));
     }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const serializablePurchased = purchased.map(({ icon, ...rest }) => rest);
      localStorage.setItem('psiStorePurchased', JSON.stringify(serializablePurchased));
    }
  }, [purchased]);

  useEffect(() => {
     if (typeof window !== 'undefined') {
        localStorage.setItem('psiStoreBalance', psiBalance.toString());
     }
  }, [psiBalance]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        if (motivationalText) {
            localStorage.setItem('psiStoreMotivationalText', JSON.stringify(motivationalText));
        } else {
            localStorage.removeItem('psiStoreMotivationalText');
        }
    }
  }, [motivationalText]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('psiStoreNewResultAvailable', JSON.stringify(newResultIsAvailable));
    }
  }, [newResultIsAvailable]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('psiStoreSortOrder', sortOrder);
    }
  }, [sortOrder]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activeCategoryFilter) {
        localStorage.setItem('psiStoreActiveCategoryFilter', JSON.stringify(activeCategoryFilter));
      } else {
        localStorage.removeItem('psiStoreActiveCategoryFilter');
      }
    }
  }, [activeCategoryFilter]);

  useEffect(() => { // Save searchTerm to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('psiStoreSearchTerm', JSON.stringify(searchTerm));
    }
  }, [searchTerm]);


   const getConceptById = useCallback((conceptId: string): PsychologicalConcept | undefined => {
    return concepts.find(c => c.id === conceptId);
  }, [concepts]);

  const setSearchTerm = (term: string) => { // Define setSearchTerm
    setSearchTermState(term);
  };


  const addToCart = (concept: PsychologicalConcept) => {
    if (purchased.some(p => p.id === concept.id)) {
        toast({ title: "Conceito Já Adquirido", description: `Você já possui "${concept.name}".`, variant: "destructive" });
        return;
    }
    if (cart.some(item => item.id === concept.id)) {
        toast({ title: "Já no Carrinho", description: `"${concept.name}" já está no seu carrinho.`, variant: "destructive" });
        return;
    }
    if (purchased.length + cart.length >= 3) {
      toast({ title: "Limite Atingido", description: "Você só pode ter 3 conceitos por vez (adquiridos + carrinho).", variant: "destructive" });
      return;
    }
    setCart((prevCart) => [...prevCart, concept]);
    toast({ title: "Adicionado ao Carrinho", description: `"${concept.name}" foi adicionado.` });
  };

  const removeFromCart = (conceptId: string) => {
    const conceptToRemove = cart.find(c => c.id === conceptId);
    setCart((prevCart) => prevCart.filter((item) => item.id !== conceptId));
     if (conceptToRemove) {
        toast({ title: "Removido do Carrinho", description: `"${conceptToRemove.name}" foi removido.` });
    }
  };

  const emptyCart = () => {
    if (cart.length > 0) {
      setCart([]);
      toast({ title: "Carrinho Esvaziado", description: "Todos os conceitos foram removidos do carrinho." });
    }
  };

  const checkout = async () => {
     const totalCost = cart.reduce((sum, item) => sum + item.price, 0);

    if (cart.length === 0) {
      toast({ title: "Carrinho Vazio", description: "Adicione conceitos ao carrinho antes de finalizar.", variant: "destructive" });
      return;
    }

    if (psiBalance < totalCost) {
      toast({ title: "Saldo Insuficiente", description: `Você precisa de ${totalCost} Psi, mas tem apenas ${psiBalance} Psi.`, variant: "destructive" });
      return;
    }

    if (purchased.length + cart.length > 3) {
      toast({ title: "Limite Excedido", description: "Você não pode adquirir mais que 3 conceitos no total.", variant: "destructive" });
      return;
    }

     setIsGenerating(true);
     setMotivationalText(null);
     setNewResultIsAvailable(false);

    try {
      const paymentResult: PaymentResult = await processPayment(totalCost);

      if (!paymentResult.success) {
        toast({ title: "Falha no Pagamento", description: paymentResult.message, variant: "destructive" });
        setIsGenerating(false);
        return;
      }

      setPsiBalance((prevBalance) => prevBalance - totalCost);
      const newPurchased = [...purchased, ...cart];
      setPurchased(newPurchased);
      setCart([]);

      toast({ title: "Compra Realizada!", description: `${paymentResult.message} Novos conceitos adquiridos.` });

       if (newPurchased.length === 3) {
            const conceptsForGen = newPurchased.slice(0,3);
            if (conceptsForGen.some(c => !c.complexDescription || !c.iconName)) {
                console.warn("Some purchased concepts lack complex descriptions or iconName. Skipping AI generation.");
                toast({ title: "Geração Interrompida", description: "Alguns conceitos não possuem descrição completa ou nome de ícone.", variant: "destructive"});
            } else {
                const input: GenerateMotivationalTextInput = {
                    concept1: conceptsForGen[0].name,
                    concept1Description: conceptsForGen[0].complexDescription,
                    concept2: conceptsForGen[1].name,
                    concept2Description: conceptsForGen[1].complexDescription,
                    concept3: conceptsForGen[2].name,
                    concept3Description: conceptsForGen[2].complexDescription,
                };

                 try {
                     const result = await generateMotivationalText(input);
                     setMotivationalText(result.motivationalText);
                     setNewResultIsAvailable(true);
                     toast({ title: "Texto Motivacional Gerado!", description: "Seu texto personalizado está pronto na seção 'Resultados'." });
                 } catch (error) {
                     console.error("AI Generation Error:", error);
                     toast({ title: "Erro na Geração", description: "Não foi possível gerar o texto motivacional.", variant: "destructive" });
                     setMotivationalText("Erro ao gerar o texto. Tente novamente mais tarde.");
                 }
            }
       } else {
           setMotivationalText(null);
           setNewResultIsAvailable(false);
       }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast({ title: "Erro no Checkout", description: "Ocorreu um erro inesperado.", variant: "destructive" });
       setMotivationalText(null);
       setNewResultIsAvailable(false);
    } finally {
       setIsGenerating(false);
    }
  };

  const returnConcept = (conceptId: string) => {
    const conceptToReturn = purchased.find((item) => item.id === conceptId);
    if (conceptToReturn) {
      setPurchased((prevPurchased) => prevPurchased.filter((item) => item.id !== conceptId));
      setPsiBalance((prevBalance) => prevBalance + conceptToReturn.price);
      toast({ title: "Conceito Devolvido", description: `"${conceptToReturn.name}" foi devolvido e ${conceptToReturn.price} Psi reembolsados.` });

       if (purchased.length -1 !== 3) {
           setMotivationalText(null);
           setNewResultIsAvailable(false);
       }
    }
  };

  return (
    <StoreContext.Provider
      value={{
        concepts,
        isLoadingConcepts,
        cart,
        purchased,
        psiBalance,
        motivationalText,
        isGenerating,
        newResultIsAvailable,
        setNewResultIsAvailable,
        activeCategoryFilter,
        setActiveCategoryFilter,
        sortOrder,
        setSortOrder,
        searchTerm,     // Pass searchTerm
        setSearchTerm,  // Pass setSearchTerm
        addToCart,
        removeFromCart,
        emptyCart,
        checkout,
        returnConcept,
        getConceptById,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextProps => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
