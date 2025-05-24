
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const DOTS = "...";

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationControlsProps) {

  const getPageNumbers = () => {
    const siblingCount = 1;
    const totalPageNumbersToShow = siblingCount + 5; // Sibling + firstPage + lastPage + currentPage + 2*DOTS

    // Case 1: If the number of pages is less than the page numbers we want to show
    if (totalPageNumbersToShow >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 2: No left dots to show, but rights dots to be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    // Case 3: No right dots to show, but left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots to be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    // Default (should be covered by Case 1 but as a fallback)
    return range(1, totalPages);
  };


  const pageNumbersToDisplay = getPageNumbers();
  const firstItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages === 0) return null; // Don't render if no pages

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-8">
      <div className="text-sm text-muted-foreground">
        {totalItems > 0 ? (
          `Mostrando ${firstItem}–${lastItem} de ${totalItems} conceitos`
        ) : (
          'Nenhum conceito para mostrar'
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Ir para a página anterior"
            className="h-9"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden md:inline ml-1">Anterior</span>
          </Button>
          {pageNumbersToDisplay.map((page, index) =>
            page === DOTS ? (
              <span key={`ellipsis-${index}`} className="px-2.5 py-1.5 text-sm">
                {page}
              </span>
            ) : (
              <Button
                key={page as number}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className="h-9 w-9"
                onClick={() => onPageChange(page as number)}
                aria-label={`Ir para a página ${page as number}`}
              >
                {page}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Ir para a próxima página"
            className="h-9"
          >
             <span className="hidden md:inline mr-1">Próxima</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
