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
  { name: "Áo Ngoài", slug: "outerwear", description: "Áo khoác, blazer và áo ngoài" },
  { name: "Áo Len", slug: "knitwear", description: "Áo len, áo cổ lọ và áo cardigan" },
  { name: "Áo Sơ Mi", slug: "shirts", description: "Áo sơ mi lịch sự và áo sơ mi thường ngày" },
  { name: "Quần", slug: "trousers", description: "Quần âu và quần chinos" },
  { name: "Phụ Kiện", slug: "accessories", description: "Thắt lưng, cà vạt và khăn tay" },
  { name: "Giày", slug: "footwear", description: "Giày boots, giày oxford và giày loafer" }
];

const productsSeed = [
  { name: "Bộ Vest Than Xám Sterling", slug: "sterling-charcoal-suit", description: "Một tác phẩm kinh điển vượt thời gian được chế tác từ cashmere Mông Cổ thuần chất.", price: 30625000, categorySlug: "outerwear", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBf4_zUESdwZhN5Nb9wIt62G81mZ5f3sPAK4bLU-CAdbEydJkZ4OlFyt7W0lMA0SmoSN-27GTpUiGZxvzH4PMTWVUuW6PZUdmMmTNwRRj8z9kkjKgN1f8ldOk1ie6LD7HnvtUH3vF5I0HyoIfNUJ9KfCe2gP0yFlHy_tbz3e-eGwjK_pP5OmGfooVxtetazXnf0FNeLSd3avJayvXdivrfRiYlScZs76izYfc3-2PYxNrIP361Xi-ZnrcKt4OFzPs-Vl85332wkzEY" },
  { name: "Áo Vest Len Nửa Đêm", slug: "midnight-wool-blazer", description: "Nhẹ, thoáng khí và vô cùng mềm mại.", price: 21802500, categorySlug: "outerwear", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9i87OVxxHmXunaf2nV6RiRdkzm0xIfz7Y08mMzSsDa_7UmulYg6nIlHDtegH4XL_-zONXUmzj1tN0WnJGcwc8kuUe-C4hpQobTA6QIMw0Ws8y-DnnCHcg04FeH7sie07O9ibl1mHmSxRSNDWlJhrw3qcNWLu6jJLeZJYdvhRWPsv7ta0uqjXcA8BK4Axsq8Q31Eqt2fDHkbtnTgGy8QNifJ3mhbogqXq_VTs7IG_8iXTeTBD-Z-IS-BroR1dC2AbCO671tI5pA1Q" },
  { name: "Áo Sơ Mi Bông Ai Cập", slug: "egyptian-cotton-shirt", description: "Cắt chính xác theo tạo hình hiện đại, hẹp ở thân.", price: 5390000, categorySlug: "shirts", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkp0y2C5sO1Kmu91TWIe7h52GvFcx0SmWm6yi-P4Q-C8fA1CzZqU4g5fguoaaXzb2x6tuCDAp5hhhQTzDTkFT83YMgOUUWv09T-BjnNNBEPSX8bz9zcvgq3jIgzzDckCKuB_vIouYoyZR7ECLCZR0703Rvs6Tavi0yJI5biQLzxTQ6W6m0ssRY2i3yR6LfpgkhUgtUs23Amzigrm7XQm_5M8rhY6Zf19HqelKZzSH8RkKcGGrBAmj7H07F10NsKCvjSdXxq0TvYq0" },
  { name: "Thắt Lưng Khâu Tay", slug: "hand-stitched-belt", description: "Làm thủ công tại Ý bằng da bê tự nhiên hạt.", price: 4410000, categorySlug: "accessories", imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3fvopJ4PhAVgkq5NfFoID5ynBIrdzvSVBtewp2HioS4M8Jn_5kO10K0n1P_OORiArGz567PAw-qwr3yHNCevPBF7mZ90E6iR2WkoCB8q28DuI9ufe50dRNic7Xu8WHEOO9pNyCW0soMPHCl4fXH0SlH49L-xqTzS3JPdA8nhYxTOCsOKfJJEH0lDnW0NjLKp6AM-bu7V4iSjw6St7fcmp2tvuOogG-F5M4oqME6tYpe8pxv8QjSppX3iqmSBC3yvCjVbAiB2fAQw" },
  { name: "Áo Len Cashmere Màu Kem", slug: "cashmere-cream-sweater", description: "Cashmere nguyên chất với độ mềm vàng.", price: 12250000, categorySlug: "knitwear", imageUrl: "https://picsum.photos/seed/sweater-cream/800/1200" },
  { name: "Quần Oxford Đen", slug: "oxford-black-trousers", description: "Quần âu được cắt may hoàn hảo với diện mạo kinh điển.", price: 7350000, categorySlug: "trousers", imageUrl: "https://picsum.photos/seed/trousers-black/800/1200" },
  { name: "Cà Vạt Lụa Hàng Ngày", slug: "silk-everyday-tie", description: "Cà vạt lụa thực vật với họa tiết tinh tế.", price: 1960000, categorySlug: "accessories", imageUrl: "https://picsum.photos/seed/tie-silk/800/1200" },
  { name: "Giày Oxford Da Nâu", slug: "brown-oxford-shoes", description: "Giày oxford da bò từ Anh, bền vào đế.", price: 9800000, categorySlug: "footwear", imageUrl: "https://picsum.photos/seed/oxford-brown/800/1200" },
  { name: "Áo Polo Cotton Trắng", slug: "white-polo-cotton", description: "Áo polo cotton chất lượng cao với fit thoải mái.", price: 2940000, categorySlug: "shirts", imageUrl: "https://picsum.photos/seed/polo-white/800/1200" },
  { name: "Áo Khoác Denim Xanh", slug: "denim-blue-jacket", description: "Áo khoác denim kiểu cổ điển, rất bền.", price: 4900000, categorySlug: "outerwear", imageUrl: "https://picsum.photos/seed/denim-jacket/800/1200" },
  { name: "Quần Chinos Xám Nhạt", slug: "light-gray-chinos", description: "Quần chinos thoải mái phù hợp mặc hằng ngày.", price: 3430000, categorySlug: "trousers", imageUrl: "https://picsum.photos/seed/chinos-gray/800/1200" },
  { name: "Áo Sơ Mi Poplin Xanh", slug: "blue-poplin-shirt", description: "Áo sơ mi poplin chất tốt với độ bền cao.", price: 3920000, categorySlug: "shirts", imageUrl: "https://picsum.photos/seed/shirt-blue/800/1200" },
  { name: "Thắt Lưng Da Nâu Đậm", slug: "dark-brown-belt", description: "Thắt lưng da bò nguyên chất, cắt rất sắc.", price: 3430000, categorySlug: "accessories", imageUrl: "https://picsum.photos/seed/belt-brown/800/1200" },
  { name: "Giày Loafer Da Đen", slug: "black-leather-loafers", description: "Giày loafer da mềm, thoải mái khi mặc.", price: 7840000, categorySlug: "footwear", imageUrl: "https://picsum.photos/seed/loafer-black/800/1200" },
  { name: "Ô Sơ Mi Tweed", slug: "tweed-overshirt", description: "Áo overshirt tweed kinh điển cho mùa đông.", price: 5880000, categorySlug: "outerwear", imageUrl: "https://picsum.photos/seed/overshirt-tweed/800/1200" },
  { name: "Tất Lụa Xám", slug: "gray-silk-socks", description: "Tất lụa thoáng mát, phù hợp mặc hằng ngày.", price: 490000, categorySlug: "accessories", imageUrl: "https://picsum.photos/seed/socks-gray/800/1200" },
  { name: "Áo Cardigan Nút Trước", slug: "button-cardigan", description: "Áo cardigan nút trước kiểu dáng thanh lịch.", price: 9310000, categorySlug: "knitwear", imageUrl: "https://picsum.photos/seed/cardigan/800/1200" },
  { name: "Quần Công Sở Xanh Sea", slug: "navy-business-trousers", description: "Quần công sở xanh navy, phù hợp công việc.", price: 6860000, categorySlug: "trousers", imageUrl: "https://picsum.photos/seed/trousers-navy/800/1200" },
  { name: "Áo Sơ Mi Linen Trắng", slug: "white-linen-shirt", description: "Áo sơ mi linen thoáng mát cho hè.", price: 3430000, categorySlug: "shirts", imageUrl: "https://picsum.photos/seed/shirt-linen/800/1200" },
  { name: "Giày Derby Bò Đỏ", slug: "tan-derby-shoes", description: "Giày derby da bò đỏ, thiết kế thanh lịch.", price: 8820000, categorySlug: "footwear", imageUrl: "https://picsum.photos/seed/derby-tan/800/1200" },
  { name: "Áo Khoác Lông Đen", slug: "black-wool-coat", description: "Áo khoác lông đen dáng dài, rất ấm.", price: 19600000, categorySlug: "outerwear", imageUrl: "https://picsum.photos/seed/coat-black/800/1200" },
  { name: "Vest Công Sở Xám", slug: "gray-business-vest", description: "Vest công sở xám đẹp mắt, vải chất lượng.", price: 13230000, categorySlug: "outerwear", imageUrl: "https://picsum.photos/seed/vest-gray/800/1200" },
  { name: "Khăn Tay Da Nâu", slug: "brown-pocket-square", description: "Khăn tay da nâu cao cấp cho vest.", price: 490000, categorySlug: "accessories", imageUrl: "https://picsum.photos/seed/square-brown/800/1200" },
  { name: "Quần Jeans Xanh", slug: "dark-blue-jeans", description: "Quần jeans xanh đậm, thiết kế cổ điển.", price: 3920000, categorySlug: "trousers", imageUrl: "https://picsum.photos/seed/jeans-blue/800/1200" },
  { name: "Áo Len Cô Đơn Đen", slug: "black-turtleneck", description: "Áo len cô đơn đen ôm vừa vặn, rất ấm.", price: 4410000, categorySlug: "knitwear", imageUrl: "https://picsum.photos/seed/turtleneck-black/800/1200" },
  { name: "Giày Thể Thao Trắng", slug: "white-sneakers", description: "Giày thể thao trắng phong cách, thoải mái.", price: 6370000, categorySlug: "footwear", imageUrl: "https://picsum.photos/seed/sneaker-white/800/1200" },
  { name: "Áo Sơ Mi Họa Tiết Check", slug: "checkered-shirt", description: "Áo sơ mi họa tiết check, rất hợp mốt.", price: 4410000, categorySlug: "shirts", imageUrl: "https://picsum.photos/seed/shirt-check/800/1200" },
  { name: "Thắt Lưng Canvas Tan", slug: "canvas-tan-belt", description: "Thắt lưng canvas thân thiện, nhẹ và bền.", price: 2450000, categorySlug: "accessories", imageUrl: "https://picsum.photos/seed/belt-canvas/800/1200" }
];

const variantSeed = [
  // Sterling Charcoal Suit
  { productSlug: "sterling-charcoal-suit", sku: "SCS-CHAR-S", size: "S", color: "Charcoal", stockQuantity: 8 },
  { productSlug: "sterling-charcoal-suit", sku: "SCS-CHAR-M", size: "M", color: "Charcoal", stockQuantity: 15 },
  { productSlug: "sterling-charcoal-suit", sku: "SCS-CHAR-L", size: "L", color: "Charcoal", stockQuantity: 12 },
  // Midnight Wool Blazer
  { productSlug: "midnight-wool-blazer", sku: "MWB-NAVY-M", size: "M", color: "Navy", stockQuantity: 15 },
  { productSlug: "midnight-wool-blazer", sku: "MWB-NAVY-L", size: "L", color: "Navy", stockQuantity: 12 },
  { productSlug: "midnight-wool-blazer", sku: "MWB-CHAR-M", size: "M", color: "Charcoal", stockQuantity: 10 },
  // Egyptian Cotton Shirt
  { productSlug: "egyptian-cotton-shirt", sku: "ECS-WHT-32", size: "32", color: "White", stockQuantity: 25 },
  { productSlug: "egyptian-cotton-shirt", sku: "ECS-WHT-34", size: "34", color: "White", stockQuantity: 30 },
  { productSlug: "egyptian-cotton-shirt", sku: "ECS-BLU-36", size: "36", color: "Blue", stockQuantity: 20 },
  // Hand-Stitched Belt
  { productSlug: "hand-stitched-belt", sku: "HSB-BRN-34", size: "34", color: "Brown", stockQuantity: 30 },
  { productSlug: "hand-stitched-belt", sku: "HSB-BRN-36", size: "36", color: "Brown", stockQuantity: 25 },
  { productSlug: "hand-stitched-belt", sku: "HSB-BLK-34", size: "34", color: "Black", stockQuantity: 20 },
  // Cashmere Cream Sweater
  { productSlug: "cashmere-cream-sweater", sku: "CCS-CREA-S", size: "S", color: "Cream", stockQuantity: 15 },
  { productSlug: "cashmere-cream-sweater", sku: "CCS-CREA-M", size: "M", color: "Cream", stockQuantity: 18 },
  { productSlug: "cashmere-cream-sweater", sku: "CCS-CREA-L", size: "L", color: "Cream", stockQuantity: 12 },
  // Oxford Black Trousers
  { productSlug: "oxford-black-trousers", sku: "OBT-BLK-30", size: "30", color: "Black", stockQuantity: 20 },
  { productSlug: "oxford-black-trousers", sku: "OBT-BLK-32", size: "32", color: "Black", stockQuantity: 25 },
  { productSlug: "oxford-black-trousers", sku: "OBT-BLK-34", size: "34", color: "Black", stockQuantity: 20 },
  // Silk Everyday Tie
  { productSlug: "silk-everyday-tie", sku: "SET-BLU-ONE", size: "One", color: "Blue", stockQuantity: 40 },
  { productSlug: "silk-everyday-tie", sku: "SET-RED-ONE", size: "One", color: "Red", stockQuantity: 35 },
  // Brown Oxford Shoes
  { productSlug: "brown-oxford-shoes", sku: "BOS-BRN-8", size: "8", color: "Brown", stockQuantity: 12 },
  { productSlug: "brown-oxford-shoes", sku: "BOS-BRN-9", size: "9", color: "Brown", stockQuantity: 15 },
  { productSlug: "brown-oxford-shoes", sku: "BOS-BRN-10", size: "10", color: "Brown", stockQuantity: 18 },
  // White Polo Cotton
  { productSlug: "white-polo-cotton", sku: "WPC-WHT-S", size: "S", color: "White", stockQuantity: 25 },
  { productSlug: "white-polo-cotton", sku: "WPC-WHT-M", size: "M", color: "White", stockQuantity: 30 },
  { productSlug: "white-polo-cotton", sku: "WPC-WHT-L", size: "L", color: "White", stockQuantity: 20 },
  // Denim Blue Jacket
  { productSlug: "denim-blue-jacket", sku: "DBJ-BLU-S", size: "S", color: "Blue", stockQuantity: 18 },
  { productSlug: "denim-blue-jacket", sku: "DBJ-BLU-M", size: "M", color: "Blue", stockQuantity: 22 },
  { productSlug: "denim-blue-jacket", sku: "DBJ-BLU-L", size: "L", color: "Blue", stockQuantity: 16 },
  // Light Gray Chinos
  { productSlug: "light-gray-chinos", sku: "LGC-GRY-30", size: "30", color: "Gray", stockQuantity: 25 },
  { productSlug: "light-gray-chinos", sku: "LGC-GRY-32", size: "32", color: "Gray", stockQuantity: 28 },
  { productSlug: "light-gray-chinos", sku: "LGC-GRY-34", size: "34", color: "Gray", stockQuantity: 20 },
  // Blue Poplin Shirt
  { productSlug: "blue-poplin-shirt", sku: "BPS-BLU-32", size: "32", color: "Blue", stockQuantity: 20 },
  { productSlug: "blue-poplin-shirt", sku: "BPS-BLU-34", size: "34", color: "Blue", stockQuantity: 25 },
  { productSlug: "blue-poplin-shirt", sku: "BPS-BLU-36", size: "36", color: "Blue", stockQuantity: 18 },
  // Dark Brown Belt
  { productSlug: "dark-brown-belt", sku: "DBB-DBR-34", size: "34", color: "Dark Brown", stockQuantity: 28 },
  { productSlug: "dark-brown-belt", sku: "DBB-DBR-36", size: "36", color: "Dark Brown", stockQuantity: 25 },
  // Black Leather Loafers
  { productSlug: "black-leather-loafers", sku: "BLL-BLK-8", size: "8", color: "Black", stockQuantity: 14 },
  { productSlug: "black-leather-loafers", sku: "BLL-BLK-9", size: "9", color: "Black", stockQuantity: 16 },
  { productSlug: "black-leather-loafers", sku: "BLL-BLK-10", size: "10", color: "Black", stockQuantity: 12 },
  // Tweed Overshirt
  { productSlug: "tweed-overshirt", sku: "TOV-TWD-S", size: "S", color: "Tweed", stockQuantity: 15 },
  { productSlug: "tweed-overshirt", sku: "TOV-TWD-M", size: "M", color: "Tweed", stockQuantity: 18 },
  { productSlug: "tweed-overshirt", sku: "TOV-TWD-L", size: "L", color: "Tweed", stockQuantity: 12 },
  // Gray Silk Socks
  { productSlug: "gray-silk-socks", sku: "GSS-GRY-ONE", size: "One", color: "Gray", stockQuantity: 50 },
  // Button Cardigan
  { productSlug: "button-cardigan", sku: "BCA-BLK-S", size: "S", color: "Black", stockQuantity: 18 },
  { productSlug: "button-cardigan", sku: "BCA-BLK-M", size: "M", color: "Black", stockQuantity: 22 },
  { productSlug: "button-cardigan", sku: "BCA-BLK-L", size: "L", color: "Black", stockQuantity: 16 },
  // Navy Business Trousers
  { productSlug: "navy-business-trousers", sku: "NBT-NAV-30", size: "30", color: "Navy", stockQuantity: 22 },
  { productSlug: "navy-business-trousers", sku: "NBT-NAV-32", size: "32", color: "Navy", stockQuantity: 26 },
  { productSlug: "navy-business-trousers", sku: "NBT-NAV-34", size: "34", color: "Navy", stockQuantity: 20 },
  // White Linen Shirt
  { productSlug: "white-linen-shirt", sku: "WLS-WHT-32", size: "32", color: "White", stockQuantity: 18 },
  { productSlug: "white-linen-shirt", sku: "WLS-WHT-34", size: "34", color: "White", stockQuantity: 22 },
  { productSlug: "white-linen-shirt", sku: "WLS-WHT-36", size: "36", color: "White", stockQuantity: 16 },
  // Tan Derby Shoes
  { productSlug: "tan-derby-shoes", sku: "TDS-TAN-8", size: "8", color: "Tan", stockQuantity: 14 },
  { productSlug: "tan-derby-shoes", sku: "TDS-TAN-9", size: "9", color: "Tan", stockQuantity: 16 },
  { productSlug: "tan-derby-shoes", sku: "TDS-TAN-10", size: "10", color: "Tan", stockQuantity: 12 },
  // Black Wool Coat
  { productSlug: "black-wool-coat", sku: "BWC-BLK-S", size: "S", color: "Black", stockQuantity: 10 },
  { productSlug: "black-wool-coat", sku: "BWC-BLK-M", size: "M", color: "Black", stockQuantity: 12 },
  { productSlug: "black-wool-coat", sku: "BWC-BLK-L", size: "L", color: "Black", stockQuantity: 8 },
  // Gray Business Vest
  { productSlug: "gray-business-vest", sku: "GBV-GRY-S", size: "S", color: "Gray", stockQuantity: 16 },
  { productSlug: "gray-business-vest", sku: "GBV-GRY-M", size: "M", color: "Gray", stockQuantity: 20 },
  { productSlug: "gray-business-vest", sku: "GBV-GRY-L", size: "L", color: "Gray", stockQuantity: 14 },
  // Brown Pocket Square
  { productSlug: "brown-pocket-square", sku: "BPS-BRN-ONE", size: "One", color: "Brown", stockQuantity: 45 },
  // Dark Blue Jeans
  { productSlug: "dark-blue-jeans", sku: "DBJ-BLU-30", size: "30", color: "Blue", stockQuantity: 24 },
  { productSlug: "dark-blue-jeans", sku: "DBJ-BLU-32", size: "32", color: "Blue", stockQuantity: 28 },
  { productSlug: "dark-blue-jeans", sku: "DBJ-BLU-34", size: "34", color: "Blue", stockQuantity: 22 },
  // Black Turtleneck
  { productSlug: "black-turtleneck", sku: "BT-BLK-S", size: "S", color: "Black", stockQuantity: 20 },
  { productSlug: "black-turtleneck", sku: "BT-BLK-M", size: "M", color: "Black", stockQuantity: 25 },
  { productSlug: "black-turtleneck", sku: "BT-BLK-L", size: "L", color: "Black", stockQuantity: 18 },
  // White Sneakers
  { productSlug: "white-sneakers", sku: "WS-WHT-8", size: "8", color: "White", stockQuantity: 18 },
  { productSlug: "white-sneakers", sku: "WS-WHT-9", size: "9", color: "White", stockQuantity: 22 },
  { productSlug: "white-sneakers", sku: "WS-WHT-10", size: "10", color: "White", stockQuantity: 20 },
  // Checkered Shirt
  { productSlug: "checkered-shirt", sku: "CS-CHK-32", size: "32", color: "Checkered", stockQuantity: 18 },
  { productSlug: "checkered-shirt", sku: "CS-CHK-34", size: "34", color: "Checkered", stockQuantity: 22 },
  { productSlug: "checkered-shirt", sku: "CS-CHK-36", size: "36", color: "Checkered", stockQuantity: 16 },
  // Canvas Tan Belt
  { productSlug: "canvas-tan-belt", sku: "CTB-TAN-34", size: "34", color: "Tan", stockQuantity: 32 },
  { productSlug: "canvas-tan-belt", sku: "CTB-TAN-36", size: "36", color: "Tan", stockQuantity: 28 }
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
