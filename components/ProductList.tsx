'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { Product, fetchCategories, fetchProducts } from '@/lib/api';
import { Filters } from './Filters';
import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';

export function ProductList() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('all');
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
    const [currentPage, setCurrentPage] = React.useState(1);
    const ITEMS_PER_PAGE = 10;

    // Fetch ALL products for client-side filtering
    // Using limit=0 to get all (DummyJSON supports this or high number)
    // DummyJSON limit=0 returns all products.
    const { data: productData, isLoading: isLoadingProducts, error: productError } = useQuery({
        queryKey: ['products'],
        queryFn: () => fetchProducts(0, 0), // 0 limit means all in simple implementation or large number
    });

    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    // Reset page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, dateRange]);

    const filteredProducts = React.useMemo(() => {
        if (!productData?.products) return [];

        return productData.products.filter((product) => {
            // Search
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    product.title.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Category
            if (selectedCategory !== 'all' && product.category !== selectedCategory) {
                return false;
            }

            // Date Range
            if (dateRange?.from && product.dateAdded) {
                const productDate = parseISO(product.dateAdded);
                // Ensure we cover the full day of the "to" date
                const toDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from);
                toDate.setHours(23, 59, 59, 999);

                const fromDate = new Date(dateRange.from);
                fromDate.setHours(0, 0, 0, 0);

                if (productDate < fromDate || productDate > toDate) {
                    return false;
                }
            }

            return true;
        });
    }, [productData, searchQuery, selectedCategory, dateRange]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (productError) {
        return <div className="text-center text-red-500 py-10">Failed to load products. Please try again.</div>;
    }

    return (
        <div className="space-y-6">
            <Filters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                dateRange={dateRange}
                setDateRange={setDateRange}
                categories={categories}
            />

            {isLoadingProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-[300px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <p>Showing {paginatedProducts.length} of {filteredProducts.length} products</p>
                        {dateRange?.from && <p>Filtering by date: {format(dateRange.from, 'MMM d')} - {dateRange.to ? format(dateRange.to, 'MMM d') : ''}</p>}
                    </div>

                    {paginatedProducts.length === 0 ? (
                        <div className="text-center py-20 bg-muted/20 rounded-lg">
                            <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
                            <Button
                                variant="link"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                    setDateRange(undefined);
                                }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <Pagination className="mt-8">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                            e.preventDefault();
                                            if (currentPage > 1) setCurrentPage(p => p - 1);
                                        }}
                                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const page = i + 1;
                                    // Generic simplified pagination logic: show all for now, or simple subset
                                    // For short lists (100 items / 10 = 10 pages) showing all checks out.
                                    // If many pages, logic needs to be smarter.
                                    if (totalPages > 10 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages) {
                                        if (Math.abs(page - currentPage) === 3) return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>;
                                        return null;
                                    }

                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                href="#"
                                                isActive={page === currentPage}
                                                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                                    e.preventDefault();
                                                    setCurrentPage(page);
                                                }}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                            e.preventDefault();
                                            if (currentPage < totalPages) setCurrentPage(p => p + 1);
                                        }}
                                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            )}
        </div>
    );
}
