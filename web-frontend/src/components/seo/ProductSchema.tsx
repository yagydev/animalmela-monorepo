import Head from 'next/head';

interface ProductSchemaProps {
  product: {
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
    unit: string;
    category: string;
    image: {
      url: string;
      alt?: string;
    };
    vendor: {
      vendorName: string;
      contactInfo?: {
        phone?: string;
        email?: string;
      };
    };
    organic?: boolean;
    availability: {
      inStock: boolean;
      quantity: number;
    };
  };
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image.url,
    "category": product.category,
    "brand": {
      "@type": "Brand",
      "name": product.vendor.vendorName
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency,
      "availability": product.availability.inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": product.vendor.vendorName,
        ...(product.vendor.contactInfo?.phone && {
          "telephone": product.vendor.contactInfo.phone
        }),
        ...(product.vendor.contactInfo?.email && {
          "email": product.vendor.contactInfo.email
        })
      },
      "url": `https://www.kisanmela.com/products/${product.slug}`
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Unit",
        "value": product.unit
      },
      ...(product.organic ? [{
        "@type": "PropertyValue",
        "name": "Organic",
        "value": "Yes"
      }] : [])
    ],
    "url": `https://www.kisanmela.com/products/${product.slug}`
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </Head>
  );
}
