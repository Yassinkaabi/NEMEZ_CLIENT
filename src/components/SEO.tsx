import { Helmet } from 'react-helmet-async';
import { defaultSEOConfig } from '../config/seo.config';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    // Product-specific props
    price?: number;
    currency?: string;
    availability?: string;
    brand?: string;
    category?: string;
}

const SEO = ({
    title = defaultSEOConfig.title,
    description = defaultSEOConfig.description,
    image = defaultSEOConfig.image,
    url = defaultSEOConfig.url,
    type = defaultSEOConfig.type,
    price,
    currency,
    availability,
    brand,
    category,
}: SEOProps) => {
    // Ensure image URL is absolute
    const absoluteImage = image?.startsWith('http') ? image : `${defaultSEOConfig.url}${image}`;
    const absoluteUrl = url?.startsWith('http') ? url : `${defaultSEOConfig.url}${url}`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={absoluteUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content={defaultSEOConfig.siteName} />
            <meta property="og:locale" content={defaultSEOConfig.locale} />

            {/* Product-specific Open Graph tags */}
            {type === 'product' && price && (
                <>
                    <meta property="product:price:amount" content={price.toString()} />
                    <meta property="product:price:currency" content={currency || 'TND'} />
                </>
            )}
            {availability && <meta property="product:availability" content={availability} />}
            {brand && <meta property="product:brand" content={brand} />}
            {category && <meta property="product:category" content={category} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content={defaultSEOConfig.twitterCard} />
            <meta name="twitter:url" content={absoluteUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />
            {defaultSEOConfig.twitterSite && (
                <meta name="twitter:site" content={defaultSEOConfig.twitterSite} />
            )}

            {/* Canonical URL */}
            <link rel="canonical" href={absoluteUrl} />
        </Helmet>
    );
};

export default SEO;
