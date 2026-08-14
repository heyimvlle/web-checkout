import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div 
      onClick={() => addItem(product)}
      className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center cursor-pointer select-none text-center active:scale-95 transition-transform"
    >
      <div className="w-full h-36 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
        {/* Placeholder for image */}
        <span className="text-gray-400">Imagem {product.name}</span>
      </div>
      <h3 className="m-0 mb-2 text-xl font-bold">{product.name}</h3>
      <p className="m-0 mb-4 text-gray-500 text-sm flex-1">{product.description}</p>
      <div className="text-mcd-green font-bold text-2xl">
        {formatPrice(product.price)}
      </div>
    </div>
  );
}

