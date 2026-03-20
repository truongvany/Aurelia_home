import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";

const productsSeed = [
  // ============ ÁOARR SƠ MI DÀI ============
  {
    categorySlug: "ao-so-mi-dai",
    name: "Áo Sơ Mi Dài Tay Trắng Trơn Premium",
    slug: "ao-so-mi-dai-tay-trang-tron-premium",
    description: "Áo sơ mi dài tay trắng trơn, chất liệu cotton 100%, phù hợp cho công sở",
    price: 450000,
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
  },
  {
    categorySlug: "ao-so-mi-dai",
    name: "Áo Sơ Mi Dài Tay Xanh Navy Đơn Giản",
    slug: "ao-so-mi-dai-tay-xanh-navy-don-gian",
    description: "Áo sơ mi xanh navy chính hãng, co giãn thoải mái",
    price: 480000,
    imageUrl: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=500",
  },
  {
    categorySlug: "ao-so-mi-dai",
    name: "Áo Sơ Mi Dài Tay Đen Sang Trọng",
    slug: "ao-so-mi-dai-tay-den-sang-trong",
    description: "Áo sơ mi đen chất lượng cao, thích hợp cho tiệc tối",
    price: 520000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "ao-so-mi-dai",
    name: "Áo Sơ Mi Dài Tay Sọc Xanh Trắng",
    slug: "ao-so-mi-dai-tay-soc-xanh-trang",
    description: "Áo sơ mi sọc xanh trắng hiện đại, dáng vừa vặn",
    price: 490000,
    imageUrl: "https://images.unsplash.com/photo-1603251578711-07ad70aaa855?w=500",
  },
  {
    categorySlug: "ao-so-mi-dai",
    name: "Áo Sơ Mi Dài Tay Xám Xanh Lịch Lãm",
    slug: "ao-so-mi-dai-tay-xam-xanh-lich-lam",
    description: "Áo sơ mi xám xanh phối màu tinh tế, kiểu dáng thanh lịch",
    price: 510000,
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
  },
  {
    categorySlug: "ao-so-mi-dai",
    name: "Áo Sơ Mi Dài Tay Hoa Văn Tinh Tế",
    slug: "ao-so-mi-dai-tay-hoa-van-tinh-te",
    description: "Áo sơ mi họa tiết hoa nhỏ, phong cách châu Âu",
    price: 530000,
    imageUrl: "https://images.unsplash.com/photo-1576566588620-ce8e565013ff?w=500",
  },
  {
    categorySlug: "ao-so-mi-dai",
    name: "Áo Sơ Mi Dài Tay Đỏ Bordeaux Quý Phái",
    slug: "ao-so-mi-dai-tay-do-bordeaux-quy-phai",
    description: "Áo sơ mi đỏ bordeaux cao cấp, tôn da và lịch lãm",
    price: 540000,
    imageUrl: "https://images.unsplash.com/photo-1564622506233-59897f588e71?w=500",
  },
  {
    categorySlug: "ao-so-mi-dai",
    name: "Áo Sơ Mi Dài Tay Ghi Xám Neutral",
    slug: "ao-so-mi-dai-tay-ghi-xam-neutral",
    description: "Áo sơ mi ghi xám trung tính, dễ phối đồ",
    price: 470000,
    imageUrl: "https://images.unsplash.com/photo-1569163139394-de4798aa62b2?w=500",
  },
  {
    categorySlug: "ao-so-mi-dai",
    name: "Áo Sơ Mi Dài Tay Kem Vintage",
    slug: "ao-so-mi-dai-tay-kem-vintage",
    description: "Áo sơ mi màu kem vintage, phù hợp với phong cách retro",
    price: 500000,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
  },
  {
    categorySlug: "ao-so-mi-dai",
    name: "Áo Sơ Mi Dài Tay Oxford Xanh Đậm",
    slug: "ao-so-mi-dai-tay-oxford-xanh-dam",
    description: "Áo sơ mi Oxford xanh đậm chất lượng cao, bền bỉ",
    price: 550000,
    imageUrl: "https://images.unsplash.com/photo-1585836959991-8b6ef7d89a13?w=500",
  },

  // ============ ÁO SƠ MI NGẮN ============
  {
    categorySlug: "ao-so-mi-ngan",
    name: "Áo Sơ Mi Ngắn Tay Trắng Công Sở",
    slug: "ao-so-mi-ngan-tay-trang-cong-so",
    description: "Áo sơ mi ngắn tay trắng, thoáng mát, phù hợp mùa hè",
    price: 380000,
    imageUrl: "https://images.unsplash.com/photo-1596215578519-29d90de7c5ad?w=500",
  },
  {
    categorySlug: "ao-so-mi-ngan",
    name: "Áo Sơ Mi Ngắn Tay Xanh Navy",
    slug: "ao-so-mi-ngan-tay-xanh-navy",
    description: "Áo sơ mi ngắn tay xanh navy bản dệt chất lượng",
    price: 400000,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
  },
  {
    categorySlug: "ao-so-mi-ngan",
    name: "Áo Sơ Mi Ngắn Tay Đen Thanh Lịch",
    slug: "ao-so-mi-ngan-tay-den-thanh-lich",
    description: "Áo sơ mi ngắn tay đen, dáng vừa phù hợp công sở",
    price: 420000,
    imageUrl: "https://images.unsplash.com/photo-1574192768550-f05b1989e77e?w=500",
  },
  {
    categorySlug: "ao-so-mi-ngan",
    name: "Áo Sơ Mi Ngắn Tay Sọc Đôi",
    slug: "ao-so-mi-ngan-tay-soc-doi",
    description: "Áo sơ mi ngắn tay với sọc đôi tinh tế, hiện đại",
    price: 410000,
    imageUrl: "https://images.unsplash.com/photo-1589992619313-08aada34bd50?w=500",
  },
  {
    categorySlug: "ao-so-mi-ngan",
    name: "Áo Sơ Mi Ngắn Tay Xám Phong Cách",
    slug: "ao-so-mi-ngan-tay-xam-phong-cach",
    description: "Áo sơ mi ngắn tay xám phong cách đơn giản",
    price: 390000,
    imageUrl: "https://images.unsplash.com/photo-1552108134-0d9e34f8c1ad?w=500",
  },
  {
    categorySlug: "ao-so-mi-ngan",
    name: "Áo Sơ Mi Ngắn Tay Ghi Trắng Thoáng Mát",
    slug: "ao-so-mi-ngan-tay-ghi-trang-thoang-mat",
    description: "Áo sơ mi ngắn tay ghi trắng, thấm hút tốt",
    price: 370000,
    imageUrl: "https://images.unsplash.com/photo-1548882735-76f06f2a44a3?w=500",
  },
  {
    categorySlug: "ao-so-mi-ngan",
    name: "Áo Sơ Mi Ngắn Tay Hoa Nhỏ Tinh Tế",
    slug: "ao-so-mi-ngan-tay-hoa-nho-tinh-te",
    description: "Áo sơ mi ngắn tay họa tiết hoa nhỏ nhẹ nhàng",
    price: 430000,
    imageUrl: "https://images.unsplash.com/photo-1495406046316-4781b3a9a8a0?w=500",
  },
  {
    categorySlug: "ao-so-mi-ngan",
    name: "Áo Sơ Mi Ngắn Tay Kem Retro",
    slug: "ao-so-mi-ngan-tay-kem-retro",
    description: "Áo sơ mi ngắn tay màu kem phong cách retro",
    price: 400000,
    imageUrl: "https://images.unsplash.com/photo-1577096236343-eb17ad9ff9d9?w=500",
  },
  {
    categorySlug: "ao-so-mi-ngan",
    name: "Áo Sơ Mi Ngắn Tay Đỏ Tươi",
    slug: "ao-so-mi-ngan-tay-do-tuoi",
    description: "Áo sơ mi ngắn tay đỏ tươi tràn năng lượng",
    price: 410000,
    imageUrl: "https://images.unsplash.com/photo-1606977865849-0c91bcbd6ac7?w=500",
  },

  // ============ ÁO KHOÁC ============
  {
    categorySlug: "ao-khoac",
    name: "Áo Khoác Blazer Xanh Navy Cơi Bản",
    slug: "ao-khoac-blazer-xanh-navy-co-i-ban",
    description: "Áo khoác blazer xanh navy chính thức, phù hợp lịch sự",
    price: 1200000,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500",
  },
  {
    categorySlug: "ao-khoac",
    name: "Áo Khoác Blazer Đen Sang Trọng",
    slug: "ao-khoac-blazer-den-sang-trong",
    description: "Áo khoác blazer đen cao cấp, dáng tinh tế",
    price: 1350000,
    imageUrl: "https://images.unsplash.com/photo-1552062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "ao-khoac",
    name: "Áo Khoác Blazer Ghi Xám Trung Tính",
    slug: "ao-khoac-blazer-ghi-xam-trung-tinh",
    description: "Áo khoác blazer ghi xám dễ phối, hiện đại",
    price: 1250000,
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
  },
  {
    categorySlug: "ao-khoac",
    name: "Áo Khoác Tweed Nâu Retro",
    slug: "ao-khoac-tweed-nau-retro",
    description: "Áo khoác tweed nâu kiểu dáng cổ điển, phong cách British",
    price: 1450000,
    imageUrl: "https://images.unsplash.com/photo-1551169014-2f0c6d05937e?w=500",
  },
  {
    categorySlug: "ao-khoac",
    name: "Áo Khoác Cardigan Xám Nhẹ Nhàng",
    slug: "ao-khoac-cardigan-xam-nhe-nhang",
    description: "Áo khoác cardigan xám, chất liệu mềm mại thoải mái",
    price: 850000,
    imageUrl: "https://images.unsplash.com/photo-1551156521-4ab5eef7bdd9?w=500",
  },
  {
    categorySlug: "ao-khoac",
    name: "Áo Khoác Harrington Xanh Navy",
    slug: "ao-khoac-harrington-xanh-navy",
    description: "Áo khoác Harrington xanh navy cổ điển, bền bỉ",
    price: 950000,
    imageUrl: "https://images.unsplash.com/photo-1611003228941-98852ba62227?w=500",
  },
  {
    categorySlug: "ao-khoac",
    name: "Áo Khoác Bomber Đen Hiện Đại",
    slug: "ao-khoac-bomber-den-hien-dai",
    description: "Áo khoác bomber đen kiểu hiện đại năng động",
    price: 1100000,
    imageUrl: "https://images.unsplash.com/photo-1515222202280-a2bc1d1c2e3f?w=500",
  },
  {
    categorySlug: "ao-khoac",
    name: "Áo Khoác Denim Xanh Đậm",
    slug: "ao-khoac-denim-xanh-dam",
    description: "Áo khoác denim xanh đậm kinh điển, dễ phối",
    price: 890000,
    imageUrl: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500",
  },

  // ============ ÁO THUN ============
  {
    categorySlug: "ao-thun",
    name: "Áo Thun Cotton Trắng Trơn",
    slug: "ao-thun-cotton-trang-tron",
    description: "Áo thun cotton 100% trắng trơn, thoáng mát",
    price: 220000,
    imageUrl: "https://images.unsplash.com/photo-1586003895917-0955b1c87d04?w=500",
  },
  {
    categorySlug: "ao-thun",
    name: "Áo Thun Cotton Đen Cơ Bản",
    slug: "ao-thun-cotton-den-co-ban",
    description: "Áo thun đen cơ bản, chất lượng cao, bền bỉ",
    price: 230000,
    imageUrl: "https://images.unsplash.com/photo-1504034912131-69fc02b76b60?w=500",
  },
  {
    categorySlug: "ao-thun",
    name: "Áo Thun Cotton Xanh Navy",
    slug: "ao-thun-cotton-xanh-navy",
    description: "Áo thun xanh navy dịu nhỏ, quần jean hay khaki đều tịp",
    price: 240000,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
  },
  {
    categorySlug: "ao-thun",
    name: "Áo Thun Ghi Xám Neutralhigh",
    slug: "ao-thun-ghi-xam-neutral-high",
    description: "Áo thun ghi xám chất lượng cao, phù hợp mọi phong cách",
    price: 235000,
    imageUrl: "https://images.unsplash.com/photo-1586457692125-cae62badad00?w=500",
  },
  {
    categorySlug: "ao-thun",
    name: "Áo Thun Cổ Polo Xanh",
    slug: "ao-thun-co-polo-xanh",
    description: "Áo thun kiểu polo xanh lá cây, công sở nhưng vẫn thoáng",
    price: 320000,
    imageUrl: "https://images.unsplash.com/photo-1597070689304-80dc192aee02?w=500",
  },
  {
    categorySlug: "ao-thun",
    name: "Áo Thun Cổ Polo Trắng",
    slug: "ao-thun-co-polo-trang",
    description: "Áo thun kiểu polo trắng sạch sẽ, lịch sự",
    price: 315000,
    imageUrl: "https://images.unsplash.com/photo-1538618666990-846a7eab68d5?w=500",
  },
  {
    categorySlug: "ao-thun",
    name: "Áo Thun Cổ Polo Đen",
    slug: "ao-thun-co-polo-den",
    description: "Áo thun kiểu polo đen sang trọng, tôn dáng",
    price: 325000,
    imageUrl: "https://images.unsplash.com/photo-1577359451106-37a7f3b76332?w=500",
  },

  // ============ ÁO VEST ============
  {
    categorySlug: "ao-vest",
    name: "Áo Vest Xanh Navy Hai Nút",
    slug: "ao-vest-xanh-navy-hai-nut",
    description: "Áo vest xanh navy hai nút, kiểu cổ điển lịch sự",
    price: 2500000,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
  },
  {
    categorySlug: "ao-vest",
    name: "Áo Vest Đen Ba Nút Sang Trọng",
    slug: "ao-vest-den-ba-nut-sang-trong",
    description: "Áo vest đen ba nút suôn, chất liệu cao cấp",
    price: 2800000,
    imageUrl: "https://images.unsplash.com/photo-1591047990306-9641dbe56cbe?w=500",
  },
  {
    categorySlug: "ao-vest",
    name: "Áo Vest Ghi Xám Hiện Đại",
    slug: "ao-vest-ghi-xam-hien-dai",
    description: "Áo vest ghi xám, dáng slim modern, phong cách thanh niên",
    price: 2600000,
    imageUrl: "https://images.unsplash.com/photo-1562043666-980c47c37147?w=500",
  },
  {
    categorySlug: "ao-vest",
    name: "Áo Vest Nâu Vàng Châu Âu",
    slug: "ao-vest-nau-vang-chau-au",
    description: "Áo vest nâu vàng kiểu châu Âu, sang trọng",
    price: 2700000,
    imageUrl: "https://images.unsplash.com/photo-1505298346881-b72b27e84530?w=500",
  },

  // ============ QUẦN TÂY ============
  {
    categorySlug: "quan-tay",
    name: "Quần Tây Đen Công Sở Cơ Bản",
    slug: "quan-tay-den-cong-so-co-ban",
    description: "Quần tây đen chất lượng, phù hợp công sở",
    price: 650000,
    imageUrl: "https://images.unsplash.com/photo-1473621038790-b0fdc4f38edc?w=500",
  },
  {
    categorySlug: "quan-tay",
    name: "Quần Tây Xanh Navy Lịch Lãm",
    slug: "quan-tay-xanh-navy-lich-lam",
    description: "Quần tây xanh navy, dáng vừa vặn, lịch lãm",
    price: 680000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
  },
  {
    categorySlug: "quan-tay",
    name: "Quần Tây Ghi Xám Trung Lập",
    slug: "quan-tay-ghi-xam-trung-lap",
    description: "Quần tây ghi xám, dễ phối, chất lượng cao",
    price: 660000,
    imageUrl: "https://images.unsplash.com/photo-1552062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "quan-tay",
    name: "Quần Tây Kep Ghi Xám",
    slug: "quan-tay-kep-ghi-xam",
    description: "Quần tây có kep ghi xám, hiện đại thanh lịch",
    price: 720000,
    imageUrl: "https://images.unsplash.com/photo-1504831291269-8a3b3c52b5eb?w=500",
  },
  {
    categorySlug: "quan-tay",
    name: "Quần Tây Nâu Ấm Áp",
    slug: "quan-tay-nau-am-ap",
    description: "Quần tây nâu ấm áp, phù hợp cho phong cách casual-formal",
    price: 670000,
    imageUrl: "https://images.unsplash.com/photo-1506322913618-fdf32e4c2dab?w=500",
  },
  {
    categorySlug: "quan-tay",
    name: "Quần Tây Crem Vàng Nhẹ",
    slug: "quan-tay-crem-vang-nhe",
    description: "Quần tây crem vàng nhẹ, sang trọng cho mùa hè",
    price: 690000,
    imageUrl: "https://images.unsplash.com/photo-1473621038790-b0fdc4f38edc?w=500",
  },

  // ============ QUẦN KAKI ============
  {
    categorySlug: "quan-kaki",
    name: "Quần Kaki Khaki Cơ Bản",
    slug: "quan-kaki-khaki-co-ban",
    description: "Quần kaki khaki cơ bản, công sở thoáng mát",
    price: 480000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
  },
  {
    categorySlug: "quan-kaki",
    name: "Quần Kaki Nâu Sáng Dễ Dàng",
    slug: "quan-kaki-nau-sang-de-dang",
    description: "Quần kaki nâu sáng, dễ mix & match",
    price: 500000,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500",
  },
  {
    categorySlug: "quan-kaki",
    name: "Quần Kaki Ghi Xám Thanh Lịch",
    slug: "quan-kaki-ghi-xam-thanh-lich",
    description: "Quần kaki ghi xám, kiểu dáng thanh lịch",
    price: 520000,
    imageUrl: "https://images.unsplash.com/photo-1506322913618-fdf32e4c2dab?w=500",
  },
  {
    categorySlug: "quan-kaki",
    name: "Quần Kaki Kem Trắng Nhẹ",
    slug: "quan-kaki-kem-trang-nhe",
    description: "Quần kaki kem trắng nhẹ nhàng, phù hợp mùa hè",
    price: 510000,
    imageUrl: "https://images.unsplash.com/photo-1473621038790-b0fdc4f38edc?w=500",
  },
  {
    categorySlug: "quan-kaki",
    name: "Quần Kaki Đen Chính Thức",
    slug: "quan-kaki-den-chinh-thuc",
    description: "Quần kaki đen chính thức, lịch sự công sở",
    price: 530000,
    imageUrl: "https://images.unsplash.com/photo-1504033894176-8a385546519d?w=500",
  },
  {
    categorySlug: "quan-kaki",
    name: "Quần Kaki Xanh Navy Cổ Điển",
    slug: "quan-kaki-xanh-navy-co-dien",
    description: "Quần kaki xanh navy cổ điển, bền bỉ",
    price: 540000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
  },

  // ============ QUẦN NGÔ KAKI (CHINO) ============
  {
    categorySlug: "quan-ngo-kaki",
    name: "Quần Chino Khaki Cơ Bản",
    slug: "quan-chino-khaki-co-ban",
    description: "Quần chino khaki cơ bản, vải đặc, bền bỉ",
    price: 420000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
  },
  {
    categorySlug: "quan-ngo-kaki",
    name: "Quần Chino Nâu Ấm Áp",
    slug: "quan-chino-nau-am-ap",
    description: "Quần chino nâu ấm áp, phong cách casual nhưng lịch sự",
    price: 440000,
    imageUrl: "https://images.unsplash.com/photo-1506322913618-fdf32e4c2dab?w=500",
  },
  {
    categorySlug: "quan-ngo-kaki",
    name: "Quần Chino Ghi Xám Trung Tính",
    slug: "quan-chino-ghi-xam-trung-tinh",
    description: "Quần chino ghi xám, dễ phối, đa năng",
    price: 430000,
    imageUrl: "https://images.unsplash.com/photo-1473621038790-b0fdc4f38edc?w=500",
  },
  {
    categorySlug: "quan-ngo-kaki",
    name: "Quần Chino Đen Thanh Lịch",
    slug: "quan-chino-den-thanh-lich",
    description: "Quần chino đen, kiểu dáng thanh lịch",
    price: 450000,
    imageUrl: "https://images.unsplash.com/photo-1504033894176-8a385546519d?w=500",
  },
  {
    categorySlug: "quan-ngo-kaki",
    name: "Quần Chino Kem Vàng Nhẹ",
    slug: "quan-chino-kem-vang-nhe",
    description: "Quần chino kem vàng nhẹ, sang trọng cho mùa hè",
    price: 435000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
  },

  // ============ QUẦN JEANS ============
  {
    categorySlug: "quan-jeans",
    name: "Quần Jeans Xanh Đậm Cơ Bản",
    slug: "quan-jeans-xanh-dam-co-ban",
    description: "Quần jeans xanh đậm, cơ bản, bền bỉ",
    price: 380000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
  },
  {
    categorySlug: "quan-jeans",
    name: "Quần Jeans Xanh Nhạt Hiện Đại",
    slug: "quan-jeans-xanh-nhat-hien-dai",
    description: "Quần jeans xanh nhạt, kiểu dáng hiện đại",
    price: 400000,
    imageUrl: "https://images.unsplash.com/photo-1506322913618-fdf32e4c2dab?w=500",
  },
  {
    categorySlug: "quan-jeans",
    name: "Quần Jeans Đen Sang Trọng",
    slug: "quan-jeans-den-sang-trong",
    description: "Quần jeans đen sang trọng, chất lượng cao",
    price: 390000,
    imageUrl: "https://images.unsplash.com/photo-1473621038790-b0fdc4f38edc?w=500",
  },
  {
    categorySlug: "quan-jeans",
    name: "Quần Jeans Xanh Trung Bình",
    slug: "quan-jeans-xanh-trung-binh",
    description: "Quần jeans xanh trung bình, dễ phối",
    price: 385000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
  },
  {
    categorySlug: "quan-jeans",
    name: "Quần Jeans Ripped Blue Trẻ Trung",
    slug: "quan-jeans-ripped-blue-tre-trung",
    description: "Quần jeans có ripped, phong cách trẻ trung",
    price: 420000,
    imageUrl: "https://images.unsplash.com/photo-1506322913618-fdf32e4c2dab?w=500",
  },

  // ============ QUẦN SHORT ============
  {
    categorySlug: "quan-short",
    name: "Quần Short Kaki Khaki",
    slug: "quan-short-kaki-khaki",
    description: "Quần short kaki khaki, thoáng mát cho mùa hè",
    price: 280000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
  },
  {
    categorySlug: "quan-short",
    name: "Quần Short Đen Cổ Điển",
    slug: "quan-short-den-co-dien",
    description: "Quần short đen cổ điển, chính thức",
    price: 290000,
    imageUrl: "https://images.unsplash.com/photo-1473621038790-b0fdc4f38edc?w=500",
  },
  {
    categorySlug: "quan-short",
    name: "Quần Short Nâu Sáng",
    slug: "quan-short-nau-sang",
    description: "Quần short nâu sáng, dễ phối",
    price: 300000,
    imageUrl: "https://images.unsplash.com/photo-1506322913618-fdf32e4c2dab?w=500",
  },
  {
    categorySlug: "quan-short",
    name: "Quần Short Xanh Navy",
    slug: "quan-short-xanh-navy",
    description: "Quần short xanh navy, sang trọng",
    price: 310000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
  },

  // ============ DÂY LƯNG NAM ============
  {
    categorySlug: "day-lung-nam",
    name: "Dây Lưng Da Đen Sang Trọng",
    slug: "day-lung-da-den-sang-trong",
    description: "Dây lưng da bò đen, khóa kim loại sang trọng",
    price: 320000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "day-lung-nam",
    name: "Dây Lưng Da Nâu Cổ Điển",
    slug: "day-lung-da-nau-co-dien",
    description: "Dây lưng da nâu cổ điển, bền bỉ",
    price: 330000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "day-lung-nam",
    name: "Dây Lưng Nylon Đen Thoải Mái",
    slug: "day-lung-nylon-den-thoai-mai",
    description: "Dây lưng nylon đen, thoải mái cho công sở",
    price: 180000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "day-lung-nam",
    name: "Dây Lưng Nylon Xanh Navy",
    slug: "day-lung-nylon-xanh-navy",
    description: "Dây lưng nylon xanh navy, dễ vệ sinh",
    price: 190000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "day-lung-nam",
    name: "Dây Lưng Da Khóa Tự Động",
    slug: "day-lung-da-khoa-tu-dong",
    description: "Dây lưng da bò khóa tự động, tiện lợi",
    price: 350000,
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
  },
  {
    categorySlug: "day-lung-nam",
    name: "Dây Lưng Da Hạt Hoa Cương",
    slug: "day-lung-da-hat-hoa-cuong",
    description: "Dây lưng da chất lượng cao với họa tiết hoa cương",
    price: 360000,
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",
  },

  // ============ GIÀY DA ============
  {
    categorySlug: "giay-da",
    name: "Giày Da Oxford Đen Chính Thức",
    slug: "giay-da-oxford-den-chinh-thuc",
    description: "Giày da oxford đen, chính thức, phù hợp tiệc tối",
    price: 1200000,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  },
  {
    categorySlug: "giay-da",
    name: "Giày Da Loafer Nâu Cổ Điển",
    slug: "giay-da-loafer-nau-co-dien",
    description: "Giày da loafer nâu, kiểu cổ điển lịch sự",
    price: 1100000,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=500",
  },
  {
    categorySlug: "giay-da",
    name: "Giày Da Lace-up Đen Thường Ngày",
    slug: "giay-da-lace-up-den-thuong-ngay",
    description: "Giày da buộc dây đen, phù hợp công sở hàng ngày",
    price: 950000,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  },
  {
    categorySlug: "giay-da",
    name: "Giày Da Derby Nâu Cổ Điển",
    slug: "giay-da-derby-nau-co-dien",
    description: "Giày da derby nâu, kiểu cổ điển thoải mái",
    price: 1050000,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=500",
  },
  {
    categorySlug: "giay-da",
    name: "Giày Da Slip-on Xanh Navy",
    slug: "giay-da-slip-on-xanh-navy",
    description: "Giày da slip-on xanh navy, dễ mang",
    price: 900000,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  },
  {
    categorySlug: "giay-da",
    name: "Giày Da Chelsea Đen Sang Trọng",
    slug: "giay-da-chelsea-den-sang-trong",
    description: "Giày da chelsea đen, sang trọng hiện đại",
    price: 1300000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },

  // ============ MŨ ============
  {
    categorySlug: "mu",
    name: "Mũ Lưỡi Trai Xanh Navy",
    slug: "mu-luoi-trai-xanh-navy",
    description: "Mũ lưỡi trai xanh navy, phù hợp cả trang phục công sở",
    price: 180000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "mu",
    name: "Mũ Lưỡi Trai Đen Cổ Điển",
    slug: "mu-luoi-trai-den-co-dien",
    description: "Mũ lưỡi trai đen cổ điển, bền bỉ",
    price: 190000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "mu",
    name: "Mũ Beanie Xám Ấm Áp",
    slug: "mu-beanie-xam-am-ap",
    description: "Mũ beanie xám, ấm áp cho mùa đông",
    price: 150000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "mu",
    name: "Mũ Beanie Đen Sang Trọng",
    slug: "mu-beanie-den-sang-trong",
    description: "Mũ beanie đen, sang trọng và ấm áp",
    price: 160000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "mu",
    name: "Mũ Fedora Nâu Cổ Điển",
    slug: "mu-fedora-nau-co-dien",
    description: "Mũ fedora nâu cổ điển, lịch lãm",
    price: 280000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "mu",
    name: "Mũ Fedora Đen Sang Trọng",
    slug: "mu-fedora-den-sang-trong",
    description: "Mũ fedora đen, sang trọng cho dạo phố",
    price: 290000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },

  // ============ TẤT NAM ============
  {
    categorySlug: "tat-nam",
    name: "Tất Nam Cotton Đen",
    slug: "tat-nam-cotton-den",
    description: "Tất nam cotton đen, thoáng mát, chất lượng cao",
    price: 50000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "tat-nam",
    name: "Tất Nam Cotton Trắng",
    slug: "tat-nam-cotton-trang",
    description: "Tất nam cotton trắng sạch sẽ",
    price: 50000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "tat-nam",
    name: "Tất Nam Cotton Xanh Navy",
    slug: "tat-nam-cotton-xanh-navy",
    description: "Tất nam cotton xanh navy, dù và thoáng",
    price: 55000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "tat-nam",
    name: "Tất Nam Cotton Xám",
    slug: "tat-nam-cotton-xam",
    description: "Tất nam cotton xám, dễ phối",
    price: 52000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "tat-nam",
    name: "Tất Nam Merino Wool",
    slug: "tat-nam-merino-wool",
    description: "Tất nam sợi merino wool, ấm áp cho mùa đông",
    price: 120000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },
  {
    categorySlug: "tat-nam",
    name: "Tất Nam Chống Mùi",
    slug: "tat-nam-chong-mui",
    description: "Tất nam chống mùi, chất liệu đặc biệt",
    price: 85000,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
  },

  // ============ SẢN PHẨM ƯU ĐÃI ============
  {
    categorySlug: "ao-polo-sale",
    name: "Áo Polo Sale Xanh Navy -30%",
    slug: "ao-polo-sale-xanh-navy-giam-30",
    description: "Áo polo xanh navy giảm 30%, chất lượng cao",
    price: 280000,
    imageUrl: "https://images.unsplash.com/photo-1597070689304-80dc192aee02?w=500",
  },
  {
    categorySlug: "ao-polo-sale",
    name: "Áo Polo Sale Trắng -25%",
    slug: "ao-polo-sale-trang-giam-25",
    description: "Áo polo trắng giảm 25%, thoáng mát",
    price: 270000,
    imageUrl: "https://images.unsplash.com/photo-1597070689304-80dc192aee02?w=500",
  },
  {
    categorySlug: "ao-polo-sale",
    name: "Áo Polo Sale Đen -20%",
    slug: "ao-polo-sale-den-giam-20",
    description: "Áo polo đen giảm 20%, sang trọng",
    price: 290000,
    imageUrl: "https://images.unsplash.com/photo-1597070689304-80dc192aee02?w=500",
  },
  {
    categorySlug: "quan-au-sale",
    name: "Quần Tây Sale Đen -40%",
    slug: "quan-tay-sale-den-giam-40",
    description: "Quần tây đen giảm 40%, lịch sự",
    price: 390000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
  },
  {
    categorySlug: "quan-au-sale",
    name: "Quần Tây Sale Xanh Navy -35%",
    slug: "quan-tay-sale-xanh-navy-giam-35",
    description: "Quần tây xanh navy giảm 35%, chất lượng cao",
    price: 420000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
  },
  {
    categorySlug: "top-san-pham-ban-chay",
    name: "Top: Áo Sơ Mi Dài Premium",
    slug: "top-ao-so-mi-dai-premium",
    description: "Top bán chạy: Áo sơ mi dài tay trắng premium",
    price: 450000,
    imageUrl: "https://images.unsplash.com/photo-1596215578519-29d90de7c5ad?w=500",
  },
  {
    categorySlug: "top-san-pham-ban-chay",
    name: "Top: Quần Kaki Cơ Bản",
    slug: "top-quan-kaki-co-ban",
    description: "Top bán chạy: Quần kaki khaki cơ bản",
    price: 480000,
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500",
  },
  {
    categorySlug: "top-san-pham-ban-chay",
    name: "Top: Giày Da Oxford",
    slug: "top-giay-da-oxford",
    description: "Top bán chạy: Giày da oxford đen chính thức",
    price: 1200000,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  },
];

// Helper to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "");
};

export const seedProducts = async () => {
  try {
    await connectDatabase();

    console.log("🛍️  Seeding products...");

    // Clear existing products
    await ProductModel.deleteMany({});

    // Get all categories
    const categories = await CategoryModel.find({});
    const categoryMap: { [key: string]: string } = {};

    // Build category slug to ID map
    for (const category of categories) {
      categoryMap[category.slug] = category._id.toString();
    }

    let createdCount = 0;

    // Create products
    for (const productData of productsSeed) {
      const categoryId = categoryMap[productData.categorySlug];

      if (!categoryId) {
        console.warn(`⚠️  Category not found: ${productData.categorySlug}`);
        continue;
      }

      const product = await ProductModel.create({
        categoryId,
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        imageUrl: productData.imageUrl,
        sizeGuideImageUrl: "",
        isActive: true,
      });

      createdCount++;
      console.log(`✓ Created product: ${productData.name} (${productData.price.toLocaleString("vi-VN")} VNĐ)`);
    }

    console.log(`\n✓ Products seeded successfully!`);
    console.log(`📊 Total products created: ${createdCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
