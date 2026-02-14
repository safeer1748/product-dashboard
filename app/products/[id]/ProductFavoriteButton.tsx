'use client';

import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";



export function ProductFavoriteButton({ productId }: { productId: number }) {
    const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
    const favorite = isFavorite(productId);

    // Prevent hydration mismatch or layout shift - optional, but good for UX
    if (!isLoaded) return <Button variant="outline" size="icon" disabled><Heart className="h-5 w-5" /></Button>;

    return (
        <HoverCard openDelay={150}>
            <HoverCardTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleFavorite(productId)}
                    className={cn(
                        "rounded-full transition-colors cursor-pointer",
                        favorite ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400" : " "
                    )}
                >
                    <Heart className={cn("h-5 w-5", favorite && "fill-current")} />
                    <span className="sr-only">Toggle favorite</span>
                </Button>
            </HoverCardTrigger>
            <HoverCardContent side="top" className='bg-primary text-white'>
                {favorite ? "Remove from favorites" : "Add to favorites"}
            </HoverCardContent>
        </HoverCard>
    );
}
