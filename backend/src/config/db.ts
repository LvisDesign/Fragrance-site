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

class BackendDatabase {
  private users: User[] = [
    {
      id: "usr-admin-1",
      email: "theperfumeslut@gmail.com",
      passwordHash: "0000",
      fullName: "The Perfume Slut Administrator",
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

  private products: Product[] = [
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

  private orders: Order[] = [
    {
      id: "ord-101",
      trackingCode: "ZC-876788-LX",
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

  // User Methods
  async findUserByEmail(email: string): Promise<User | null> {
    const normalized = email.trim().toLowerCase();
    return this.users.find((u) => u.email.toLowerCase() === normalized) || null;
  }

  async createUser(user: Partial<User>): Promise<User> {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: user.email || "",
      passwordHash: user.passwordHash || null,
      fullName: user.fullName || "Guest Customer",
      phone: user.phone || null,
      role: user.role || "USER",
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // Product Methods
  async findProducts(query?: { category?: string; search?: string; page?: number; limit?: number }): Promise<Product[]> {
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

  async findProductById(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) || null;
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const newProduct: Product = {
      id: `cat-${Date.now()}`,
      name: productData.name || "Untitled Fragrance",
      slug: productData.slug || `fragrance-${Date.now()}`,
      category: productData.category || "PERFUME",
      olfactoryFamily: productData.olfactoryFamily || "FRESH",
      formulationTier: productData.formulationTier || "EDP",
      priceNGN: Number(productData.priceNGN || 0),
      stockQuantity: Number(productData.stockQuantity || 0),
      images: productData.images || ["/products/creed_aventus_clean.png"],
      isAvailable: productData.isAvailable ?? true,
      createdAt: new Date().toISOString(),
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...updates };
    return this.products[idx];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // Order Methods
  async findOrderByReference(paymentReference: string): Promise<Order | null> {
    return this.orders.find((o) => o.paymentReference === paymentReference) || null;
  }

  async findOrderByTrackingCodeOrId(idOrCode: string): Promise<Order | null> {
    const normalized = idOrCode.trim().toLowerCase();
    return (
      this.orders.find(
        (o) => o.id.toLowerCase() === normalized || o.trackingCode.toLowerCase() === normalized
      ) || null
    );
  }

  async findOrdersByEmail(email: string): Promise<Order[]> {
    const normalized = email.trim().toLowerCase();
    return this.orders.filter((o) => o.customerEmail.toLowerCase() === normalized);
  }

  // Atomic Transaction for Paystack Webhook Fulfillment
  async executeAtomicWebhookFulfillment(paymentReference: string): Promise<Order | null> {
    const order = await this.findOrderByReference(paymentReference);
    if (!order) return null;

    order.paymentStatus = "SUCCESS";

    // 1. Decrement product stock quantities for each OrderItem
    for (const item of order.items) {
      const product = await this.findProductById(item.productId);
      if (product) {
        product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
        if (product.stockQuantity === 0) {
          product.isAvailable = false;
        }
      }
    }

    // 2. Query User by customerEmail. If non-existent, create user record & attach order.userId
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

    return order;
  }
}

export const db = new BackendDatabase();
