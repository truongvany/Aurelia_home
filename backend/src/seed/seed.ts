import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";
import { ProductVariantModel } from "../models/productVariant.model.js";
import { UserModel } from "../models/user.model.js";
import { UserProfileModel } from "../models/userProfile.model.js";
import { ReviewModel } from "../models/review.model.js";
import { CartModel } from "../models/cart.model.js";
import { OrderModel } from "../models/order.model.js";
import { ContactInquiryModel } from "../models/contactInquiry.model.js";
import { WishlistModel } from "../models/wishlist.model.js";
import { CouponModel } from "../models/coupon.model.js";
import { PaymentModel } from "../models/payment.model.js";
import { AddressModel } from "../models/address.model.js";
import { RefreshTokenModel } from "../models/refreshToken.model.js";
import { ProductImageModel } from "../models/productImage.model.js";
import { InventoryLogModel } from "../models/inventoryLog.model.js";
import { AiConversationModel } from "../models/aiConversation.model.js";
import { AiMessageModel } from "../models/aiMessage.model.js";
import { AuditLogModel } from "../models/auditLog.model.js";

const categoriesSeed = [
  { name: "Outerwear", slug: "outerwear", description: "Coats, jackets, and blazers" },
  { name: "Knitwear", slug: "knitwear", description: "Sweaters, turtlenecks, and cardigans" },
  { name: "Shirts", slug: "shirts", description: "Dress shirts and casual button-downs" },
  { name: "Trousers", slug: "trousers", description: "Tailored pants and casual chinos" },
  { name: "Accessories", slug: "accessories", description: "Belts, ties, and pocket squares" },
  { name: "Footwear", slug: "footwear", description: "Boots, oxfords, and loafers" }
];

const productsSeed = [
  {
    name: "Sterling Charcoal Suit",
    slug: "sterling-charcoal-suit",
    description: "A timeless classic crafted from pure Mongolian cashmere.",
    price: 1250,
    categorySlug: "outerwear",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBf4_zUESdwZhN5Nb9wIt62G81mZ5f3sPAK4bLU-CAdbEydJkZ4OlFyt7W0lMA0SmoSN-27GTpUiGZxvzH4PMTWVUuW6PZUdmMmTNwRRj8z9kkjKgN1f8ldOk1ie6LD7HnvtUH3vF5I0HyoIfNUJ9KfCe2gP0yFlHy_tbz3e-eGwjK_pP5OmGfooVxtetazXnf0FNeLSd3avJayvXdivrfRiYlScZs76izYfc3-2PYxNrIP361Xi-ZnrcKt4OFzPs-Vl85332wkzEY"
  },
  {
    name: "Midnight Wool Blazer",
    slug: "midnight-wool-blazer",
    description: "Lightweight, breathable, and incredibly soft.",
    price: 890,
    categorySlug: "knitwear",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9i87OVxxHmXunaf2nV6RiRdkzm0xIfz7Y08mMzSsDa_7UmulYg6nIlHDtegH4XL_-zONXUmzj1tN0WnJGcwc8kuUe-C4hpQobTA6QIMw0Ws8y-DnnCHcg04FeH7sie07O9ibl1mHmSxRSNDWlJhrw3qcNWLu6jJLeZJYdvhRWPsv7ta0uqjXcA8BK4Axsq8Q31Eqt2fDHkbtnTgGy8QNifJ3mhbogqXq_VTs7IG_8iXTeTBD-Z-IS-BroR1dC2AbCO671tI5pA1Q"
  },
  {
    name: "Egyptian Cotton Shirt",
    slug: "egyptian-cotton-shirt",
    description: "Precision cut for a modern, tapered silhouette.",
    price: 220,
    categorySlug: "shirts",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBkp0y2C5sO1Kmu91TWIe7h52GvFcx0SmWm6yi-P4Q-C8fA1CzZqU4g5fguoaaXzb2x6tuCDAp5hhhQTzDTkFT83YMgOUUWv09T-BjnNNBEPSX8bz9zcvgq3jIgzzDckCKuB_vIouYoyZR7ECLCZR0703Rvs6Tavi0yJI5biQLzxTQ6W6m0ssRY2i3yR6LfpgkhUgtUs23Amzigrm7XQm_5M8rhY6Zf19HqelKZzSH8RkKcGGrBAmj7H07F10NsKCvjSdXxq0TvYq0"
  },
  {
    name: "Hand-Stitched Belt",
    slug: "hand-stitched-belt",
    description: "Handcrafted in Italy using full-grain calf leather.",
    price: 180,
    categorySlug: "accessories",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3fvopJ4PhAVgkq5NfFoID5ynBIrdzvSVBtewp2HioS4M8Jn_5kO10K0n1P_OORiArGz567PAw-qwr3yHNCevPBF7mZ90E6iR2WkoCB8q28DuI9ufe50dRNic7Xu8WHEOO9pNyCW0soMPHCl4fXH0SlH49L-xqTzS3JPdA8nhYxTOCsOKfJJEH0lDnW0NjLKp6AM-bu7V4iSjw6St7fcmp2tvuOogG-F5M4oqME6tYpe8pxv8QjSppX3iqmSBC3yvCjVbAiB2fAQw"
  }
];

const variantSeed = [
  { productSlug: "sterling-charcoal-suit", sku: "SCS-CHAR-S", size: "S", color: "Charcoal", stockQuantity: 5 },
  { productSlug: "sterling-charcoal-suit", sku: "SCS-CHAR-M", size: "M", color: "Charcoal", stockQuantity: 12 },
  { productSlug: "sterling-charcoal-suit", sku: "SCS-CHAR-L", size: "L", color: "Charcoal", stockQuantity: 8 },
  { productSlug: "midnight-wool-blazer", sku: "MWB-NAVY-M", size: "M", color: "Navy", stockQuantity: 15 },
  { productSlug: "midnight-wool-blazer", sku: "MWB-NAVY-L", size: "L", color: "Navy", stockQuantity: 10 },
  { productSlug: "egyptian-cotton-shirt", sku: "ECS-WHT-32", size: "32", color: "White", stockQuantity: 20 },
  { productSlug: "egyptian-cotton-shirt", sku: "ECS-WHT-34", size: "34", color: "White", stockQuantity: 25 },
  { productSlug: "hand-stitched-belt", sku: "HSB-BRN-34", size: "34", color: "Brown", stockQuantity: 30 },
  { productSlug: "hand-stitched-belt", sku: "HSB-BRN-36", size: "36", color: "Brown", stockQuantity: 20 }
];

const runSeed = async (): Promise<void> => {
  await connectDatabase();

  await Promise.all([
    CategoryModel.deleteMany({}),
    ProductModel.deleteMany({}),
    ProductVariantModel.deleteMany({}),
    UserModel.deleteMany({}),
    UserProfileModel.deleteMany({}),
    ReviewModel.deleteMany({}),
    CartModel.deleteMany({}),
    OrderModel.deleteMany({}),
    ContactInquiryModel.deleteMany({}),
    WishlistModel.deleteMany({}),
    CouponModel.deleteMany({}),
    PaymentModel.deleteMany({}),
    AddressModel.deleteMany({}),
    RefreshTokenModel.deleteMany({}),
    ProductImageModel.deleteMany({}),
    InventoryLogModel.deleteMany({}),
    AiConversationModel.deleteMany({}),
    AiMessageModel.deleteMany({}),
    AuditLogModel.deleteMany({})
  ]);

  const categories = await CategoryModel.insertMany(categoriesSeed);
  const categoryMap = new Map(categories.map((c) => [c.slug, c._id]));

  const products = await ProductModel.insertMany(
    productsSeed.map((product) => ({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      categoryId: categoryMap.get(product.categorySlug),
      imageUrl: product.imageUrl,
      isActive: true
    }))
  );

  const productMap = new Map(products.map((p) => [p.slug, p._id]));

  await ProductImageModel.insertMany(
    products.flatMap((product) => [
      {
        productId: product._id,
        url: product.imageUrl,
        alt: product.name,
        sortOrder: 0
      },
      {
        productId: product._id,
        url: `https://picsum.photos/seed/${product.slug}-2/800/1200`,
        alt: `${product.name} alternate image`,
        sortOrder: 1
      }
    ])
  );

  const variants = await ProductVariantModel.insertMany(
    variantSeed.map((variant) => ({
      productId: productMap.get(variant.productSlug),
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      stockQuantity: variant.stockQuantity,
      priceAdjustment: 0
    }))
  );

  await InventoryLogModel.insertMany(
    variants.map((variant) => ({
      productVariantId: variant._id,
      type: "seed",
      delta: variant.stockQuantity,
      note: "Initial stock from seed"
    }))
  );

  const passwordHash = await bcrypt.hash("12345678", 10);
  const users = await UserModel.insertMany([
    {
      email: "admin@aurelia.com",
      passwordHash,
      firstName: "Admin",
      lastName: "Aurelia",
      role: "admin"
    },
    {
      email: "james@example.com",
      passwordHash,
      firstName: "James",
      lastName: "Bond",
      role: "customer"
    }
  ]);

  const customer = users.find((u) => u.role === "customer");
  if (!customer) {
    throw new Error("Customer seed user not found");
  }

  await UserProfileModel.create({
    userId: customer._id,
    bodyType: "Athletic",
    stylePreference: "Classic",
    heightCm: 182,
    weightKg: 80,
    skinTone: "Fair"
  });

  const firstProduct = products[0];
  await ReviewModel.create({
    productId: firstProduct._id,
    userId: customer._id,
    rating: 5,
    title: "Excellent craftsmanship",
    comment: "Fits perfectly and fabric quality is exceptional.",
    isVerifiedPurchase: true
  });

  await CartModel.create({
    userId: customer._id,
    items: [
      {
        productId: firstProduct._id,
        productVariantId: variants[0]._id,
        quantity: 1,
        size: variants[0].size,
        color: variants[0].color,
        unitPrice: firstProduct.price
      }
    ]
  });

  await WishlistModel.create({
    userId: customer._id,
    productIds: [products[1]._id, products[2]._id]
  });

  await CouponModel.insertMany([
    {
      code: "WELCOME10",
      discountType: "percent",
      discountValue: 10,
      minOrderAmount: 200,
      expiresAt: new Date("2026-12-31T23:59:59.000Z"),
      isActive: true
    }
  ]);

  await AddressModel.create({
    userId: customer._id,
    fullName: "James Bond",
    phone: "0123456789",
    line1: "221B Baker Street",
    city: "London",
    postalCode: "NW16XE",
    country: "UK",
    isDefault: true
  });

  await ContactInquiryModel.create({
    name: "John Doe",
    email: "john@example.com",
    subject: "Order support",
    message: "Need update for order tracking status."
  });

  const conversation = await AiConversationModel.create({
    userId: customer._id,
    title: "Workwear styling"
  });

  await AiMessageModel.insertMany([
    {
      conversationId: conversation._id,
      sender: "user",
      text: "Goi y outfit cho buoi hop quan trong"
    },
    {
      conversationId: conversation._id,
      sender: "ai",
      text: "Ban co the ket hop Sterling Charcoal Suit voi so mi trang va giay oxford den."
    }
  ]);

  await AuditLogModel.insertMany([
    {
      actorUserId: users.find((u) => u.role === "admin")?._id,
      action: "seed:create",
      targetType: "system",
      targetId: "bootstrap",
      metadata: { source: "seed.ts" }
    }
  ]);

  console.log("Seed completed successfully.");
  console.log(`Categories: ${categories.length}`);
  console.log(`Products: ${products.length}`);
  console.log(`Variants: ${variants.length}`);
  console.log(`Users: ${users.length}`);

  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error("Seed failed", error);
  await mongoose.disconnect();
  process.exit(1);
});
