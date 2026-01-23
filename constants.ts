
import { Product, ProductType, PaymentMethod, User, Category, SiteSettings, PromoCode } from './types';

// Default Admin User
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Rəşad Məmmədov',
    email: 'user@s2gepin.az',
    phone: '0501234567',
    role: 'user', 
    balance: 15.50,
    password: 'password123',
    avatar: '',
    isBanned: false,
    referralCode: 'USER01'
  },
  {
    id: 'admin1',
    name: 'Admin',
    email: 'admin@s2gepin.az',
    phone: '0555555555',
    role: 'admin',
    balance: 0.00,
    password: 'admin',
    avatar: '',
    isBanned: false
  }
];

export const MOCK_PROMO_CODES: PromoCode[] = [
  { id: 'promo1', code: 'S2G10', discountPercent: 10, isActive: true },
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'S2GEPIN',
  logoUrl: '', 
  heroBannerUrl: '', 
  heroTitle: '',
  heroSubtitle: '',
  whatsappNumber: '+994555555555',
  contactEmail: 'support@s2gepin.com',
  contactAddress: 'Bakı, Azərbaycan',
  footerText: '© 2024 S2GEPIN. Bütün hüquqlar qorunur.',
  discordWebhook: '',
  seoTitle: 'S2GEPIN - Oyun və E-pin Satışı',
  seoDesc: 'PUBG UC, Valorant VP, Oyun Lisenziyaları və daha çoxu.',
  socials: {
    instagram: 'https://instagram.com',
    telegram: 'https://t.me',
    tiktok: 'https://tiktok.com',
    whatsapp: 'https://wa.me/994555555555'
  }
};

// Şəkillərə uyğun kateqoriyalar
export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_pubg', name: 'Pubg Mobile', icon: 'crosshair', image: 'https://wallpapers.com/images/hd/pubg-mobile-poster-j688p340057041a7.jpg' },
  { id: 'cat_valorant', name: 'Valorant', icon: 'shield', image: 'https://images.hdqwalls.com/wallpapers/valorant-4k-gaming-new-2020-ix.jpg' },
  { id: 'cat_pasha', name: 'Pasha Fencer', icon: 'sword', image: 'https://i.ytimg.com/vi/aA5GWY4k6gY/maxresdefault.jpg' },
  { id: 'cat_s2g', name: 'S2GMT2', icon: 'sword', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6sVv_R6sVv_R6sVv_R6sVv_R6sVv_R6sVv_R&s' }, // Placeholder
  { id: 'cat_warzone', name: 'Warzone Mobile', icon: 'crosshair', image: 'https://image.api.playstation.com/vulcan/ap/disc/21/11/02/763c784768393527a23363321523497b37568576d337.png' },
  { id: 'cat_wolfteam', name: 'Wolfteam', icon: 'skull', image: 'https://i.ytimg.com/vi/S7QzK1yW4SE/maxresdefault.jpg' },
  { id: 'cat_zula', name: 'Zula', icon: 'crosshair', image: 'https://cdn.akamai.steamstatic.com/steam/apps/455340/header.jpg' },
  { id: 'cat_metin2', name: 'Metin2', icon: 'sword', image: 'https://image.api.playstation.com/vulcan/ap/disc/21/11/02/763c784768393527a23363321523497b37568576d337.png' }, // Placeholder
  { id: 'cat_lol', name: 'League of Legends', icon: 'gamepad', image: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg' },
  { id: 'cat_whiteout', name: 'Whiteout Survival', icon: 'snowflake', image: 'https://play-lh.googleusercontent.com/6Xy1t9Xz9Xy1t9Xz9Xy1t9Xz9Xy1t9Xz9Xy1t9Xz9Xy1t9Xz=w526-h296-rw' }, // Placeholder
  { id: 'cat_platform', name: 'Platformlar', icon: 'monitor', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070' },
  { id: 'cat_merch', name: 'S2G Merch', icon: 'shirt', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000' },
  { id: 'cat_gift', name: 'Hədiyyə Kartları', icon: 'gift', image: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=1780' },
  { id: 'cat_google', name: 'Google Play', icon: 'play', image: 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' },
  { id: 'cat_apple', name: 'Apple', icon: 'smartphone', image: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?q=80' },
  { id: 'cat_steam', name: 'Steam', icon: 'wallet', image: 'https://steamcdn-a.akamaihd.net/steam/clusters/frontpage/88d697841551062080352528/page_bg_english.jpg' },
  { id: 'cat_xbox', name: 'Xbox Live', icon: 'gamepad', image: 'https://assets.xboxservices.com/assets/43/61/43615291-0320-438f-9a00-50ae40e79147.jpg?n=Xbox_Sharing_1200x630.jpg' },
  { id: 'cat_ps', name: 'PlayStation', icon: 'gamepad', image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$' },
  { id: 'cat_honor', name: 'Honor of Kings', icon: 'sword', image: 'https://i.ytimg.com/vi/S7QzK1yW4SE/maxresdefault.jpg' }, // Placeholder
  { id: 'cat_elmas', name: 'Elmas', icon: 'gem', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80' },
  { id: 'cat_mlbb', name: 'Mobile Legends', icon: 'sword', image: 'https://images6.alphacoders.com/110/1107530.jpg' },
];

export const INITIAL_PRODUCTS: Product[] = [
  // PUBG Products
  { id: 'pubg_60', title: '60 UC', categoryId: 'cat_pubg', type: ProductType.ID_LOAD, price: 1.70, costPrice: 1.50, discountPercent: 0, image: 'https://static.vecteezy.com/system/resources/previews/024/669/489/original/pubg-mobile-uc-60-currency-png.png', description: 'PUBG Mobile 60 UC. ID ilə yükləmə.', requiresInput: true, inputLabel: 'PUBG ID', stockCount: 999 },
  { id: 'pubg_325', title: '325 + 25 UC', categoryId: 'cat_pubg', type: ProductType.ID_LOAD, price: 9.20, costPrice: 8.50, discountPercent: 5, image: 'https://static.vecteezy.com/system/resources/previews/024/669/482/original/pubg-mobile-uc-300-currency-png.png', description: 'PUBG Mobile 325 UC + Bonus. ID ilə yükləmə.', requiresInput: true, inputLabel: 'PUBG ID', stockCount: 999 },
  
  // Valorant
  { id: 'val_115', title: '115 VP (TR)', categoryId: 'cat_valorant', type: ProductType.LICENSE_KEY, price: 2.50, costPrice: 2.00, discountPercent: 0, image: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt0f822108740c0649/5fd7f798e9b63b276d337f71/Valorant_2020_06_115_VP.png', description: 'Valorant 115 Points', isLifetime: true, stockCount: 50 },
  
  // Netflix (Sub Category Example Logic)
  { id: 'netflix_1m_shared', title: 'Netflix 1 Ay (Ortaq)', categoryId: 'cat_platform', type: ProductType.ACCOUNT, price: 4.00, costPrice: 2.00, discountPercent: 0, image: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg', description: 'Ortaq hesab.', durationDays: 30, stockCount: 20 },
  { id: 'netflix_1m_private', title: 'Netflix 1 Ay (Şəxsi)', categoryId: 'cat_platform', type: ProductType.ACCOUNT, price: 12.00, costPrice: 9.00, discountPercent: 0, image: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg', description: 'Şəxsi hesab.', durationDays: 30, stockCount: 10 },
];

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'pm1', name: 'Birbank', details: '4169 0000 0000 0000', instructions: 'Qeyd yazmayın', isActive: true, icon: 'credit-card' },
  { id: 'pm2', name: 'M10', details: '055 555 55 55', instructions: '', isActive: true, icon: 'smartphone' }
];
