
'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useStore, SortOrder } from '@/context/store-context';
import type { PsychologicalConcept } from '@/types';
import { ConceptCard } from './concept-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XCircle, ArrowDownAZ, Shuffle, FileSearch, Search as SearchIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PaginationControls } from './pagination-controls';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 12;

export function ConceptList() {
  const {
    concepts,
    isLoadingConcepts,
    cart,
    purchased,
    activeCategoryFilter,
    setActiveCategoryFilter,
    sortOrder,
    setSortOrder,
    searchTerm,
    setSearchTerm,
  } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [internalRandomizedOrder, setInternalRandomizedOrder] = useState<PsychologicalConcept[]>([]);
  const firstRandomSortDone = useRef(false);


  useEffect(() => {
    if (sortOrder === 'random' && concepts.length > 0) {
      const conceptsCopy = [...concepts];
      for (let i = conceptsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [conceptsCopy[i], conceptsCopy[j]] = [conceptsCopy[j], conceptsCopy[i]];
      }
      setInternalRandomizedOrder(conceptsCopy);
      firstRandomSortDone.current = true;
    } else {
      if (sortOrder !== 'random') {
        firstRandomSortDone.current = false;
        setInternalRandomizedOrder([]);
      }
    }
  }, [concepts, sortOrder]);


  const handleCategoryFilter = (category: string | null) => {
    setActiveCategoryFilter(category);
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value as SortOrder);
  };

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearchTerm = () => {
    setSearchTerm('');
  };

  const processedConcepts = useMemo(() => {
    let baseList: PsychologicalConcept[];

    if (sortOrder === 'random' && firstRandomSortDone.current && internalRandomizedOrder.length > 0) {
      baseList = internalRandomizedOrder;
    } else {
      baseList = concepts;
    }

    let tempConcepts = [...baseList];

    if (activeCategoryFilter) {
      tempConcepts = tempConcepts.filter(concept => concept.category === activeCategoryFilter);
    }

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      tempConcepts = tempConcepts.filter(concept =>
        concept.name.toLowerCase().includes(lowercasedSearchTerm) ||
        concept.basicDescription.toLowerCase().includes(lowercasedSearchTerm) ||
        concept.complexDescription.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    if (sortOrder === 'alphabetical') {
      tempConcepts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }));
    }
    
    return tempConcepts;
  }, [concepts, activeCategoryFilter, sortOrder, internalRandomizedOrder, searchTerm]);

  const totalPages = useMemo(() => Math.ceil(processedConcepts.length / ITEMS_PER_PAGE), [processedConcepts.length]);

  const currentConcepts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return processedConcepts.slice(startIndex, endIndex);
  }, [processedConcepts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategoryFilter, sortOrder, searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  if (isLoadingConcepts) {
    return (
      <div className="p-4 md:p-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
             <div className="w-full sm:max-w-xs md:max-w-sm">
                <Skeleton className="h-10 w-full" /> {/* Search Input Skeleton */}
             </div>
             <div className="flex items-center gap-2 self-center sm:self-end">
                <Skeleton className="h-5 w-20" /> {/* "Ordenar por:" label Skeleton */}
                <Skeleton className="h-10 w-48" /> {/* Sort Select Skeleton */}
             </div>
          </div>
          {/* Optional: Skeleton for active filter display if it can show up before concepts load */}
          {/* <Skeleton className="h-16 w-full mb-6 rounded-md" /> */}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                 <div key={index} className="flex flex-col space-y-3 p-4 border rounded-lg bg-card">
                    {/* Mimicking ConceptCard structure */}
                    <div className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="space-y-1 flex-grow">
                            <Skeleton className="h-5 w-3/4" /> {/* CardTitle Skeleton */}
                            <Skeleton className="h-4 w-full mt-1" /> {/* CardDescription Skeleton */}
                        </div>
                    </div>
                    <Skeleton className="h-8 w-full" /> {/* "Ver detalhes" button Skeleton */}
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-7 w-1/4" /> {/* Price Skeleton */}
                        {/* Optional: Skeleton for "Adquirido" badge if needed */}
                    </div>
                     <div className="text-center mb-1 mt-2 flex items-center justify-center gap-2">
                        <Skeleton className="h-4 w-1/2" /> {/* Category link Skeleton */}
                        <Skeleton className="h-6 w-6 rounded-full" /> {/* Search Icon Skeleton */}
                    </div>
                    <Skeleton className="h-10 w-full mt-2" /> {/* Add to Cart button Skeleton */}
                 </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-8">
            <Skeleton className="h-8 w-40" /> {/* Pagination info text Skeleton */}
            <div className="flex items-center space-x-1">
                <Skeleton className="h-9 w-20" /> {/* Prev button Skeleton */}
                <Skeleton className="h-9 w-9 rounded-full" /> {/* Page number Skeleton */}
                <Skeleton className="h-9 w-9 rounded-full" /> {/* Page number Skeleton */}
                <Skeleton className="h-9 w-9 rounded-full" /> {/* Page number Skeleton */}
                <Skeleton className="h-9 w-20" /> {/* Next button Skeleton */}
            </div>
          </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar conceitos..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="pl-10 h-10 w-full"
            aria-label="Buscar conceitos por nome ou descrição"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={clearSearchTerm}
              aria-label="Limpar busca"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 self-center sm:self-end">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Ordenar por:</span>
            <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                <SelectTrigger className="w-auto sm:w-[200px] h-10">
                    <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="alphabetical">
                        <div className="flex items-center gap-2">
                           <ArrowDownAZ className="h-4 w-4 flex-shrink-0" />
                           <span className="whitespace-normal flex-1">Ordem Alfabética (A-Z)</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="random">
                        <div className="flex items-center gap-2">
                           <Shuffle className="h-4 w-4 flex-shrink-0" />
                           <span className="whitespace-normal flex-1">Aleatório</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {activeCategoryFilter && (
          <div className="mb-6 p-3 bg-secondary/20 rounded-md text-center sm:text-left">
          <p className="text-sm text-foreground break-words">
              Filtrando por categoria: <span className="font-semibold text-primary">{activeCategoryFilter}</span>
          </p>
          <Button
              variant="outline"
              size="sm"
              onClick={() => handleCategoryFilter(null)}
              className="mt-2 text-xs"
              aria-label={`Limpar filtro da categoria ${activeCategoryFilter}`}
          >
              <XCircle className="mr-1.5 h-3.5 w-3.5" /> Limpar Filtro de Categoria
          </Button>
          </div>
      )}


      {!isLoadingConcepts && processedConcepts.length === 0 && (activeCategoryFilter || searchTerm) && (
        <div className="text-center text-muted-foreground p-8 border rounded-md shadow-sm bg-card flex flex-col items-center space-y-4">
          <FileSearch className="h-12 w-12 text-primary" />
          <p className="text-lg">
            {searchTerm && activeCategoryFilter
              ? `Nenhum conceito encontrado para "${searchTerm}" na categoria "${activeCategoryFilter}".`
              : searchTerm
                ? `Nenhum conceito encontrado para "${searchTerm}".`
                : `Nenhum conceito encontrado na categoria "${activeCategoryFilter}".`
            }
          </p>
          {searchTerm && (
             <Button
                variant="link"
                onClick={clearSearchTerm}
                className="text-primary"
              >
                <XCircle className="mr-2 h-4 w-4" /> Limpar Busca
              </Button>
          )}
           {activeCategoryFilter && (
              <Button
                  variant="link"
                  onClick={() => handleCategoryFilter(null)}
                  className="text-primary"
                  aria-label={`Limpar filtro da categoria ${activeCategoryFilter}`}
              >
                  <XCircle className="mr-2 h-4 w-4" /> Limpar Filtro de Categoria
              </Button>
          )}
        </div>
      )}

      {!isLoadingConcepts && processedConcepts.length === 0 && !activeCategoryFilter && !searchTerm && (
         <div className="text-center text-muted-foreground p-8 border rounded-md shadow-sm bg-card flex flex-col items-center space-y-4">
            <FileSearch className="h-12 w-12 text-primary" />
            <p className="text-lg">Nenhum conceito encontrado na loja.</p>
            <p className="text-sm">Parece que nossa prateleira de conceitos está vazia no momento.</p>
         </div>
      )}


      {processedConcepts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentConcepts.map((concept) => {
              const isInCart = cart.some(item => item.id === concept.id);
              const isPurchased = purchased.some(item => item.id === concept.id);
              return (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  showAddToCart={true}
                  isInCart={isInCart}
                  isPurchased={isPurchased}
                  onCategoryClick={handleCategoryFilter}
                />
              );
            })}
          </div>

          {totalPages > 0 && (
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={processedConcepts.length}
            />
          )}
        </>
      ) : (
         !isLoadingConcepts && !activeCategoryFilter && !searchTerm && <p className="text-center text-muted-foreground p-8">Nenhum conceito disponível no momento.</p>
      )}
    </div>
  );
}
