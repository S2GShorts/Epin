
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import { Order, OrderStatus, ProductType, Product, PromoCode, PaymentMethod, Blog, Agreement, HeroSlide, Page } from '../types';
import { 
  BarChart3, ShoppingBag, Package, Users, Settings, LogOut, 
  Plus, Trash2, Search, Edit3, X, Check, Eye, Wallet, 
  Database, Infinity, Menu, FileText, MessageSquare, CreditCard, Globe, Shield, Image as ImageIcon, Save, Star, Layout, Link as LinkIcon, Info, Tag, Upload, Monitor, File, Gift
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- REUSABLE IMAGE INPUT COMPONENT ---
const ImageInput = ({ label, value, onChange, placeholder = "Şəkil" }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) => {
    const [mode, setMode] = useState<'url' | 'upload'>('url');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            onChange(url);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-gray-400">{label}</label>
            
            <div className="flex bg-surfaceHighlight rounded-t-xl overflow-hidden border border-white/10 border-b-0">
                <button 
                    onClick={() => setMode('url')} 
                    className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'url' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <LinkIcon className="w-3 h-3" /> Link (URL)
                </button>
                <button 
                    onClick={() => setMode('upload')} 
                    className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'upload' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Monitor className="w-3 h-3" /> PC-dən Yüklə
                </button>
            </div>

            <div className="relative">
                {mode === 'url' ? (
                    <div className="relative">
                        <input 
                            className="w-full bg-surfaceHighlight border border-white/10 rounded-b-xl p-3 text-white focus:border-primary outline-none text-sm" 
                            placeholder="https://example.com/image.jpg" 
                            value={value.startsWith('blob:') ? '' : value} 
                            onChange={e => onChange(e.target.value)} 
                        />
                        {value && !value.startsWith('blob:') && (
                            <div className="absolute right-3 top-3 w-6 h-6 rounded overflow-hidden border border-white/20">
                                <img src={value} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div 
                        onClick={() => fileRef.current?.click()}
                        className="w-full bg-surfaceHighlight border-2 border-dashed border-white/10 rounded-b-xl h-24 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors group relative overflow-hidden"
                    >
                        {value ? (
                            <img src={value} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                        ) : null}
                        <div className="relative z-10 flex flex-col items-center">
                            <Upload className="w-5 h-5 text-gray-400 group-hover:text-white mb-1" />
                            <span className="text-xs text-gray-500 group-hover:text-white font-bold">Şəkil Seçmək üçün Toxun</span>
                        </div>
                        <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleUpload} />
                    </div>
                )}
            </div>
            
            {value && (
                <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Şəkil seçildi
                </div>
            )}
        </div>
    );
};

const Admin = () => {
  const navigate = useNavigate();
  const { 
    user, orders, completeOrder, cancelOrder, products, 
    siteSettings, updateSiteSettings,
    categories, addCategory, deleteCategory, togglePopularCategory,
    addProduct, deleteProduct, togglePopularProduct,
    addAgreement, deleteAgreement,
    blogs, addBlog, deleteBlog,
    paymentMethods, addPaymentMethod, deletePaymentMethod, updatePaymentMethod,
    comments, deleteComment, logout,
    usersList, toggleUserBan, updateUserBalance,
    promoCodes, addPromoCode, deletePromoCode,
    stocks, addStock, deleteStock, activityLogs,
    heroSlides, addHeroSlide, deleteHeroSlide,
    pages, addPage, updatePage, deletePage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'categories' | 'stock' | 'users' | 'content' | 'pages' | 'finance' | 'settings'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // --- STATE MANAGEMENT ---
  
  // Orders
  const [deliveryModal, setDeliveryModal] = useState<{orderId: string, productTitle: string} | null>(null);
  const [deliveryContent, setDeliveryContent] = useState('');
  const [orderFilter, setOrderFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Products
  const [productView, setProductView] = useState<'list' | 'add'>('list');
  const [productSearch, setProductSearch] = useState('');
  const [isEditingProd, setIsEditingProd] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: '', categoryId: '', subCategory: '', price: 0, costPrice: 0, discountPercent: 0, type: ProductType.LICENSE_KEY, image: '', description: '', requiresInput: false, durationDays: 0, isLifetime: false, isPopular: false
  });

  // Categories
  const [catForm, setCatForm] = useState<{name: string, image: string, subCategoriesInput: string}>({ name: '', image: '', subCategoriesInput: '' });

  // Stock
  const [stockProduct, setStockProduct] = useState('');
  const [stockInput, setStockInput] = useState('');

  // Users
  const [userSearch, setUserSearch] = useState('');

  // Pages
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [pageForm, setPageForm] = useState<Partial<Page>>({ title: '', slug: '', content: '', category: 'corporate', isActive: true });

  // Settings
  const [generalForm, setGeneralForm] = useState(siteSettings);
  const [slideForm, setSlideForm] = useState<Partial<HeroSlide>>({ image: '', title: '', subtitle: '', desc: '', btnText: 'İndi Al', link: '/' });

  if (!user || user.role !== 'admin') {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-red-500 font-bold text-2xl">
            Access Denied
        </div>
    );
  }

  // --- HELPERS ---
  
  const handleLogout = () => { logout(); navigate('/'); };

  const handleDelete = (type: string, id: string) => {
      if(window.confirm(`Silmək istədiyinizə əminsiniz?`)) {
          switch(type) {
              case 'product': deleteProduct(id); break;
              case 'category': deleteCategory(id); break;
              case 'promo': deletePromoCode(id); break;
              case 'comment': deleteComment(id); break;
              case 'stock': deleteStock(id); break;
              case 'blog': deleteBlog(id); break;
              case 'rule': deleteAgreement(id); break;
              case 'payment': deletePaymentMethod(id); break;
              case 'slide': deleteHeroSlide(id); break;
              case 'page': deletePage(id); break;
          }
      }
  };

  // Category Logic
  const handleSaveCategory = () => {
      if(!catForm.name) return;
      const subCats = catForm.subCategoriesInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
      addCategory({
          id: `cat-${Date.now()}`,
          name: catForm.name,
          image: catForm.image,
          subCategories: subCats,
          isPopular: false
      });
      setCatForm({ name: '', image: '', subCategoriesInput: '' });
      alert("Kateqoriya əlavə edildi.");
  };

  // Product Logic
  const handleEditProduct = (p: Product) => {
      setProductForm(p);
      setIsEditingProd(true);
      setProductView('add');
  };

  const handleSaveProduct = () => {
      if(!productForm.title || !productForm.price || !productForm.categoryId) {
          alert("Zəhmət olmasa vacib xanaları doldurun.");
          return;
      }
      const newProduct = { ...productForm, id: isEditingProd ? productForm.id! : `p-${Date.now()}` } as Product;
      if(isEditingProd) deleteProduct(productForm.id!);
      addProduct(newProduct);
      setProductView('list');
      setProductForm({ title: '', categoryId: '', subCategory: '', price: 0, costPrice: 0, discountPercent: 0, type: ProductType.LICENSE_KEY, image: '', description: '', requiresInput: false, durationDays: 0, isLifetime: false, isPopular: false });
      setIsEditingProd(false);
  };

  // Page Logic
  const handleSavePage = () => {
      if(!pageForm.title || !pageForm.content) return;
      const slug = pageForm.slug || pageForm.title!.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      const newPage: Page = {
          id: pageForm.id || `pg-${Date.now()}`,
          title: pageForm.title!,
          slug: slug,
          content: pageForm.content!,
          category: pageForm.category || 'corporate',
          isActive: pageForm.isActive ?? true
      };

      if (isEditingPage && pageForm.id) {
          updatePage(pageForm.id, newPage);
      } else {
          addPage(newPage);
      }
      setPageForm({ title: '', slug: '', content: '', category: 'corporate', isActive: true });
      setIsEditingPage(false);
  };

  const handleEditPage = (page: Page) => {
      setPageForm(page);
      setIsEditingPage(true);
  };

  // Stock Logic
  const handleAddStock = () => {
      if(!stockProduct || !stockInput) return;
      const codes = stockInput.split('\n').filter(c => c.trim().length > 0);
      addStock(stockProduct, codes);
      setStockInput('');
      alert(`${codes.length} ədəd kod əlavə olundu.`);
  };

  // Order Logic
  const confirmDelivery = () => {
      if(deliveryModal) {
          completeOrder(deliveryModal.orderId, deliveryContent);
          setDeliveryModal(null);
          setDeliveryContent('');
      }
  };

  // Settings Logic
  const saveGeneralSettings = () => {
      updateSiteSettings(generalForm);
      alert("Ayarlar yadda saxlanıldı!");
  };

  const handleSaveSlide = () => {
      if(!slideForm.image || !slideForm.title) return;
      addHeroSlide({ ...slideForm, id: `slide-${Date.now()}` } as HeroSlide);
      setSlideForm({ image: '', title: '', subtitle: '', desc: '', btnText: 'İndi Al', link: '/' });
  };

  // Menu Items
  const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'orders', label: 'Sifarişlər', icon: ShoppingBag, badge: orders.filter(o => o.status === 'PENDING').length },
      { id: 'categories', label: 'Kateqoriyalar', icon: Layout },
      { id: 'products', label: 'Məhsullar', icon: Package },
      { id: 'stock', label: 'Stok', icon: Database },
      { id: 'pages', label: 'Səhifələr (CMS)', icon: File },
      { id: 'content', label: 'Məzmun & Finans', icon: FileText },
      { id: 'users', label: 'İstifadəçilər', icon: Users },
      { id: 'settings', label: 'Ayarlar & Dizayn', icon: Settings },
  ];

  const filteredOrders = orders.filter(o => orderFilter === 'ALL' || o.status === orderFilter);

  // Get Subcategories for product form
  const selectedCatSubCats = categories.find(c => c.id === productForm.categoryId)?.subCategories || [];

  return (
    <div className="min-h-screen bg-background text-white flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass border-r border-white/10 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}>
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <span className="text-xl font-black text-white tracking-widest uppercase">Admin</span>
              <button onClick={() => setMobileMenuOpen(false)} className="md:hidden"><X /></button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map(item => (
                  <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                      <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge ? <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span> : null}
                  </button>
              ))}
          </nav>

          <div className="p-4 border-t border-white/10">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold">
                  <LogOut className="w-5 h-5" /> Çıxış
              </button>
          </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="md:hidden glass border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-40">
          <span className="font-bold text-lg">Admin Panel</span>
          <button onClick={() => setMobileMenuOpen(true)}><Menu /></button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto bg-background">
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                              <ShoppingBag className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-gray-400 text-sm font-bold">Ümumi Sifariş</p>
                              <h3 className="text-2xl font-black text-white">{orders.length}</h3>
                          </div>
                      </div>
                      <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500">
                              <Wallet className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-gray-400 text-sm font-bold">Ümumi Gəlir</p>
                              <h3 className="text-2xl font-black text-white">{orders.filter(o => o.status === 'COMPLETED').reduce((acc, o) => acc + o.totalPrice, 0).toFixed(2)} ₼</h3>
                          </div>
                      </div>
                      <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                              <Users className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-gray-400 text-sm font-bold">İstifadəçilər</p>
                              <h3 className="text-2xl font-black text-white">{usersList.length}</h3>
                          </div>
                      </div>
                      <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                              <Package className="w-6 h-6" />
                          </div>
                          <div>
                              <p className="text-gray-400 text-sm font-bold">Məhsullar</p>
                              <h3 className="text-2xl font-black text-white">{products.length}</h3>
                          </div>
                      </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="glass-card p-6 rounded-2xl border border-white/10">
                      <h3 className="text-xl font-bold mb-4">Son Fəaliyyətlər</h3>
                      <div className="space-y-4">
                          {activityLogs.slice(0, 5).map(log => (
                              <div key={log.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  <div className="flex-1">
                                      <p className="text-sm text-white">{log.action}</p>
                                      <p className="text-xs text-gray-500">{new Date(log.date).toLocaleString()}</p>
                                  </div>
                              </div>
                          ))}
                          {activityLogs.length === 0 && <p className="text-gray-500 text-sm">Fəaliyyət yoxdur.</p>}
                      </div>
                  </div>
              </div>
          )}

          {/* CONTENT & FINANCE */}
          {activeTab === 'content' && (
              <div className="space-y-8 animate-fade-in">
                  <h2 className="text-3xl font-bold mb-6">Məzmun və Finans</h2>
                  
                  {/* Promo Codes */}
                  <div className="glass-card p-6 rounded-2xl border border-white/10">
                      <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Promo Kodlar</h3>
                      <div className="flex gap-4 mb-4">
                          <button 
                              onClick={() => {
                                  const code = prompt("Promo kod adı:");
                                  const percent = prompt("Endirim faizi (%):");
                                  if(code && percent && !isNaN(parseInt(percent))) {
                                      addPromoCode({ id: `promo-${Date.now()}`, code: code.toUpperCase(), discountPercent: parseInt(percent), isActive: true });
                                  }
                              }}
                              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
                          >
                              <Plus className="w-4 h-4" /> Yeni Promo Kod
                          </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {promoCodes.map(promo => (
                              <div key={promo.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                                  <div>
                                      <p className="font-mono font-bold text-lg text-primary">{promo.code}</p>
                                      <p className="text-xs text-gray-400">Endirim: {promo.discountPercent}%</p>
                                  </div>
                                  <button onClick={() => handleDelete('promo', promo.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="glass-card p-6 rounded-2xl border border-white/10">
                      <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Ödəniş Metodları</h3>
                      <div className="flex gap-4 mb-4">
                          <button 
                              onClick={() => {
                                  const name = prompt("Metod adı (Məs: M10):");
                                  const details = prompt("Hesab nömrəsi:");
                                  const instructions = prompt("Təlimat:");
                                  if(name && details) {
                                      addPaymentMethod({ id: `pm-${Date.now()}`, name, details, instructions: instructions || '', isActive: true });
                                  }
                              }}
                              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
                          >
                              <Plus className="w-4 h-4" /> Yeni Metod
                          </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {paymentMethods.map(pm => (
                              <div key={pm.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                                  <div>
                                      <p className="font-bold text-white">{pm.name}</p>
                                      <p className="font-mono text-sm text-gray-400">{pm.details}</p>
                                      <p className="text-xs text-gray-500 mt-1">{pm.instructions}</p>
                                  </div>
                                  <button onClick={() => handleDelete('payment', pm.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Blogs / News */}
                  <div className="glass-card p-6 rounded-2xl border border-white/10">
                      <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2">Xəbərlər & Bloq</h3>
                      <div className="flex gap-4 mb-4">
                          <button 
                              onClick={() => {
                                  const title = prompt("Başlıq:");
                                  const content = prompt("Məzmun:");
                                  const image = prompt("Şəkil URL:");
                                  if(title && content) {
                                      addBlog({ id: `blog-${Date.now()}`, title, content, image: image || '', date: new Date().toISOString(), author: 'Admin' });
                                  }
                              }}
                              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
                          >
                              <Plus className="w-4 h-4" /> Yeni Xəbər
                          </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {blogs.map(blog => (
                              <div key={blog.id} className="bg-white/5 p-4 rounded-xl border border-white/10 flex gap-4 items-center">
                                  {blog.image && <img src={blog.image} className="w-16 h-16 rounded-lg object-cover" />}
                                  <div className="flex-1">
                                      <p className="font-bold text-white line-clamp-1">{blog.title}</p>
                                      <p className="text-xs text-gray-500">{new Date(blog.date).toLocaleDateString()}</p>
                                  </div>
                                  <button onClick={() => handleDelete('blog', blog.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* USERS */}
          {activeTab === 'users' && (
              <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold">İstifadəçilər</h2>
                      <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                          <input 
                              type="text" 
                              placeholder="İstifadəçi axtar..." 
                              className="bg-surfaceHighlight border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-primary outline-none"
                              value={userSearch}
                              onChange={(e) => setUserSearch(e.target.value)}
                          />
                      </div>
                  </div>

                  <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-gray-400">
                              <thead className="text-xs uppercase bg-white/5 text-gray-300">
                                  <tr>
                                      <th className="p-4">İstifadəçi</th>
                                      <th className="p-4">Email</th>
                                      <th className="p-4">Balans</th>
                                      <th className="p-4">Rol</th>
                                      <th className="p-4">Status</th>
                                      <th className="p-4 text-right">Əməliyyat</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {usersList.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                          <td className="p-4 flex items-center gap-3">
                                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">
                                                  {u.avatar ? <img src={u.avatar} className="w-full h-full rounded-full object-cover" /> : u.name.charAt(0).toUpperCase()}
                                              </div>
                                              <span className="font-bold text-white">{u.name}</span>
                                          </td>
                                          <td className="p-4">{u.email}</td>
                                          <td className="p-4 font-mono text-primary font-bold">{u.balance.toFixed(2)} ₼</td>
                                          <td className="p-4">
                                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                  {u.role}
                                              </span>
                                          </td>
                                          <td className="p-4">
                                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.isBanned ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                  {u.isBanned ? 'Banlı' : 'Aktiv'}
                                              </span>
                                          </td>
                                          <td className="p-4 text-right flex justify-end gap-2">
                                              <button 
                                                  onClick={() => {
                                                      const amount = prompt("Yeni balansı daxil edin:", u.balance.toString());
                                                      if(amount !== null && !isNaN(parseFloat(amount))) {
                                                          updateUserBalance(u.id, parseFloat(amount));
                                                      }
                                                  }}
                                                  className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
                                                  title="Balansı Dəyiş"
                                              >
                                                  <Wallet className="w-4 h-4" />
                                              </button>
                                              <button 
                                                  onClick={() => toggleUserBan(u.id)}
                                                  className={`p-2 rounded-lg transition-colors ${u.isBanned ? 'bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white'}`}
                                                  title={u.isBanned ? 'Banı Qaldır' : 'Ban Et'}
                                              >
                                                  <Shield className="w-4 h-4" />
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-3xl font-bold mb-4">Sifariş İdarəçiliyi</h2>
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      {['ALL', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map(status => (
                          <button 
                              key={status} 
                              onClick={() => setOrderFilter(status as any)}
                              className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${orderFilter === status ? 'bg-primary text-white border-primary' : 'bg-transparent border-white/20 text-gray-400 hover:text-white'}`}
                          >
                              {status}
                          </button>
                      ))}
                  </div>

                  <div className="space-y-4">
                      {filteredOrders.length === 0 ? <p className="text-gray-500 text-center py-10">Sifariş tapılmadı.</p> : filteredOrders.map(order => (
                          <div key={order.id} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                              <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                      <h3 className="font-bold text-white text-lg">{order.productTitle}</h3>
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                          order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 
                                          order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                                      }`}>{order.status}</span>
                                  </div>
                                  <div className="text-sm text-gray-400 space-y-1">
                                      <p>İstifadəçi: <span className="text-white">{usersList.find(u => u.id === order.userId)?.email}</span></p>
                                      <p>Məbləğ: <span className="text-gaming-neon font-bold">{order.totalPrice.toFixed(2)} ₼</span></p>
                                      <p>Tarix: {new Date(order.date).toLocaleString()}</p>
                                      {order.paymentMethodName !== 'Wallet Balance' && (
                                          <p className="flex items-center gap-2">
                                              Ödəniş: {order.paymentMethodName} 
                                              {order.receiptImage && (
                                                  <a href={order.receiptImage} target="_blank" className="text-primary hover:underline flex items-center gap-1 text-xs">
                                                      <Eye className="w-3 h-3"/> Qəbzi Gör
                                                  </a>
                                              )}
                                          </p>
                                      )}
                                      {order.items.some(i => i.userInput) && (
                                          <p className="bg-white/5 p-2 rounded mt-2 border border-white/10">Input: {order.items[0].userInput}</p>
                                      )}
                                  </div>
                              </div>
                              <div className="flex flex-col gap-2 min-w-[150px]">
                                  {order.status === 'PENDING' && (
                                      <>
                                          <button 
                                              onClick={() => setDeliveryModal({orderId: order.id, productTitle: order.productTitle || 'Order'})}
                                              className="bg-green-600 hover:bg-green-500 text-white py-2 rounded font-bold transition-colors"
                                          >
                                              Təsdiq & Təhvil
                                          </button>
                                          <button 
                                              onClick={() => cancelOrder(order.id)}
                                              className="bg-red-600 hover:bg-red-500 text-white py-2 rounded font-bold transition-colors"
                                          >
                                              Ləğv Et
                                          </button>
                                      </>
                                  )}
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Delivery Modal */}
                  {deliveryModal && (
                      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
                          <div className="bg-[#1a1d24] rounded-2xl p-6 w-full max-w-md border border-white/10">
                              <h3 className="text-xl font-bold text-white mb-4">Sifarişi Təhvil Ver: {deliveryModal.productTitle}</h3>
                              <textarea 
                                  className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white h-32 mb-4"
                                  placeholder="Məhsul kodunu və ya hesab məlumatlarını bura yazın..."
                                  value={deliveryContent}
                                  onChange={e => setDeliveryContent(e.target.value)}
                              ></textarea>
                              <div className="flex justify-end gap-3">
                                  <button onClick={() => setDeliveryModal(null)} className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20">Ləğv</button>
                                  <button onClick={confirmDelivery} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark">Təsdiq & Bitir</button>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          )}

          {/* CATEGORIES */}
          {activeTab === 'categories' && (
              <div className="space-y-6 animate-fade-in">
                  <div className="glass-card p-6 rounded-2xl border border-white/10 mb-8">
                      <h3 className="font-bold mb-4 text-lg">Yeni Kateqoriya</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input className="bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Kateqoriya Adı (Məs: PUBG Mobile)" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} />
                          <ImageInput label="Şəkil" value={catForm.image} onChange={val => setCatForm({...catForm, image: val})} />
                          <div className="md:col-span-2">
                              <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Alt Kateqoriyalar (Vergüllə ayırın)</label>
                              <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" placeholder="Məs: UC, Account, Redeem Code" value={catForm.subCategoriesInput} onChange={e => setCatForm({...catForm, subCategoriesInput: e.target.value})} />
                          </div>
                          <button onClick={handleSaveCategory} className="md:col-span-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors">Əlavə Et</button>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categories.map(cat => (
                          <div key={cat.id} className="bg-surfaceHighlight border border-white/10 rounded-xl p-4 flex gap-4 items-center group">
                              <img src={cat.image} className="w-16 h-16 rounded-lg object-cover" />
                              <div className="flex-1">
                                  <h4 className="font-bold text-white">{cat.name}</h4>
                                  <p className="text-xs text-gray-500 line-clamp-1">{cat.subCategories?.join(', ')}</p>
                              </div>
                              <div className="flex flex-col gap-2">
                                   <button onClick={() => togglePopularCategory(cat.id)} className={`p-1.5 rounded ${cat.isPopular ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-500 bg-white/5'}`}><Star className="w-4 h-4" /></button>
                                   <button onClick={() => handleDelete('category', cat.id)} className="p-1.5 rounded text-red-400 bg-red-400/10 hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* PRODUCTS */}
          {activeTab === 'products' && (
              <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center">
                      <h2 className="text-3xl font-bold">Məhsullar</h2>
                      <div className="flex gap-2">
                           <button onClick={() => setProductView('list')} className={`px-4 py-2 rounded-xl font-bold ${productView === 'list' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>Siyahı</button>
                           <button onClick={() => { setIsEditingProd(false); setProductView('add'); setProductForm({ title: '', categoryId: '', subCategory: '', price: 0, costPrice: 0, discountPercent: 0, type: ProductType.LICENSE_KEY, image: '', description: '', requiresInput: false, durationDays: 0, isLifetime: false, isPopular: false }); }} className={`px-4 py-2 rounded-xl font-bold ${productView === 'add' ? 'bg-primary text-white' : 'bg-white/10 text-white'}`}>Yeni Məhsul</button>
                      </div>
                  </div>

                  {productView === 'add' ? (
                      <div className="glass-card p-6 rounded-2xl border border-white/10 max-w-3xl mx-auto">
                          <h3 className="font-bold text-xl mb-6 border-b border-white/10 pb-4">{isEditingProd ? 'Redaktə Et' : 'Yeni Məhsul Əlavə Et'}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="md:col-span-2">
                                  <label className="label">Məhsul Adı</label>
                                  <input className="input" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} />
                              </div>
                              <div>
                                  <label className="label">Kateqoriya</label>
                                  <select className="input" value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value, subCategory: ''})}>
                                      <option value="">Seçin</option>
                                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="label">Alt Kateqoriya</label>
                                  <select className="input" value={productForm.subCategory} onChange={e => setProductForm({...productForm, subCategory: e.target.value})} disabled={!selectedCatSubCats.length}>
                                      <option value="">Seçin</option>
                                      {selectedCatSubCats.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="label">Satış Qiyməti (AZN)</label>
                                  <input type="number" className="input" value={productForm.price} onChange={e => setProductForm({...productForm, price: parseFloat(e.target.value)})} />
                              </div>
                              <div>
                                  <label className="label">Maya Dəyəri (AZN)</label>
                                  <input type="number" className="input" value={productForm.costPrice} onChange={e => setProductForm({...productForm, costPrice: parseFloat(e.target.value)})} />
                              </div>
                              <div>
                                  <label className="label">Endirim (%)</label>
                                  <input type="number" className="input" value={productForm.discountPercent} onChange={e => setProductForm({...productForm, discountPercent: parseFloat(e.target.value)})} />
                              </div>
                              <div>
                                  <label className="label">Növ</label>
                                  <select className="input" value={productForm.type} onChange={e => setProductForm({...productForm, type: e.target.value as any})}>
                                      <option value={ProductType.LICENSE_KEY}>License Key</option>
                                      <option value={ProductType.ID_LOAD}>ID Yükləmə</option>
                                      <option value={ProductType.ACCOUNT}>Account</option>
                                  </select>
                              </div>
                              <div className="md:col-span-2">
                                  <ImageInput label="Şəkil" value={productForm.image || ''} onChange={val => setProductForm({...productForm, image: val})} />
                              </div>
                              <div className="md:col-span-2">
                                  <label className="label">Təsvir</label>
                                  <textarea className="input h-24" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}></textarea>
                              </div>
                              
                              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                                  <input type="checkbox" className="w-5 h-5 accent-primary" checked={productForm.requiresInput} onChange={e => setProductForm({...productForm, requiresInput: e.target.checked})} />
                                  <label className="text-sm font-bold text-gray-300">İstifadəçi girişi tələb olunur (Məs: ID)</label>
                              </div>
                              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                                  <input type="checkbox" className="w-5 h-5 accent-primary" checked={productForm.isPopular} onChange={e => setProductForm({...productForm, isPopular: e.target.checked})} />
                                  <label className="text-sm font-bold text-gray-300">Populyar Məhsul</label>
                              </div>

                              <button onClick={handleSaveProduct} className="md:col-span-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors">Yadda Saxla</button>
                          </div>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {products.map(p => (
                              <div key={p.id} className="bg-surfaceHighlight border border-white/10 rounded-xl p-4 flex gap-4 group">
                                  <img src={p.image} className="w-20 h-20 rounded-lg object-cover bg-black/50" />
                                  <div className="flex-1">
                                      <h4 className="font-bold text-white line-clamp-1">{p.title}</h4>
                                      <p className="text-xs text-gray-400">{categories.find(c=>c.id===p.categoryId)?.name}</p>
                                      <p className="text-primary font-bold mt-1">{p.price.toFixed(2)} ₼</p>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                      <button onClick={() => handleEditProduct(p)} className="p-2 bg-white/10 hover:bg-white hover:text-black rounded"><Edit3 className="w-4 h-4"/></button>
                                      <button onClick={() => handleDelete('product', p.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded"><Trash2 className="w-4 h-4"/></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          )}

          {/* PAGES (CMS) */}
          {activeTab === 'pages' && (
              <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold">Səhifə İdarəçiliyi (CMS)</h3>
                      <button onClick={() => { setIsEditingPage(false); setPageForm({ title: '', slug: '', content: '', category: 'corporate', isActive: true }); }} className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                          <Plus className="w-4 h-4"/> Yeni Səhifə
                      </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Form */}
                      <div className="lg:col-span-1 glass-card p-6 rounded-2xl border border-white/10 h-fit sticky top-4">
                          <h4 className="font-bold mb-4 text-primary">{isEditingPage ? 'Redaktə Et' : 'Yeni Səhifə Yarat'}</h4>
                          <div className="space-y-4">
                              <div>
                                  <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Başlıq</label>
                                  <input className="input" value={pageForm.title} onChange={e => setPageForm({...pageForm, title: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Slug (URL)</label>
                                  <input className="input text-sm font-mono" placeholder="Auto-generated" value={pageForm.slug} onChange={e => setPageForm({...pageForm, slug: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Kateqoriya</label>
                                  <select className="input" value={pageForm.category} onChange={e => setPageForm({...pageForm, category: e.target.value as any})}>
                                      <option value="corporate">Haqqımızda / Korporativ</option>
                                      <option value="agreement">Sözləşmə / Qayda</option>
                                      <option value="help">Kömək / Üzvlük</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Məzmun (HTML/Text)</label>
                                  <textarea className="input h-64 font-mono text-sm" value={pageForm.content} onChange={e => setPageForm({...pageForm, content: e.target.value})}></textarea>
                              </div>
                              <button onClick={handleSavePage} className="w-full bg-primary hover:bg-primary-dark font-bold py-3 rounded-xl text-white transition-colors">Yadda Saxla</button>
                          </div>
                      </div>

                      {/* List */}
                      <div className="lg:col-span-2 space-y-4">
                          {pages.length === 0 ? <p className="text-gray-500 text-center py-10">Səhifə yoxdur.</p> : pages.map(page => (
                              <div key={page.id} className="glass-card p-5 rounded-xl border border-white/10 flex justify-between items-center group hover:border-primary/30 transition-all">
                                  <div>
                                      <h5 className="font-bold text-white text-lg">{page.title}</h5>
                                      <div className="flex gap-3 text-xs mt-1">
                                          <span className="bg-white/10 px-2 py-0.5 rounded text-gray-300 font-mono">/{page.slug}</span>
                                          <span className="text-gray-500 uppercase font-bold">{page.category}</span>
                                      </div>
                                  </div>
                                  <div className="flex gap-2">
                                      <button onClick={() => handleEditPage(page)} className="p-2 bg-white/10 hover:bg-white hover:text-black rounded-lg transition-colors"><Edit3 className="w-4 h-4"/></button>
                                      <button onClick={() => handleDelete('page', page.id)} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* STOCK */}
          {activeTab === 'stock' && (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-3xl font-bold mb-4">Stok İdarəçiliyi</h2>
                  <div className="glass-card p-6 rounded-2xl border border-white/10 mb-8">
                       <h3 className="font-bold mb-4">Kod Yüklə</h3>
                       <div className="space-y-4">
                           <select className="input" value={stockProduct} onChange={e => setStockProduct(e.target.value)}>
                               <option value="">Məhsul Seçin</option>
                               {products.filter(p => p.type !== ProductType.BALANCE).map(p => (
                                   <option key={p.id} value={p.id}>{p.title}</option>
                               ))}
                           </select>
                           <textarea className="input h-32 font-mono" placeholder="Hər sətrə bir kod..." value={stockInput} onChange={e => setStockInput(e.target.value)}></textarea>
                           <button onClick={handleAddStock} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl">Yüklə</button>
                       </div>
                  </div>
                  
                  <div className="glass-card p-6 rounded-2xl border border-white/10">
                      <h3 className="font-bold mb-4">Mövcud Stoklar</h3>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-gray-400">
                              <thead className="text-xs uppercase bg-white/5 text-gray-300">
                                  <tr>
                                      <th className="p-3">Məhsul</th>
                                      <th className="p-3">Kod</th>
                                      <th className="p-3">Status</th>
                                      <th className="p-3">Əməliyyat</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {stocks.map(stock => (
                                      <tr key={stock.id} className="border-b border-white/5 hover:bg-white/5">
                                          <td className="p-3 text-white font-bold">{products.find(p=>p.id===stock.productId)?.title}</td>
                                          <td className="p-3 font-mono">{stock.code}</td>
                                          <td className="p-3">{stock.isUsed ? <span className="text-red-500">İstifadə edilib</span> : <span className="text-green-500">Aktiv</span>}</td>
                                          <td className="p-3">
                                              <button onClick={() => handleDelete('stock', stock.id)} className="text-red-400 hover:text-white"><Trash2 className="w-4 h-4"/></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
              <div className="space-y-8 animate-fade-in">
                  <div className="glass-card p-6 rounded-2xl border border-white/10">
                      <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-2">Ümumi Ayarlar</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div><label className="label">Sayt Adı</label><input className="input" value={generalForm.siteName} onChange={e => setGeneralForm({...generalForm, siteName: e.target.value})} /></div>
                           <div><label className="label">Whatsapp Nömrəsi</label><input className="input" value={generalForm.whatsappNumber} onChange={e => setGeneralForm({...generalForm, whatsappNumber: e.target.value})} /></div>
                           <div><label className="label">Footer Mətni</label><input className="input" value={generalForm.footerText} onChange={e => setGeneralForm({...generalForm, footerText: e.target.value})} /></div>
                           <button onClick={saveGeneralSettings} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl">Yadda Saxla</button>
                      </div>
                  </div>

                  <div className="glass-card p-6 rounded-2xl border border-white/10">
                      <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-2">Hero Slider (Ana Səhifə)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                           <ImageInput label="Banner Şəkli" value={slideForm.image || ''} onChange={val => setSlideForm({...slideForm, image: val})} />
                           <div className="space-y-4">
                               <input className="input" placeholder="Başlıq (Title)" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} />
                               <input className="input" placeholder="Alt Başlıq (Subtitle)" value={slideForm.subtitle} onChange={e => setSlideForm({...slideForm, subtitle: e.target.value})} />
                               <input className="input" placeholder="Təsvir" value={slideForm.desc} onChange={e => setSlideForm({...slideForm, desc: e.target.value})} />
                               <button onClick={handleSaveSlide} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-xl w-full">Slayd Əlavə Et</button>
                           </div>
                      </div>
                      <div className="space-y-2">
                           {heroSlides.map(slide => (
                               <div key={slide.id} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
                                   <img src={slide.image} className="w-16 h-10 object-cover rounded" />
                                   <div className="flex-1"><h4 className="font-bold text-white text-sm">{slide.title}</h4></div>
                                   <button onClick={() => handleDelete('slide', slide.id)} className="text-red-400 hover:text-white"><Trash2 className="w-4 h-4"/></button>
                               </div>
                           ))}
                      </div>
                  </div>
              </div>
          )}

      </div>

      <style>{`
        .input { @apply w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none transition-all; }
        .label { @apply text-xs text-gray-400 uppercase font-bold mb-1 block; }
      `}</style>
    </div>
  );
};

export default Admin;
