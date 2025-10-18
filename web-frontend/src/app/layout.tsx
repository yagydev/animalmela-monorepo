import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import ChatBot from '@/components/ChatBot';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Kisaanmela.com - Farmers\' Marketplace',
  description: 'Comprehensive farmers\' marketplace for fresh produce, livestock, seeds, equipment, and agricultural services. Connect farmers with buyers in your area.',
  keywords: 'farmers marketplace, fresh produce, livestock, seeds, equipment, agricultural services, farming, agriculture',
  authors: [{ name: 'Kisaanmela Team' }],
  creator: 'Kisaanmela.com',
  publisher: 'Kisaanmela.com',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kisaanmela.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kisaanmela.com - Farmers\' Marketplace',
    description: 'Comprehensive farmers\' marketplace for all your agricultural needs',
    url: 'https://kisaanmela.com',
    siteName: 'Kisaanmela.com',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kisaanmela.com - Pet Services Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kisaanmela.com - Farmers\' Marketplace',
    description: 'Comprehensive farmers\' marketplace for all your agricultural needs',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-gray-50">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
