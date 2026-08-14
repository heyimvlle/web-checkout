import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  return (
    <div 
      onClick={() => addItem(product)}
      className="bg-white rounded-xl md:rounded-2xl shadow-md p-3 md:p-5 flex flex-col items-center cursor-pointer select-none text-center active:scale-95 transition-transform"
    >
      <div className="w-full h-24 md:h-36 bg-gray-100 rounded-lg mb-2 md:mb-4 flex items-center justify-center overflow-hidden">
        {/* Placeholder for image */}
        <span className="text-gray-400 text-xs md:text-base px-2">Image {product.name}</span>
      </div>
      <h3 className="m-0 mb-1 md:mb-2 text-sm md:text-xl font-bold line-clamp-2">{product.name}</h3>
      <p className="m-0 mb-2 md:mb-4 text-gray-500 text-xs md:text-sm flex-1 line-clamp-3">{product.description}</p>
      <div className="text-mcd-green font-bold text-lg md:text-2xl">
        {formatPrice(product.price)}
      </div>
    </div>
  );
}

