export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured?: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  purchasePrice?: number | null;
  compareAtPrice?: number | null;
  rating: number;
  reviewCount: number;
  categoryId: string;
  categoryName: string;
  inventory: number;
  featured?: boolean;
  isNew?: boolean;
  tags: string[];
  images: string[];
  materials: string[];
  dimensions: string;
};

export type City = {
  id: string;
  name: string;
  price: number;
  eta: string;
};

export type Review = {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
  city?: string;
};

export type Promotion = {
  id: string;
  code: string;
  label: string;
  type: "percentage" | "fixed";
  value: number;
  active: boolean;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  created_at: string;
  status: OrderStatus;
  total: number;
  city: string;
  user_email: string;
  items_count: number;
};

export type UserRole = "user" | "admin";

export type TrafficPoint = {
  day: string;
  visits: number;
  orders: number;
  revenue: number;
};

export type Expense = {
  id: string;
  label: string;
  amount: number;
  expenseDate: string;
  notes?: string | null;
};
