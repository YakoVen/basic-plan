import React from 'react';
import Header from './header';
import Footer from './footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
