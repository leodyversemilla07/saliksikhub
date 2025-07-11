import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  className,
}) => {
  // Helper to generate page numbers
  const getPages = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
      }
    }
    return pages;
  };
  return (
    <div className={`flex items-center justify-between w-full ${className ?? ''}`}>
      <div className="flex items-center gap-4 min-w-[220px]">
        <Select
          value={pageSize === -1 ? "all" : String(pageSize)}
          onValueChange={val => onPageSizeChange(val === "all" ? -1 : Number(val))}
        >
          <SelectTrigger id="page-size-select" className="w-[70px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent className="w-[130px]">
            {['6', '12', '24', '48', '96', 'all'].map(val => (
              <SelectItem
                key={val}
                value={val}
                className={
                  (pageSize === -1 && val === 'all') || String(pageSize) === val
                    ? 'bg-primary/10 font-bold text-primary'
                    : ''
                }
              >
                {val === 'all' ? 'All' : val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground text-sm">Displaying page {currentPage} of {totalPages}</span>
      </div>
      <div className="flex items-center gap-4">
        <PaginationUI className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : 0}
                style={{ pointerEvents: currentPage === 1 ? "none" : "auto" }}
              />
            </PaginationItem>
            {getPages().map((page, idx) => (
              <PaginationItem key={idx}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => onPageChange(page as number)}
                    aria-disabled={page === currentPage}
                    tabIndex={page === currentPage ? -1 : 0}
                    style={{ pointerEvents: page === currentPage ? "none" : "auto" }}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                aria-disabled={currentPage === totalPages}
                tabIndex={currentPage === totalPages ? -1 : 0}
                style={{ pointerEvents: currentPage === totalPages ? "none" : "auto" }}
              />
            </PaginationItem>
          </PaginationContent>
        </PaginationUI>
      </div>
    </div>
  );
}
