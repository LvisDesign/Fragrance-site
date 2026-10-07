export type Role = "USER" | "ADMIN";
export type ProductCategory = "PERFUME" | "BESPOKE_OIL" | "CAR_SCENT";
export type OlfactoryFamily = "FRESH" | "FLORAL" | "WOODY" | "AMBER_GOURMAND";
export type FormulationTier = "EXTRAIT_DE_PARFUM" | "EDP" | "EDT";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";
export type FulfillmentStatus = "PLACED" | "PREPARING" | "SHIPPED" | "DELIVERED";

export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  fullName: string;
  phone: string | null;
  role: Role;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  olfactoryFamily: OlfactoryFamily;
  formulationTier: FormulationTier;
  priceNGN: number;
  stockQuantity: number;
  images: string[];
  isAvailable: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  trackingCode: string;
  userId: string | null;
  customerEmail: string;
  customerName: string;
  customerPhone: string | null;
  shippingAddress: any;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  paymentReference: string;
  createdAt: string;
  items: OrderItem[];
}

// In-Memory Database Layer for Server Environment fallback
class DatabaseClient {
  private users: any[] = [
    {
      id: "usr-admin-1",
      email: "theperfumeslut@gmail.com",
      passwordHash: "0000",
      fullName: "Maison Administrator",
      phone: "+234 803 000 7788",
      role: "ADMIN",
      createdAt: new Date().toISOString(),
    },
    {
      id: "usr-001",
      email: "design.mailler@gmail.com",
      passwordHash: null,
      fullName: "David Adeleke",
      phone: "+234 902 445 8899",
      role: "USER",
      createdAt: new Date().toISOString(),
    },
  ];

  private products: any[] = [
    {
      id: "cat-001",
      name: "Creed Aventus Sovereign",
      slug: "creed-aventus-sovereign",
      category: "PERFUME",
      olfactoryFamily: "WOODY",
      formulationTier: "EXTRAIT_DE_PARFUM",
      priceNGN: 580000,
      stockQuantity: 14,
      images: ["/products/creed_aventus_clean.png"],
      isAvailable: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "cat-002",
      name: "Imperial Oud Royale",
      slug: "imperial-oud-royale",
      category: "BESPOKE_OIL",
      olfactoryFamily: "WOODY",
      formulationTier: "EXTRAIT_DE_PARFUM",
      priceNGN: 420000,
      stockQuantity: 8,
      images: ["/products/surrati_golden_sand_clean.png"],
      isAvailable: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "cat-003",
      name: "Midnight Silk Roll-On Oil",
      slug: "midnight-silk-roll-on-oil",
      category: "BESPOKE_OIL",
      olfactoryFamily: "AMBER_GOURMAND",
      formulationTier: "EDP",
      priceNGN: 45000,
      stockQuantity: 25,
      images: ["/products/tom_ford_black_orchid_clean.png"],
      isAvailable: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "cat-004",
      name: "Velvet Petals Mist Spray",
      slug: "velvet-petals-mist-spray",
      category: "PERFUME",
      olfactoryFamily: "FLORAL",
      formulationTier: "EDT",
      priceNGN: 18500,
      stockQuantity: 40,
      images: ["/products/vs_velvet_petals_clean.png"],
      isAvailable: true,
      createdAt: new Date().toISOString(),
    },
  ];

  private orders: any[] = [
    {
      id: "ord-101",
      trackingCode: "TPS-876788-LX",
      userId: "usr-001",
      customerEmail: "design.mailler@gmail.com",
      customerName: "David Adeleke",
      customerPhone: "+234 902 445 8899",
      shippingAddress: {
        street: "40A Alh Basheer Shittu Avenue",
        city: "Lagos",
        state: "Lagos",
        postalCode: "100001",
        country: "Nigeria",
      },
      totalAmount: 580000,
      paymentStatus: "SUCCESS",
      fulfillmentStatus: "PLACED",
      paymentReference: "PAYSTACK-REF-876788",
      createdAt: new Date().toISOString(),
      items: [
        {
          id: "item-101",
          orderId: "ord-101",
          productId: "cat-001",
          quantity: 1,
          unitPrice: 580000,
        },
      ],
    },
  ];

  // User operations
  async findUserByEmail(email: string) {
    const normalized = email.trim().toLowerCase();
    return this.users.find((u) => u.email.toLowerCase() === normalized) || null;
  }

  async createUser(user: any) {
    const newUser = {
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      role: "USER",
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  // Product operations
  async findProducts(query?: { category?: string; search?: string; page?: number; limit?: number }) {
    let result = [...this.products];
    if (query?.category && query.category !== "ALL") {
      result = result.filter((p) => p.category === query.category);
    }
    if (query?.search) {
      const s = query.search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s)
      );
    }
    return result;
  }

  async findProductById(id: string) {
    return this.products.find((p) => p.id === id) || null;
  }

  async createProduct(product: any) {
    const newProduct = {
      id: `cat-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isAvailable: true,
      ...product,
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updates: any) {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.products[idx];
  }

  async deleteProduct(id: string) {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // Order operations
  async findOrderByReference(ref: string) {
    return this.orders.find((o) => o.paymentReference === ref) || null;
  }

  async findOrderByTrackingCodeOrId(codeOrId: string) {
    const normalized = codeOrId.trim().toLowerCase();
    return (
      this.orders.find(
        (o) => o.id.toLowerCase() === normalized || o.trackingCode.toLowerCase() === normalized
      ) || null
    );
  }

  async findOrdersByEmail(email: string) {
    const normalized = email.trim().toLowerCase();
    return this.orders.filter((o) => o.customerEmail.toLowerCase() === normalized);
  }

  async updateOrderPaymentStatus(paymentReference: string, status: "SUCCESS" | "FAILED") {
    const order = await this.findOrderByReference(paymentReference);
    if (!order) return null;

    order.paymentStatus = status;

    // Execute atomic inventory decrement on success
    if (status === "SUCCESS") {
      for (const item of order.items) {
        const prod = await this.findProductById(item.productId);
        if (prod) {
          prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
          if (prod.stockQuantity === 0) {
            prod.isAvailable = false;
          }
        }
      }

      // Check if user account exists, if not auto-create
      let user = await this.findUserByEmail(order.customerEmail);
      if (!user) {
        user = await this.createUser({
          email: order.customerEmail,
          fullName: order.customerName,
          phone: order.customerPhone,
          passwordHash: null,
        });
      }
      order.userId = user.id;
    }

    return order;
  }
}

export const db = new DatabaseClient();
