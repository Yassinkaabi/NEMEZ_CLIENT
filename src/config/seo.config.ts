// SEO Configuration for NEMEZ Shop
// Centralized configuration for meta tags and Open Graph data

export interface SEOConfig {
    title: string;
    description: string;
    url: string;
    image: string;
    siteName: string;
    locale: string;
    type: string;
    twitterCard: string;
    twitterSite?: string;
    fbAppId?: string;
}

export interface ProductSEO {
    title: string;
    description: string;
    image: string;
    price?: number;
    currency?: string;
    availability?: string;
    brand?: string;
    category?: string;
    updatedTime?: string;
}

// Default site configuration
export const defaultSEOConfig: SEOConfig = {
    title: 'NEMEZ - Boutique de Mode en Ligne',
    description: 'Découvrez notre collection exclusive de vêtements et accessoires de mode. Qualité premium, livraison rapide en Tunisie.',
    url: 'https://nemez.shop', // Update with your actual domain
    image: '/images/logo.png', // Update with your default OG image
    siteName: 'NEMEZ',
    locale: 'fr_FR',
    type: 'website',
    twitterCard: 'summary_large_image',
    fbAppId: '', // Your Facebook App ID
};

// Helper function to generate product SEO data
export const generateProductSEO = (product: {
    name: string;
    description: string;
    price: number;
    images: string[];
    categoryId?: { name: string };
    variants?: Array<{ stock: number }>;
    slug: string;
    createdAt?: string;
}): ProductSEO & { url: string; type: string } => {
    const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
    const availability = totalStock > 0 ? 'in stock' : 'out of stock';

    return {
        title: `${product.name} - NEMEZ`,
        description: product.description || `Achetez ${product.name} sur NEMEZ. Qualité premium et livraison rapide.`,
        image: product.images?.[0] || defaultSEOConfig.image,
        price: product.price,
        currency: 'TND',
        availability,
        brand: 'NEMEZ',
        category: product.categoryId?.name,
        url: `${defaultSEOConfig.url}/product/${product.slug}`,
        type: 'product',
        updatedTime: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
    };
};

// Helper function to generate category SEO data
export const generateCategorySEO = (category: {
    name: string;
    description?: string;
    id: string;
}): SEOConfig => {
    return {
        ...defaultSEOConfig,
        title: `${category.name} - NEMEZ`,
        description: category.description || `Découvrez notre collection ${category.name}. Produits de qualité premium.`,
        url: `${defaultSEOConfig.url}/category/${category.id}`,
        type: 'website',
    };
};

// Helper function to generate page SEO data
export const generatePageSEO = (
    title: string,
    description?: string,
    path?: string
): SEOConfig => {
    return {
        ...defaultSEOConfig,
        title: `${title} - NEMEZ`,
        description: description || defaultSEOConfig.description,
        url: path ? `${defaultSEOConfig.url}${path}` : defaultSEOConfig.url,
    };
};

// Helper function to generate Product JSON-LD Schema
export const generateProductSchema = (product: {
    name: string;
    description: string;
    price: number;
    images: string[];
    categoryId?: { name: string };
    variants?: Array<{ stock: number }>;
    // slug: string;
    createdAt?: string;
}) => {
    const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;

    return {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        'name': product.name,
        'image': product.images.map(img => img.startsWith('http') ? img : `${defaultSEOConfig.url}${img}`),
        'description': product.description,
        'sku': product.name,
        'brand': {
            '@type': 'Brand',
            'name': 'NEMEZ'
        },
        'offers': {
            '@type': 'Offer',
            'url': `${defaultSEOConfig.url}/product/${product.name}`,
            'priceCurrency': 'TND',
            'price': product.price,
            'itemCondition': 'https://schema.org/NewCondition',
            'availability': totalStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        }
    };
};
