import { fetchProduct } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ProductFavoriteButton } from './ProductFavoriteButton'; // We'll need a client component for the button

// We need to generate metadata, but for now let's just do the page content
// Since this is a server component, we fetch data here.

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await fetchProduct(id);

    return (
        <main className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="default" asChild>
                        <Link href="/" className="text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Products
                        </Link>
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
                            <Image
                                src={product.images[0] || product.thumbnail}
                                alt={product.title}
                                fill
                                className="object-contain"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.slice(0, 4).map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-lg border overflow-hidden bg-muted">
                                    <Image
                                        src={img}
                                        alt={`${product.title} view ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="25vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-start">
                                <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
                                <ProductFavoriteButton productId={product.id} />
                            </div>
                            <div className="mt-4 flex items-center gap-4 text-muted-foreground">
                                <Badge variant="default" className="capitalize text-base px-3 py-1 text-white ">
                                    {product.category}
                                </Badge>
                                <span className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                    <span className="font-medium text-foreground">{product.rating}</span>
                                    <span>/ 5.0</span>
                                </span>
                            </div>
                        </div>

                        <div className="text-4xl font-bold">
                            ${product.price}
                            {product.discountPercentage > 0 && (
                                <span className="ml-2 text-lg text-muted-foreground line-through font-normal">
                                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                                </span>
                            )}
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed">{product.description}</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 p-4 border rounded-lg bg-card">
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">Brand</span>
                                <p className="font-medium">{product.brand || 'Generic'}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">Stock</span>
                                <p className="font-medium">{product.stock} units</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">SKU</span>
                                <p className="font-medium">PROD-{product.id.toString().padStart(6, '0')}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">Added Date</span>
                                <div className="flex items-center gap-2 font-medium">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    {product.dateAdded && format(new Date(product.dateAdded), 'MMMM d, yyyy')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
