import Head from 'next/head';

interface OrganizationSchemaProps {
  organization: {
    name: string;
    slug: string;
    description: string;
    type: string;
    address: {
      street?: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
    contactInfo: {
      phone?: string;
      email?: string;
      website?: string;
      contactPerson?: string;
    };
    logo?: {
      url: string;
      alt?: string;
    };
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
      youtube?: string;
    };
    services?: string[];
  };
}

export default function OrganizationSchema({ organization }: OrganizationSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": organization.name,
    "description": organization.description,
    "url": organization.contactInfo.website || `https://www.kisanmela.com/organizations/${organization.slug}`,
    "logo": organization.logo?.url,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": organization.address.street || "",
      "addressLocality": organization.address.city,
      "addressRegion": organization.address.state,
      "postalCode": organization.address.pincode,
      "addressCountry": organization.address.country
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": organization.contactInfo.phone,
      "email": organization.contactInfo.email,
      "contactType": "customer service",
      ...(organization.contactInfo.contactPerson && {
        "name": organization.contactInfo.contactPerson
      })
    },
    "sameAs": [
      ...(organization.socialMedia?.facebook ? [organization.socialMedia.facebook] : []),
      ...(organization.socialMedia?.instagram ? [organization.socialMedia.instagram] : []),
      ...(organization.socialMedia?.twitter ? [organization.socialMedia.twitter] : []),
      ...(organization.socialMedia?.linkedin ? [organization.socialMedia.linkedin] : []),
      ...(organization.socialMedia?.youtube ? [organization.socialMedia.youtube] : [])
    ],
    "serviceType": organization.services,
    "additionalType": `https://schema.org/${organization.type.charAt(0).toUpperCase() + organization.type.slice(1)}`
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
