'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import Link from 'next/link';
import { format } from 'date-fns';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite(product.id);

    return (
        <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "absolute top-2 right-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black transition-colors",
                        favorite ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                    )}
                >
                    <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
                    <span className="sr-only">Toggle favorite</span>
                </Button>
            </div>
            <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start gap-2">
                    <Badge variant="secondary" className="mb-2 capitalize">
                        {product.category}
                    </Badge>
                    {product.dateAdded && (
                        <span className="text-xs text-muted-foreground">
                            {format(new Date(product.dateAdded), 'MMM d')}
                        </span>
                    )}
                </div>
                <Link href={`/products/${product.id}`} className="hover:underline focus:underline outline-none">
                    <h3 className="font-semibold text-lg line-clamp-1" title={product.title}>
                        {product.title}
                    </h3>
                </Link>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-yellow-500 text-sm">★ {product.rating.toFixed(1)}</span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center bg-transparent">
                <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                <Button asChild size="sm" className="text-white">
                    <Link href={`/products/${product.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
