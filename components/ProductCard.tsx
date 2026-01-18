import React from 'react';
import { Product, ProductType } from '../types';
import { ShoppingCart, Key, User, Heart, ArrowRight, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../store';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user, toggleWishlist, isAuthenticated, addToCart } = useApp();
  const navigate = useNavigate();
  
  const isLiked = user?.wishlist?.includes(product.id);
  const finalPrice = product.price - (product.price * (product.discountPercent / 100));

  const handleWishlist = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if(!isAuthenticated) {
          navigate('/auth');
          return;
      }
      toggleWishlist(product.id);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (product.requiresInput) {
          navigate(`/product/${product.id}`);
      } else {
          addToCart(product);
      }
  };

  return (
    <Link to={`/product/${product.id}`} className="group relative block h-full">
      <div className="glass-card rounded-3xl overflow-hidden h-full flex flex-col relative group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] transition-all duration-300">
        
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
                <span className="glass px-2 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wide flex items-center gap-1">
                    {product.type === ProductType.LICENSE_KEY ? <Key className="w-3 h-3"/> : <User className="w-3 h-3"/>}
                    {product.type === ProductType.LICENSE_KEY ? 'Key' : 'Acc'}
                </span>
                {product.isLifetime && (
                    <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-black px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 shadow-lg">
                        <Zap className="w-3 h-3 fill-black"/> Ömürlük
                    </span>
                )}
            </div>

            {/* Wishlist Button */}
            <button 
                onClick={handleWishlist}
                className={`absolute top-3 right-3 p-2 rounded-full glass transition-all duration-300 hover:bg-white hover:text-red-500 ${isLiked ? 'bg-white text-red-500' : 'text-gray-300'}`}
            >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
            <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1 leading-tight group-hover:text-primary transition-colors line-clamp-2">{product.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2 mb-4">{product.description}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div>
                     {product.discountPercent > 0 && (
                         <span className="text-xs text-gray-500 line-through block">{product.price.toFixed(2)} ₼</span>
                     )}
                     <div className="text-xl font-bold text-white">{finalPrice.toFixed(2)} <span className="text-primary text-sm">₼</span></div>
                </div>

                <button 
                    onClick={handleQuickAdd}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300 group/btn"
                >
                    {product.requiresInput ? <ArrowRight className="w-5 h-5"/> : <ShoppingCart className="w-4 h-4"/>}
                </button>
            </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;