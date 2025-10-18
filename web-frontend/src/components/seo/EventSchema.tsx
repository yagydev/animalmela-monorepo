import Head from 'next/head';

interface EventSchemaProps {
  event: {
    title: string;
    slug: string;
    date: string;
    endDate?: string;
    location: {
      name: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    image: {
      url: string;
      alt?: string;
    };
    description: string;
    organizer?: {
      name: string;
      url?: string;
    };
  };
}

export default function EventSchema({ event }: EventSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.date,
    "endDate": event.endDate || event.date,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": event.location.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": event.location.address,
        "addressLocality": event.location.city,
        "addressRegion": event.location.state,
        "postalCode": event.location.pincode,
        "addressCountry": "IN"
      },
      ...(event.location.coordinates && {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": event.location.coordinates.lat,
          "longitude": event.location.coordinates.lng
        }
      })
    },
    "image": event.image.url,
    "organizer": event.organizer ? {
      "@type": "Organization",
      "name": event.organizer.name,
      ...(event.organizer.url && { "url": event.organizer.url })
    } : {
      "@type": "Organization",
      "name": "Kisan Mela",
      "url": "https://www.kisanmela.com"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "INR",
      "url": `https://www.kisanmela.com/events/${event.slug}`
    },
    "url": `https://www.kisanmela.com/events/${event.slug}`
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
