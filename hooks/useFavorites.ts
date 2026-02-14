'use client'

import * as React from 'react'

const STORAGE_KEY = 'favorites'

export function useFavorites() {
    const [favorites, setFavorites] = React.useState<number[]>([])
    const [isLoaded, setIsLoaded] = React.useState(false)

    // ✅ Load once, safely
    React.useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                setFavorites(JSON.parse(stored))
            }
        } catch (err) {
            console.error('Failed to load favorites', err)
        } finally {
            setIsLoaded(true)
        }
    }, [])

    // ✅ Persist changes
    React.useEffect(() => {
        if (!isLoaded) return
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    }, [favorites, isLoaded])

    const toggleFavorite = React.useCallback((productId: number) => {
        setFavorites((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        )
    }, [])

    const isFavorite = React.useCallback(
        (productId: number) => favorites.includes(productId),
        [favorites]
    )

    return { favorites, toggleFavorite, isFavorite, isLoaded }
}
