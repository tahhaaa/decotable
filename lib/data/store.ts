import { cities, dashboardOrders, expensesSeed, productReviews, products, promotions, trafficSeries } from "@/lib/data/mock-data";
import { categories } from "@/lib/data/mock-data";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { Category, City, Expense, Product, Promotion, Review } from "@/lib/types";

type SnapshotFilters = {
  dateFrom?: string;
  dateTo?: string;
};

function mapCategory(row: {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image_url,
  };
}

function mapProduct(row: {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number;
  purchase_price?: number | null;
  compare_at_price?: number | null;
  inventory: number;
  featured?: boolean;
  tags?: string[] | null;
  images?: string[] | null;
  materials?: string[] | null;
  dimensions?: string | null;
  categories?: { id: string; name: string }[] | { id: string; name: string } | null;
}) {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    price: Number(row.price),
    purchasePrice: row.purchase_price ? Number(row.purchase_price) : null,
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
    rating: 0,
    reviewCount: 0,
    categoryId: category?.id ?? "",
    categoryName: category?.name ?? "Sans categorie",
    inventory: row.inventory,
    featured: row.featured ?? false,
    tags: row.tags ?? [],
    images: row.images?.length ? row.images : ["/icons/icon-512.svg"],
    materials: row.materials ?? [],
    dimensions: row.dimensions ?? "",
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createServiceRoleClient();
  if (supabase) {
    const { data } = await supabase.from("categories").select("id,name,slug,description,image_url").order("created_at", { ascending: false });
    if (data) return data.map(mapCategory);
  }
  return categories;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const items = await getProducts();
  return items.filter((product) => product.featured);
}

export async function getProducts(query?: {
  search?: string;
  category?: string;
}): Promise<Product[]> {
  const supabase = createServiceRoleClient();
  if (supabase) {
    let request = supabase
      .from("products")
      .select("id,name,slug,short_description,description,price,purchase_price,compare_at_price,inventory,featured,tags,images,materials,dimensions,categories(id,name)")
      .order("created_at", { ascending: false });

    if (query?.category) request = request.eq("category_id", query.category);
    if (query?.search) request = request.ilike("name", `%${query.search}%`);

    const { data } = await request;
    if (data) return data.map((row) => mapProduct(row));
  }

  return products.filter((product) => {
    const matchesSearch = query?.search
      ? `${product.name} ${product.description}`.toLowerCase().includes(query.search.toLowerCase())
      : true;
    const matchesCategory = query?.category ? product.categoryId === query.category : true;
    return matchesSearch && matchesCategory;
  });
}

export async function getProductBySlug(slug: string) {
  const supabase = createServiceRoleClient();
  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("id,name,slug,short_description,description,price,purchase_price,compare_at_price,inventory,featured,tags,images,materials,dimensions,categories(id,name)")
      .eq("slug", slug)
      .maybeSingle();
    if (data) return mapProduct(data);
  }
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getCities(): Promise<City[]> {
  const supabase = createServiceRoleClient();
  if (supabase) {
    const { data } = await supabase.from("cities").select("id,name,price,estimated_time").order("name");
    if (data) {
      return data.map((row) => ({
        id: row.id,
        name: row.name,
        price: Number(row.price),
        eta: row.estimated_time,
      }));
    }
  }
  return cities;
}

export async function getPromotions(): Promise<Promotion[]> {
  const supabase = createServiceRoleClient();
  if (supabase) {
    const { data } = await supabase.from("promotions").select("id,code,label,type,value,active").order("created_at", { ascending: false });
    if (data) {
      return data.map((row) => ({
        id: row.id,
        code: row.code,
        label: row.label,
        type: row.type as "percentage" | "fixed",
        value: Number(row.value),
        active: row.active,
      }));
    }
  }
  return promotions.filter((promotion) => promotion.active);
}

export async function getExpenses(filters: SnapshotFilters = {}): Promise<Expense[]> {
  const supabase = createServiceRoleClient();
  if (supabase) {
    let query = supabase.from("expenses").select("id,label,amount,expense_date,notes").order("expense_date", { ascending: false });
    if (filters.dateFrom) query = query.gte("expense_date", filters.dateFrom);
    if (filters.dateTo) query = query.lte("expense_date", filters.dateTo);
    const { data } = await query;
    if (data) {
      return data.map((row) => ({
        id: row.id,
        label: row.label,
        amount: Number(row.amount),
        expenseDate: row.expense_date,
        notes: row.notes,
      }));
    }
  }
  return expensesSeed;
}

export async function getReviews(productId: string): Promise<Review[]> {
  const supabase = createServiceRoleClient();
  if (supabase) {
    const { data } = await supabase
      .from("reviews")
      .select("id,rating,comment,created_at,profiles(full_name)")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (data) {
      return data.map((row) => ({
        id: row.id,
        user_name: (row.profiles as { full_name?: string } | null)?.full_name ?? "Client",
        rating: row.rating,
        comment: row.comment,
        created_at: row.created_at,
      }));
    }
  }
  return productReviews[productId] ?? [];
}

export async function getDashboardSnapshot(filters: SnapshotFilters = {}) {
  const supabase = createServiceRoleClient();
  if (supabase) {
    let ordersQuery = supabase
      .from("orders")
      .select("id,email,total,status,created_at,cities(name)")
      .order("created_at", { ascending: false });

    let viewsQuery = supabase.from("page_views").select("id,path,created_at").order("created_at", { ascending: false });

    if (filters.dateFrom) {
      ordersQuery = ordersQuery.gte("created_at", `${filters.dateFrom}T00:00:00.000Z`);
      viewsQuery = viewsQuery.gte("created_at", `${filters.dateFrom}T00:00:00.000Z`);
    }

    if (filters.dateTo) {
      ordersQuery = ordersQuery.lte("created_at", `${filters.dateTo}T23:59:59.999Z`);
      viewsQuery = viewsQuery.lte("created_at", `${filters.dateTo}T23:59:59.999Z`);
    }

    const [{ data: ordersData }, { data: productsData }, { data: customersData }, { data: viewsData }, { data: expensesData }] =
      await Promise.all([
        ordersQuery,
        supabase.from("products").select("id,name,inventory,purchase_price"),
        supabase.from("profiles").select("id"),
        viewsQuery,
        (() => {
          let query = supabase.from("expenses").select("id,amount,expense_date");
          if (filters.dateFrom) query = query.gte("expense_date", filters.dateFrom);
          if (filters.dateTo) query = query.lte("expense_date", filters.dateTo);
          return query;
        })(),
      ]);

    const revenue = (ordersData ?? []).reduce((sum, order) => sum + Number(order.total), 0);
    const expenses = (expensesData ?? []).reduce((sum, expense) => sum + Number(expense.amount), 0);
    const grossProfit = revenue - ((productsData ?? []).reduce((sum, product) => sum + Number(product.purchase_price ?? 0), 0));
    const netProfit = grossProfit - expenses;
    const monthlyOrders = ordersData?.length ?? 0;
    const customers = customersData?.length ?? 0;
    const visits = viewsData?.length ?? 0;
    const pendingOrders = (ordersData ?? []).filter((order) => order.status !== "delivered").length;
    const stock = (productsData ?? []).reduce((sum, product) => sum + Number(product.inventory), 0);
    const averageBasket = monthlyOrders ? revenue / monthlyOrders : 0;
    const conversionRate = visits ? Number(((monthlyOrders / visits) * 100).toFixed(1)) : 0;
    const topProduct =
      productsData?.slice().sort((a, b) => Number(b.inventory) - Number(a.inventory))[0]?.name ?? "Aucun produit";

    const trafficMap = new Map<string, { visits: number; orders: number; revenue: number }>();
    for (const label of ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]) {
      trafficMap.set(label, { visits: 0, orders: 0, revenue: 0 });
    }

    for (const view of viewsData ?? []) {
      const day = new Intl.DateTimeFormat("fr-FR", { weekday: "short", timeZone: "Africa/Casablanca" }).format(
        new Date(view.created_at),
      );
      const label = day.slice(0, 3).replace(".", "");
      const current = trafficMap.get(label) ?? { visits: 0, orders: 0, revenue: 0 };
      trafficMap.set(label, { ...current, visits: current.visits + 1 });
    }

    for (const order of ordersData ?? []) {
      const day = new Intl.DateTimeFormat("fr-FR", { weekday: "short", timeZone: "Africa/Casablanca" }).format(
        new Date(order.created_at),
      );
      const label = day.slice(0, 3).replace(".", "");
      const current = trafficMap.get(label) ?? { visits: 0, orders: 0, revenue: 0 };
      trafficMap.set(label, {
        visits: current.visits,
        orders: current.orders + 1,
        revenue: current.revenue + Number(order.total),
      });
    }

    return {
      revenue,
      expenses,
      grossProfit,
      netProfit,
      monthlyOrders,
      customers,
      visits,
      pendingOrders,
      stock,
      averageBasket,
      conversionRate,
      topProduct,
      orders: (ordersData ?? []).map((order) => ({
        id: order.id,
        created_at: order.created_at,
        status: order.status,
        total: Number(order.total),
        city: (order.cities as { name?: string } | null)?.name ?? "N/A",
        user_email: order.email,
        items_count: 0,
      })),
      traffic: Array.from(trafficMap.entries()).map(([day, value]) => ({ day, ...value })),
    };
  }

  const totalStock = products.reduce((sum, product) => sum + product.inventory, 0);
  const topProduct = products.slice().sort((a, b) => b.reviewCount - a.reviewCount)[0];
  const expenses = expensesSeed.reduce((sum, item) => sum + item.amount, 0);

  return {
    revenue: 18640,
    expenses,
    grossProfit: 10400,
    netProfit: 10400 - expenses,
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
