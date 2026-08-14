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
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout');
    }
  };

  return (
    <div className="w-[350px] bg-mcd-gray flex flex-col h-full border-l-2 border-mcd-border">
      <div className="p-5 border-b border-gray-300">
        <h2 className="m-0 text-2xl font-bold">Meu Pedido</h2>
        <span className="text-gray-500">{getTotalItems()} itens</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {items.length === 0 ? (
          <p className="text-center text-gray-400 mt-12">Seu carrinho está vazio</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center bg-white p-3 mb-3 rounded-lg shadow-sm">
              <div className="flex-1">
                <h4 className="m-0 mb-1 text-base font-bold">{item.name}</h4>
                <div className="font-bold">{formatPrice(item.price * item.quantity)}</div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => item.quantity > 1 ? decrementQuantity(item.id) : removeItem(item.id)}
                  className="p-2 text-xl rounded-full border-none bg-gray-200 cursor-pointer active:scale-95 transition-transform"
                >
                  {item.quantity > 1 ? <Minus size={20} /> : <Trash2 size={20} className="text-red-600" />}
                </button>
                <span className="text-xl font-bold w-4 text-center">{item.quantity}</span>
                <button 
                  onClick={() => incrementQuantity(item.id)}
                  className="p-2 text-xl rounded-full border-none bg-gray-200 cursor-pointer active:scale-95 transition-transform"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-5 bg-white border-t-2 border-mcd-border">
        <div className="flex justify-between mb-5 text-2xl font-bold">
          <span>Total:</span>
          <span>{formatPrice(getTotalPrice())}</span>
        </div>
        <button 
          onClick={handleCheckout}
          disabled={items.length === 0}
          className={`w-full p-5 text-2xl font-bold text-white border-none rounded-xl ${
            items.length === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-mcd-green cursor-pointer active:scale-95 transition-transform'
          }`}
        >
          FINALIZAR PEDIDO
        </button>
      </div>
    </div>
  );
}
