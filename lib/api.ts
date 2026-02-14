export const BASE_URL = 'https://dummyjson.com';

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
    // Mock date field we will generate
    dateAdded?: string;
}

export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

// Generate a deterministic date based on product ID
// usage: getProductDate(product.id)
export const getProductDate = (id: number): Date => {
    // Seed logic: dummyjson products go up to ~100+. 
    // We want dates within last 6 months.
    // Use simple math to pick a day offset.
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    // Deterministic random-ish number from ID
    const randomOffset = (id * 137) % 180; // 180 days approx 6 months

    const date = new Date(today);
    date.setDate(today.getDate() - randomOffset);
    return date;
};

export async function fetchProducts(skip = 0, limit = 10): Promise<ProductResponse> {
    const res = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return {
        ...data,
        products: data.products.map((p: Product) => ({
            ...p,
            dateAdded: getProductDate(p.id).toISOString()
        }))
    };
}

export async function searchProducts(query: string): Promise<ProductResponse> {
    const res = await fetch(`${BASE_URL}/products/search?q=${query}`);
    if (!res.ok) throw new Error('Failed to search products');
    const data = await res.json();
    return {
        ...data,
        products: data.products.map((p: Product) => ({
            ...p,
            dateAdded: getProductDate(p.id).toISOString()
        }))
    };
}

export async function fetchCategories(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/products/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    // api returns array of objects with slug, name, url OR string array depending on version
    // dummyjson docs say: [ { slug: 'beauty', name: 'Beauty', url: '...' }, ... ]
    const data = await res.json();
    // Normalize to string array of slugs or names
    return data.map((c: any) => c.slug || c);
}

export async function fetchProductsByCategory(category: string): Promise<ProductResponse> {
    const res = await fetch(`${BASE_URL}/products/category/${category}`);
    if (!res.ok) throw new Error('Failed to fetch category products');
    const data = await res.json();
    return {
        ...data,
        products: data.products.map((p: Product) => ({
            ...p,
            dateAdded: getProductDate(p.id).toISOString()
        }))
    };
}

export async function fetchProduct(id: string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    const data = await res.json();
    return {
        ...data,
        dateAdded: getProductDate(data.id).toISOString()
    };
}
