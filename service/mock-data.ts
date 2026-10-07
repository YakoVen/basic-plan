import { Article } from '../interfaces/article';

export const mockProducts: Article[] = [
  {
    id: "prod-1",
    title: "Casque Audio Premium Sans Fil",
    description: "Casque audio circum-auriculaire avec réduction de bruit active, autonomie de 30 heures et un son haute-fidélité pour une expérience immersive. Idéal pour les professionnels et les mélomanes. Livré avec un étui de transport rigide et un câble jack 3.5mm pour une écoute filaire si la batterie est déchargée.",
    thumbnail: "/products/headphone-1.jpg",
    screenshots: [
      "/products/headphone-1.jpg",
      "/products/headphone-2.jpg"
    ],
    price: 15000,
    originalPrice: 18000,
    oldPrice: 18000,
    category: 1,
    active: true,
    rating: 4.8,
    ratingsCount: 124,
    salesCount: 340,
    hasVariants: true,
    variants: [
      { id: "v1", name: "Noir", type: "color", color: "#000000", inStock: true },
      { id: "v2", name: "Blanc", type: "color", color: "#FFFFFF", inStock: true },
      { id: "v3", name: "Bleu Nuit", type: "color", color: "#000080", inStock: false }
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-2",
    title: "Montre Connectée Sport Pro",
    description: "Montre intelligente étanche avec suivi de fréquence cardiaque, GPS intégré et écran AMOLED ultra-lumineux. Votre compagnon idéal pour toutes vos activités sportives. Surveillez votre sommeil, votre niveau de stress et recevez vos notifications en temps réel.",
    thumbnail: "/products/watch-1.jpg",
    screenshots: [
      "/products/watch-1.jpg",
      "/products/watch-2.jpg"
    ],
    price: 22000,
    category: 2,
    active: true,
    rating: 4.5,
    ratingsCount: 89,
    salesCount: 210,
    hasVariants: false,
    inStock: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "prod-3",
    title: "Sac à Dos Minimaliste Urbain",
    description: "Sac à dos en toile imperméable avec compartiment pour ordinateur portable 15 pouces. Design épuré, parfait pour les trajets quotidiens et les voyages courts. Les bretelles rembourrées assurent un confort optimal même lorsqu'il est lourdement chargé.",
    thumbnail: "/products/bag-1.jpg",
    screenshots: [
      "/products/bag-1.jpg",
      "/products/bag-2.jpg"
    ],
    price: 8500,
    originalPrice: 9900,
    oldPrice: 9900,
    category: 3,
    active: true,
    rating: 4.9,
    ratingsCount: 256,
    salesCount: 890,
    hasVariants: true,
    variants: [
      { id: "v4", name: "Gris", type: "color", color: "#808080", inStock: true },
      { id: "v5", name: "Noir", type: "color", color: "#000000", inStock: true }
    ],
    inStock: true,
    createdAt: new Date().toISOString()
  }
];
