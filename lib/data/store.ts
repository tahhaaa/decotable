import { cities, dashboardOrders, productReviews, products, promotions, trafficSeries } from "@/lib/data/mock-data";
import { categories } from "@/lib/data/mock-data";
import { Category, City, Product, Promotion, Review } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return products.filter((product) => product.featured);
}

export async function getProducts(query?: {
  search?: string;
  category?: string;
}): Promise<Product[]> {
  return products.filter((product) => {
    const matchesSearch = query?.search
      ? `${product.name} ${product.description}`.toLowerCase().includes(query.search.toLowerCase())
      : true;
    const matchesCategory = query?.category ? product.categoryId === query.category : true;
    return matchesSearch && matchesCategory;
  });
}

export async function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getCities(): Promise<City[]> {
  return cities;
}

export async function getPromotions(): Promise<Promotion[]> {
  return promotions.filter((promotion) => promotion.active);
}

export async function getReviews(productId: string): Promise<Review[]> {
  return productReviews[productId] ?? [];
}

export async function getDashboardSnapshot() {
  const totalStock = products.reduce((sum, product) => sum + product.inventory, 0);
  const topProduct = products.slice().sort((a, b) => b.reviewCount - a.reviewCount)[0];

  return {
    revenue: 18640,
    monthlyOrders: 86,
    customers: 241,
    visits: trafficSeries.reduce((sum, point) => sum + point.visits, 0),
    pendingOrders: dashboardOrders.filter((order) => order.status !== "delivered").length,
    stock: totalStock,
    averageBasket: 890,
    conversionRate: 5.7,
    topProduct: topProduct?.name ?? "Service Atlas 16 pieces",
    orders: dashboardOrders,
    traffic: trafficSeries,
  };
}
