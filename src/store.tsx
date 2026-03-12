import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, Order, PaymentMethod, User, OrderStatus, ProductType, Category, SiteSettings, Blog, Agreement, Comment, CartItem, PromoCode, Notification, StockCode, ActivityLog, HeroSlide, Page } from './types';

interface AppContextType {
  user: User | null; 
  usersList: User[];
  isAuthenticated: boolean;
  products: Product[];
  categories: Category[];
  orders: Order[];
  paymentMethods: PaymentMethod[];
  promoCodes: PromoCode[];
  siteSettings: SiteSettings;
  blogs: Blog[];
  agreements: Agreement[];
  pages: Page[]; 
  comments: Comment[];
  cart: CartItem[];
  notifications: Notification[];
  stocks: StockCode[]; 
  activityLogs: ActivityLog[]; 
  heroSlides: HeroSlide[];
  
  // UI State
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  
  // Auth
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<boolean>;
  requestPasswordReset: (phone: string) => Promise<boolean>;
  adminUpdateUserPassword: (userId: string, newPass: string) => Promise<void>;
  toggleUserBan: (userId: string) => Promise<void>;
  generateResetLink: (userId: string) => string;
  confirmPasswordReset: (token: string, newPass: string) => Promise<boolean>;
  toggleWishlist: (productId: string) => Promise<void>; 

  // Cart
  addToCart: (product: Product, userInput?: string) => void;
  updateCartQuantity: (index: number, delta: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;

  // Order Actions
  placeOrder: (paymentMethodId: string | 'BALANCE', receiptFile?: File, promoDiscount?: number) => Promise<boolean>;
  placeBalanceOrder: (amount: number, paymentMethodId: string, receiptFile: File) => Promise<boolean>;
  processOrder: (orderId: string) => Promise<void>;
  completeOrder: (orderId: string, manualContent?: string) => Promise<void>; 
  cancelOrder: (orderId: string) => Promise<void>;
  
  // Notification Actions
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Admin CMS & Stock
  addProduct: (product: Product) => Promise<void>;
  addProducts: (newProducts: Product[]) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  togglePopularProduct: (productId: string) => Promise<void>;
  
  addCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  togglePopularCategory: (categoryId: string) => Promise<void>;

  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  updateUserBalance: (userId: string, amount: number) => Promise<void>;
  addPaymentMethod: (method: PaymentMethod) => Promise<void>;
  updatePaymentMethod: (id: string, details: Partial<PaymentMethod>) => Promise<void>;
  deletePaymentMethod: (id: string) => Promise<void>;
  addPromoCode: (promo: PromoCode) => Promise<void>;
  deletePromoCode: (id: string) => Promise<void>;
  togglePromoCode: (id: string) => Promise<void>;
  
  // Hero Slides
  addHeroSlide: (slide: HeroSlide) => Promise<void>;
  deleteHeroSlide: (id: string) => Promise<void>;

  // Stock Logic
  addStock: (productId: string, codes: string[]) => Promise<void>;
  deleteStock: (stockId: string) => Promise<void>;
  
  // CMS
  addBlog: (blog: Blog) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  addAgreement: (agreement: Agreement) => Promise<void>;
  deleteAgreement: (id: string) => Promise<void>;
  
  // Pages Logic
  addPage: (page: Page) => Promise<void>;
  updatePage: (id: string, page: Partial<Page>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;

  addComment: (comment: Omit<Comment, 'id' | 'date' | 'isApproved'>) => Promise<void>;
  toggleCommentApproval: (id: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  
  giveaways: any[];
  joinGiveaway: (id: string) => Promise<void>;
  mysteryBoxes: any[];
  openMysteryBox: (id: string) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// PHP Backend API URL (Change this to your actual PHP server URL in production)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export const AppProvider = ({ children }: { children?: React.ReactNode }) => {
  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Data State (Fetched from PHP Backend)
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stocks, setStocks] = useState<StockCode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ siteName: 'GamePay', currency: 'AZN', contactEmail: '', whatsappNumber: '', footerText: '' });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  // --- API HELPER ---
  const apiCall = async (endpoint: string, method: string = 'GET', body?: any) => {
    const token = localStorage.getItem('token'); // Only storing JWT token in localStorage
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      });
      return await res.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      return { status: 'error', message: 'Serverlə əlaqə qurulmadı.' };
    }
  };

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch public data
      const prodRes = await apiCall('/products');
      if (prodRes.status === 'success') setProducts(prodRes.data || []);
      
      const catRes = await apiCall('/categories');
      if (catRes.status === 'success') setCategories(catRes.data || []);

      const settingsRes = await apiCall('/settings');
      if (settingsRes.status === 'success') setSiteSettings(settingsRes.data || siteSettings);

      const pagesRes = await apiCall('/pages');
      if (pagesRes.status === 'success') setPages(pagesRes.data || []);

      // Check auth and fetch user data
      const token = localStorage.getItem('token');
      if (token) {
        const userRes = await apiCall('/user/me');
        if (userRes.status === 'success') {
            setUser(userRes.data);
            // If admin, fetch admin data
            if (userRes.data.role === 'admin') {
                const adminData = await apiCall('/admin/dashboard');
                if (adminData.status === 'success') {
                    setUsersList(adminData.users || []);
                    setOrders(adminData.orders || []);
                    setStocks(adminData.stocks || []);
                }
            } else {
                // Fetch user specific orders
                const myOrders = await apiCall('/user/orders');
                if (myOrders.status === 'success') setOrders(myOrders.data || []);
            }
        } else {
            localStorage.removeItem('token'); // Invalid token
        }
      }
    };
    fetchInitialData();
  }, []);

  // --- UI ACTIONS ---
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // --- AUTH ACTIONS ---
  const login = async (email: string, pass: string) => {
    const res = await apiCall('/login', 'POST', { email, password: pass });
    if (res.status === 'success') {
      localStorage.setItem('token', res.token);
      setUser(res.user);
      
      // Fetch user specific data after login
      if (res.user.role === 'admin') {
          const adminData = await apiCall('/admin/dashboard');
          if (adminData.status === 'success') {
              setUsersList(adminData.users || []);
              setOrders(adminData.orders || []);
          }
      }
      return true;
    }
    alert(res.message || "Giriş xətası");
    return false;
  };

  const register = async (name: string, email: string, phone: string, pass: string) => {
    const res = await apiCall('/register', 'POST', { name, email, phone, password: pass });
    if (res.status === 'success') {
      alert("Qeydiyyat uğurla tamamlandı! İndi daxil ola bilərsiniz.");
    } else {
      alert(res.message || "Qeydiyyat xətası");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart([]);
    setOrders([]);
  };

  const updateUserProfile = async (data: Partial<User>) => {
      const res = await apiCall('/user/update', 'POST', data);
      if (res.status === 'success') setUser(res.data);
  };

  const changePassword = async (currentPass: string, newPass: string) => {
      const res = await apiCall('/user/password', 'POST', { currentPass, newPass });
      return res.status === 'success';
  };

  const requestPasswordReset = async (phone: string) => {
      const res = await apiCall('/password/reset-request', 'POST', { phone });
      return res.status === 'success';
  };

  const confirmPasswordReset = async (token: string, newPass: string) => {
      const res = await apiCall('/password/reset-confirm', 'POST', { token, newPass });
      return res.status === 'success';
  };

  const generateResetLink = (userId: string) => { return ""; };
  const adminUpdateUserPassword = async (userId: string, newPass: string) => {};
  const toggleUserBan = async (userId: string) => {};
  const toggleWishlist = async (productId: string) => {};

  // --- CART ACTIONS (Local State) ---
  const addToCart = (product: Product, userInput?: string) => {
    const finalPrice = product.price - (product.price * (product.discountPercent / 100));
    setCart(prev => {
        const existingIndex = prev.findIndex(item => item.productId === product.id && item.userInput === userInput);
        if (existingIndex > -1) {
            const newCart = [...prev];
            newCart[existingIndex].quantity += 1;
            return newCart;
        } else {
            return [...prev, {
                productId: product.id,
                title: product.title,
                price: finalPrice,
                image: product.image,
                type: product.type,
                userInput,
                quantity: 1,
                durationDays: product.durationDays,
                isLifetime: product.isLifetime
            }];
        }
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (index: number, delta: number) => {
      setCart(prev => {
          const newCart = [...prev];
          newCart[index].quantity += delta;
          if (newCart[index].quantity <= 0) return prev.filter((_, i) => i !== index);
          return newCart;
      });
  };

  const removeFromCart = (index: number) => setCart(prev => prev.filter((_, i) => i !== index));
  const clearCart = () => setCart([]);

  // --- ORDER ACTIONS ---
  const placeOrder = async (paymentMethodId: string | 'BALANCE', receiptFile?: File, promoDiscount: number = 0) => {
    if (!user || cart.length === 0) return false;
    
    if (paymentMethodId === 'BALANCE') {
        const res = await apiCall('/order/create', 'POST', { cartItems: cart, paymentMethod: 'WALLET' });
        if (res.status === 'success') {
            alert("Sifariş uğurla tamamlandı!");
            clearCart();
            // Refresh user balance
            const userRes = await apiCall('/user/me');
            if (userRes.status === 'success') setUser(userRes.data);
            
            // Refresh orders
            const myOrders = await apiCall('/user/orders');
            if (myOrders.status === 'success') setOrders(myOrders.data || []);
            
            return true;
        } else {
            alert(res.message || "Sifariş xətası");
            return false;
        }
    } else {
        // Handle manual payment with receipt upload
        const formData = new FormData();
        formData.append('paymentMethodId', paymentMethodId);
        formData.append('cartItems', JSON.stringify(cart));
        if (receiptFile) formData.append('receipt', receiptFile);
        
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/order/manual`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert("Sifarişiniz yoxlanışa göndərildi.");
                clearCart();
                return true;
            }
        } catch (e) {
            alert("Xəta baş verdi.");
        }
        return false;
    }
  };

  const placeBalanceOrder = async (amount: number, paymentMethodId: string, receiptFile: File) => { return false; };
  const processOrder = async (orderId: string) => {};
  const completeOrder = async (orderId: string, manualContent?: string) => {};
  const cancelOrder = async (orderId: string) => {};
  const updateUserBalance = async (userId: string, amount: number) => {};

  // --- NOTIFICATIONS ---
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const clearNotifications = () => setNotifications([]);

  // --- ADMIN ACTIONS (Stubs for PHP Backend) ---
  const addProduct = async (product: Product) => {};
  const addProducts = async (newProducts: Product[]) => {};
  const deleteProduct = async (productId: string) => {};
  const togglePopularProduct = async (productId: string) => {};
  const addCategory = async (category: Category) => {};
  const deleteCategory = async (categoryId: string) => {};
  const togglePopularCategory = async (categoryId: string) => {};
  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {};
  const addPaymentMethod = async (method: PaymentMethod) => {};
  const updatePaymentMethod = async (id: string, details: Partial<PaymentMethod>) => {};
  const deletePaymentMethod = async (id: string) => {};
  const addPromoCode = async (promo: PromoCode) => {};
  const deletePromoCode = async (id: string) => {};
  const togglePromoCode = async (id: string) => {};
  const addHeroSlide = async (slide: HeroSlide) => {};
  const deleteHeroSlide = async (id: string) => {};
  const addStock = async (productId: string, codes: string[]) => {};
  const deleteStock = async (stockId: string) => {};
  const addBlog = async (blog: Blog) => {};
  const deleteBlog = async (id: string) => {};
  const addAgreement = async (agreement: Agreement) => {};
  const deleteAgreement = async (id: string) => {};
  const addPage = async (page: Page) => {};
  const updatePage = async (id: string, page: Partial<Page>) => {};
  const deletePage = async (id: string) => {};
  const addComment = async (comment: Omit<Comment, 'id' | 'date' | 'isApproved'>) => {};
  const toggleCommentApproval = async (id: string) => {};
  const deleteComment = async (id: string) => {};

  return (
    <AppContext.Provider value={{ 
      user, usersList, isAuthenticated: !!user,
      products, categories, orders, paymentMethods, promoCodes, siteSettings, cart, notifications,
      stocks, activityLogs,
      blogs, agreements, comments, heroSlides, pages,
      isCartOpen, openCart, closeCart,
      login, register, logout, requestPasswordReset, updateUserProfile, adminUpdateUserPassword, toggleUserBan, generateResetLink, confirmPasswordReset, changePassword,
      addToCart, updateCartQuantity, removeFromCart, clearCart,
      placeOrder, placeBalanceOrder, processOrder, completeOrder, cancelOrder, updateUserBalance, markNotificationRead, clearNotifications,
      addPaymentMethod, updatePaymentMethod, deletePaymentMethod, addPromoCode, deletePromoCode, togglePromoCode,
      addProduct, addProducts, deleteProduct, togglePopularProduct,
      addCategory, deleteCategory, togglePopularCategory,
      updateSiteSettings,
      addBlog, deleteBlog, addAgreement, deleteAgreement, toggleCommentApproval, deleteComment, addComment,
      addPage, updatePage, deletePage,
      addStock, deleteStock, toggleWishlist,
      addHeroSlide, deleteHeroSlide,
      giveaways: [], 
      joinGiveaway: async () => {}, 
      mysteryBoxes: [], 
      openMysteryBox: async () => null
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
