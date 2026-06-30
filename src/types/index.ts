export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock_by_variant: Record<string, Record<string, number>>;
  is_active: boolean;
  is_new_drop: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  default_address: Address | null;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: "pending" | "paid" | "shipped" | "cancelled";
  total: number;
  shipping_address: Address | null;
  stripe_session_id: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant: { size: string; color: string } | null;
  quantity: number;
  price_at_purchase: number;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}
