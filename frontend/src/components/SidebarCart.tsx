import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus } from 'lucide-react';

export function SidebarCart() {
  const { 
    items, 
    incrementQuantity, 
    decrementQuantity, 
    removeItem, 
    getTotalPrice, 
    getTotalItems 
  } = useCartStore();
  
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout');
    }
  };

  return (
    <div className="w-[30%] sm:w-[35%] md:w-[300px] lg:w-[350px] min-w-[120px] bg-mcd-gray flex flex-col h-full border-l-2 border-mcd-border shrink-0">
      <div className="p-3 md:p-5 border-b border-gray-300">
        <h2 className="m-0 text-base md:text-2xl font-bold truncate">My Order</h2>
        <span className="text-xs md:text-base text-gray-500 block truncate">{getTotalItems()} items</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 md:p-3">
        {items.length === 0 ? (
          <p className="text-center text-xs md:text-base text-gray-400 mt-12">Your cart is empty</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex flex-col xl:flex-row xl:items-center bg-white p-2 md:p-3 mb-2 md:mb-3 rounded-lg shadow-sm">
              <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 mr-3 mb-2 xl:mb-0 bg-white rounded-md overflow-hidden">
                <img 
                  src={`/images/${item.image_filename}`} 
                  alt={item.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                  draggable={false}
                />
              </div>
              <div className="flex-1 mb-2 xl:mb-0">
                <h4 className="m-0 mb-1 text-xs md:text-base font-bold truncate">{item.name}</h4>
                <div className="font-bold text-sm md:text-base">{formatPrice(item.price * item.quantity)}</div>
              </div>
              
              <div className="flex items-center gap-2 md:gap-4 justify-between xl:justify-end w-full xl:w-auto">
                <button 
                  onClick={() => item.quantity > 1 ? decrementQuantity(item.id) : removeItem(item.id)}
                  className="p-1 md:p-2 text-sm md:text-xl rounded-full border-none bg-gray-200 cursor-pointer active:scale-95 transition-transform"
                >
                  {item.quantity > 1 ? <Minus size={16} className="md:w-5 md:h-5" /> : <Trash2 size={16} className="text-red-600 md:w-5 md:h-5" />}
                </button>
                <span className="text-sm md:text-xl font-bold w-4 text-center">{item.quantity}</span>
                <button 
                  onClick={() => incrementQuantity(item.id)}
                  className="p-1 md:p-2 text-sm md:text-xl rounded-full border-none bg-gray-200 cursor-pointer active:scale-95 transition-transform"
                >
                  <Plus size={16} className="md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 md:p-5 bg-white border-t-2 border-mcd-border">
        <div className="flex flex-col xl:flex-row xl:justify-between mb-3 md:mb-5 text-lg md:text-2xl font-bold">
          <span>Total:</span>
          <span>{formatPrice(getTotalPrice())}</span>
        </div>
        <button 
          onClick={handleCheckout}
          disabled={items.length === 0}
          className={`w-full p-3 md:p-5 text-sm md:text-2xl font-bold text-white border-none rounded-xl ${
            items.length === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-mcd-green cursor-pointer active:scale-95 transition-transform'
          }`}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
}
