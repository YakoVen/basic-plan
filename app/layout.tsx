import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/contexts/CartContext';
import { store_name, store_description, store_url } from '@/service/constants';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: {
    default: store_name,
    template: `%s | ${store_name}`,
  },
  description: store_description.substring(0, 160),
  metadataBase: new URL(`https://${store_url}`),
  openGraph: {
    title: store_name,
    description: store_description.substring(0, 160),
    siteName: store_name,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={poppins.className}>
        <CartProvider>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
