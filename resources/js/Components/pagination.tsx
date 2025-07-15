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

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
}

export interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: Array<number | 'all'>;
  itemsLabel?: string;
  pageLabel?: (meta: PaginationMeta) => string;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  meta,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [6, 12, 24, 48, 96, 'all'],
  itemsLabel = 'Items per page',
  pageLabel = (meta) => `Displaying page ${meta.current_page} of ${meta.last_page}`,
  className,
}) => {
  const pageSizeSelectValue =
    pageSize === -1 || (meta && pageSize === meta.total)
      ? 'all'
      : (typeof pageSize === 'number' && pageSize > 0 ? String(pageSize) : '6');
  const getPages = () => {
    const { current_page, last_page } = meta;
    const pages: (number | "ellipsis")[] = [];

    if (last_page <= 7) {
      for (let i = 1; i <= last_page; i++) pages.push(i);
    } else {
      if (current_page <= 4) {
        pages.push(1, 2, 3, 4, 5, "ellipsis", last_page);
      } else if (current_page >= last_page - 3) {
        pages.push(1, "ellipsis", last_page - 4, last_page - 3, last_page - 2, last_page - 1, last_page);
      } else {
        pages.push(1, "ellipsis", current_page - 1, current_page, current_page + 1, "ellipsis", last_page);
      }
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-between w-full ${className ?? ''}`}>
      <div className="flex items-center gap-4 min-w-[220px]">
        <Select
          value={pageSizeSelectValue}
          onValueChange={val => onPageSizeChange(val === "all" ? -1 : Number(val))}
        >
          <SelectTrigger id="page-size-select" className="w-[70px]">
            <SelectValue placeholder={itemsLabel} />
          </SelectTrigger>
          <SelectContent className="w-[130px]">
            {pageSizeOptions.map(val => (
              <SelectItem
                key={val}
                value={val === 'all' ? 'all' : String(val)}
                className={
                  pageSizeSelectValue === 'all' && val === 'all' || pageSizeSelectValue === String(val)
                    ? 'bg-primary/10 font-bold text-primary'
                    : ''
                }
              >
                {val === 'all' ? 'All' : val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground text-sm">{pageLabel(meta)}</span>
      </div>
      <div className="flex items-center gap-4">
        <PaginationUI className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(meta.current_page - 1)}
                aria-disabled={meta.current_page === 1}
                tabIndex={meta.current_page === 1 ? -1 : 0}
                style={{ pointerEvents: meta.current_page === 1 ? "none" : "auto" }}
              />
            </PaginationItem>
            {getPages().map((page, idx) => (
              <PaginationItem key={idx}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={page === meta.current_page}
                    onClick={() => onPageChange(page as number)}
                    aria-disabled={page === meta.current_page}
                    tabIndex={page === meta.current_page ? -1 : 0}
                    style={{ pointerEvents: page === meta.current_page ? "none" : "auto" }}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(meta.current_page + 1)}
                aria-disabled={meta.current_page === meta.last_page}
                tabIndex={meta.current_page === meta.last_page ? -1 : 0}
                style={{ pointerEvents: meta.current_page === meta.last_page ? "none" : "auto" }}
              />
            </PaginationItem>
          </PaginationContent>
        </PaginationUI>
      </div>
    </div>
  );
}
