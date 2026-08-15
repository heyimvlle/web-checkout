import type { Product } from '../types';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalProduct: Product;
  recommendedProduct: Product | null;
  onAddOriginalOnly: () => void;
  onAddBoth: () => void;
  isLoading: boolean;
}

export function UpsellModal({
  isOpen,
  onClose,
  originalProduct,
  recommendedProduct,
  onAddOriginalOnly,
  onAddBoth,
  isLoading,
}: UpsellModalProps) {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center active:scale-95 transition-transform"
        >
          &times;
        </button>

        <div className="p-8 pb-4 text-center">
          <h2 className="text-3xl font-bold mb-4">You selected {originalProduct.name}!</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-mcd-red"></div>
            </div>
          ) : recommendedProduct ? (
            <>
              <p className="text-2xl text-gray-700 mb-6">
                Would you like to add <span className="font-bold text-black">{recommendedProduct.name}</span> for {formatPrice(recommendedProduct.price)}?
              </p>
              
              <div className="flex justify-center mb-8">
                <img 
                  src={`/images/${recommendedProduct.image_filename}`} 
                  alt={recommendedProduct.name}
                  className="h-40 object-contain mix-blend-multiply"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button 
                  onClick={onAddOriginalOnly}
                  className="flex-1 py-4 px-6 bg-gray-200 text-gray-800 text-xl font-bold rounded-2xl active:scale-95 transition-transform border-none cursor-pointer"
                >
                  No, thanks
                </button>
                <button 
                  onClick={onAddBoth}
                  className="flex-1 py-4 px-6 bg-mcd-red text-white text-xl font-bold rounded-2xl active:scale-95 transition-transform border-none cursor-pointer"
                >
                  Yes, add both
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col mt-6 h-48 justify-center">
              <button 
                onClick={onAddOriginalOnly}
                className="w-full py-4 px-6 bg-mcd-red text-white text-xl font-bold rounded-2xl active:scale-95 transition-transform border-none cursor-pointer"
              >
                Add to Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
