import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-indigo-600 flex items-center">
        <Home size={16} className="mr-1" />
        <span className="sr-only">Accueil</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={16} className="mx-2 text-gray-400" />
          {item.href ? (
            <Link href={item.href} className="hover:text-indigo-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
