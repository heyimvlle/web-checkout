import { useState } from 'react';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { api } from '../services/api';
import { UpsellModal } from './UpsellModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const handleProductClick = async () => {
    // 1. Synchronous Category Check
    if (product.category !== 'Burgers') {
      addItem(product);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.get(`/products/${product.id}/recommendations`);
      const recommendation = response.data;
      
      if (!recommendation) {
        addItem(product);
        return;
      }

      // 2. Post-API Existence Check
      const isAlreadyInCart = cartItems.some((item) => item.id === recommendation.id);
      
      if (isAlreadyInCart) {
        addItem(product);
        return;
      }

      // 3. Open Modal only if we have a valid, novel recommendation
      setRecommendedProduct(recommendation);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching recommendation', error);
      setRecommendedProduct(null);
      addItem(product);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOriginalOnly = () => {
    addItem(product);
    setIsModalOpen(false);
  };

  const handleAddBoth = () => {
    addItem(product);
    if (recommendedProduct) {
      addItem(recommendedProduct);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        onClick={isLoading ? undefined : handleProductClick}
        className={`bg-white rounded-xl md:rounded-2xl shadow-md p-3 md:p-5 flex flex-col items-center select-none text-center transition-transform relative ${
          isLoading ? 'opacity-80 cursor-default' : 'cursor-pointer active:scale-95'
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-xl md:rounded-2xl backdrop-blur-[1px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-mcd-red"></div>
          </div>
        )}
        
        <div className="w-full h-24 md:h-36 bg-white rounded-lg mb-2 md:mb-4 flex items-center justify-center overflow-hidden">
          <img 
            src={`/images/${product.image_filename}`} 
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply"
            draggable={false}
          />
        </div>
        <h3 className="m-0 mb-1 md:mb-2 text-sm md:text-xl font-bold line-clamp-2">{product.name}</h3>
        <p className="m-0 mb-2 md:mb-4 text-gray-500 text-xs md:text-sm flex-1 line-clamp-3">{product.description}</p>
        <div className="text-mcd-green font-bold text-lg md:text-2xl">
          {formatPrice(product.price)}
        </div>
      </div>

      <UpsellModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        originalProduct={product}
        recommendedProduct={recommendedProduct}
        onAddOriginalOnly={handleAddOriginalOnly}
        onAddBoth={handleAddBoth}
        isLoading={false}
      />
    </>
  );
}
