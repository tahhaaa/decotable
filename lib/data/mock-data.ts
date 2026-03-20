import { Category, City, Product, Promotion, Review } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "cat-deco",
    name: "Decoration",
    slug: "decoration",
    description: "Vases, photophores, pieces sculpturales et accents de caractere.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "cat-tableware",
    name: "Vaisselle & art de table",
    slug: "vaisselle-art-de-table",
    description: "Assiettes, verres, couverts et indispensables pour recevoir.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "cat-gifts",
    name: "Idees cadeaux",
    slug: "idees-cadeaux",
    description: "Selections elegantes pour mariages, pendaisons et fetes.",
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Service Atlas 16 pieces",
    slug: "service-atlas-16-pieces",
    shortDescription: "Une composition beige mat pour des tables sobres et raffinées.",
    description:
      "Ce service en gres emaille accompagne les tables du quotidien comme les grandes occasions. Sa teinte sablee s'accorde naturellement aux intérieurs epures.",
    price: 1290,
    compareAtPrice: 1490,
    rating: 4.8,
    reviewCount: 28,
    categoryId: "cat-tableware",
    categoryName: "Vaisselle & art de table",
    inventory: 18,
    featured: true,
    isNew: true,
    tags: ["best-seller", "morocco", "table"],
    images: [
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
    ],
    materials: ["Gres", "Finition mate"],
    dimensions: "Assiette 27 cm, bol 16 cm, tasse 22 cl",
  },
  {
    id: "prod-2",
    name: "Vase Dune artisanal",
    slug: "vase-dune-artisanal",
    shortDescription: "Un vase sculptural en ceramique inspire des lignes du desert.",
    description:
      "Faconne pour sublimer branches seches ou compositions florales, le vase Dune structure un espace avec elegance sans le surcharger.",
    price: 540,
    rating: 4.7,
    reviewCount: 14,
    categoryId: "cat-deco",
    categoryName: "Decoration",
    inventory: 9,
    featured: true,
    tags: ["artisan", "ceramique"],
    images: [
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    ],
    materials: ["Ceramique", "Finition sable"],
    dimensions: "Hauteur 34 cm",
  },
  {
    id: "prod-3",
    name: "Coffret cadeau Nacre",
    slug: "coffret-cadeau-nacre",
    shortDescription: "Un coffret pret a offrir avec 4 tasses et un plateau assorti.",
    description:
      "Le coffret Nacre a ete pense pour les listes de mariage et les cadeaux de maison. Une selection chic, utile et facile a offrir partout au Maroc.",
    price: 890,
    rating: 4.9,
    reviewCount: 33,
    categoryId: "cat-gifts",
    categoryName: "Idees cadeaux",
    inventory: 22,
    featured: true,
    tags: ["gift", "wedding"],
    images: [
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1514986888952-8cd320577b68?auto=format&fit=crop&w=1200&q=80",
    ],
    materials: ["Porcelaine", "Bois"],
    dimensions: "Plateau 38 cm, tasses 18 cl",
  },
  {
    id: "prod-4",
    name: "Verres Ambre lot de 6",
    slug: "verres-ambre-lot-de-6",
    shortDescription: "Des verres teintes ambre pour signer les receptions du week-end.",
    description:
      "Leur silhouette cisele apporte une dimension decor active a la table. Ideals avec une vaisselle neutre ou des nappes en lin texturé.",
    price: 420,
    rating: 4.6,
    reviewCount: 19,
    categoryId: "cat-tableware",
    categoryName: "Vaisselle & art de table",
    inventory: 31,
    tags: ["hosting", "glassware"],
    images: [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80",
    ],
    materials: ["Verre teinte"],
    dimensions: "35 cl",
  },
];

const citySeed: [string, number, string][] = [
  ["Casablanca", 35, "24h"],
  ["Rabat", 35, "24h"],
  ["Marrakech", 45, "24-48h"],
  ["Fes", 45, "24-48h"],
  ["Tangier", 50, "24-48h"],
  ["Agadir", 55, "48h"],
  ["Meknes", 45, "24-48h"],
  ["Oujda", 60, "48-72h"],
  ["Kenitra", 35, "24h"],
  ["Tetouan", 50, "48h"],
  ["Safi", 45, "24-48h"],
  ["El Jadida", 40, "24h"],
  ["Beni Mellal", 45, "24-48h"],
  ["Nador", 60, "48-72h"],
  ["Taza", 55, "48-72h"],
  ["Khouribga", 40, "24-48h"],
  ["Settat", 35, "24h"],
  ["Larache", 50, "48h"],
  ["Ksar El Kebir", 50, "48h"],
  ["Guelmim", 70, "72h"],
  ["Dakhla", 95, "4-5 jours"],
  ["Laayoune", 85, "3-4 jours"],
  ["Mohammedia", 35, "24h"],
  ["Temara", 35, "24h"],
  ["Essaouira", 55, "48h"],
];

export const cities: City[] = citySeed.map(([name, price, eta], index) => ({
  id: `city-${index + 1}`,
  name,
  price,
  eta,
}));

export const promotions: Promotion[] = [
  {
    id: "promo-ramadan",
    code: "RAMADAN10",
    label: "Ramadan Selection",
    type: "percentage",
    value: 10,
    active: true,
  },
  {
    id: "promo-welcome",
    code: "WELCOME50",
    label: "Premiere commande",
    type: "fixed",
    value: 50,
    active: true,
  },
];

export const productReviews: Record<string, Review[]> = {
  "prod-1": [
    {
      id: "rev-1",
      user_name: "Salma A.",
      rating: 5,
      comment: "Tres belle qualite, la teinte beige est encore plus belle en vrai.",
      created_at: "2026-03-10T10:00:00.000Z",
    },
    {
      id: "rev-2",
      user_name: "Karim M.",
      rating: 4,
      comment: "Livraison rapide a Rabat et emballage soigne.",
      created_at: "2026-03-14T10:00:00.000Z",
    },
  ],
};

export const dashboardOrders = [
  {
    id: "ORD-2026-0012",
    created_at: "2026-03-18T11:00:00.000Z",
    status: "preparing",
    total: 1865,
    city: "Casablanca",
    user_email: "salma@example.com",
    items_count: 3,
  },
  {
    id: "ORD-2026-0011",
    created_at: "2026-03-17T15:30:00.000Z",
    status: "delivered",
    total: 925,
    city: "Rabat",
    user_email: "mehdi@example.com",
    items_count: 2,
  },
];

export const trafficSeries = [
  { day: "Lun", visits: 180, orders: 9, revenue: 4200 },
  { day: "Mar", visits: 240, orders: 11, revenue: 5100 },
  { day: "Mer", visits: 265, orders: 14, revenue: 6200 },
  { day: "Jeu", visits: 290, orders: 16, revenue: 7100 },
  { day: "Ven", visits: 360, orders: 21, revenue: 9600 },
  { day: "Sam", visits: 420, orders: 24, revenue: 11200 },
  { day: "Dim", visits: 310, orders: 17, revenue: 7800 },
];
