import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
import { api } from '../services/api';
import { Trash2, Plus, Minus } from 'lucide-react';

export function Checkout() {
  const { items, getTotalPrice, clearCart, incrementQuantity, decrementQuantity, removeItem } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await api.post('/orders', {
        items: items.map(item => ({ product_id: item.id, quantity: item.quantity })),
        total: getTotalPrice()
      });
      setOrderNumber(response.data.id.toString().padStart(3, '0'));
      setOrderSuccess(true);
      clearCart();
      
      setTimeout(() => {
        navigate('/');
      }, 5000);
      
    } catch (error) {
      console.error("Error processing order", error);
      alert("An error occurred while processing your payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    navigate('/menu');
    return null;
  }

  if (orderSuccess) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-mcd-green text-white select-none p-4 text-center">
        <h1 className="text-4xl md:text-[60px] mb-2 md:mb-5 font-bold">ORDER CONFIRMED!</h1>
        <p className="text-xl md:text-3xl mb-6 md:mb-10">Your order number is:</p>
        <div className="text-5xl md:text-[100px] font-bold bg-white text-black px-10 md:px-16 py-3 md:py-5 rounded-xl md:rounded-2xl">
          {orderNumber}
        </div>
        <p className="text-lg md:text-2xl mt-6 md:mt-10">Please wait for your number to be called.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-mcd-gray-light select-none">
      <div className="p-4 md:p-8 bg-mcd-red text-white flex items-center shrink-0">
        <button 
          onClick={() => navigate('/menu')}
          className="px-4 md:px-8 py-2 md:py-4 text-base md:text-xl rounded-lg border-none bg-white/20 text-white cursor-pointer mr-4 md:mr-8 active:scale-95 transition-transform"
        >
          Back
        </button>
        <h1 className="m-0 text-xl md:text-4xl font-bold truncate">Confirm your Order</h1>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row p-4 md:p-10 gap-4 md:gap-10 overflow-y-auto">
        <div className="flex-1 lg:flex-[2] bg-white rounded-xl md:rounded-[20px] p-6 md:p-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] overflow-y-auto shrink-0 min-h-[300px]">
          <h2 className="text-xl md:text-3xl border-b-2 border-gray-200 pb-3 md:pb-5 mb-4 md:mb-8 font-bold">Order Summary</h2>
          
          {items.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-base md:text-2xl border-b border-gray-100 py-4 md:py-6 gap-4">
              <div className="truncate pr-4 flex-1 w-full sm:w-auto font-medium">
                {item.name}
              </div>
              
              <div className="flex items-center justify-between w-full sm:w-auto gap-4 md:gap-8">
                <div className="flex items-center gap-3 md:gap-5">
                  <button 
                    onClick={() => item.quantity > 1 ? decrementQuantity(item.id) : removeItem(item.id)}
                    className="p-2 md:p-3 text-lg md:text-2xl rounded-full border-none bg-gray-100 cursor-pointer active:scale-95 transition-transform flex items-center justify-center"
                  >
                    {item.quantity > 1 ? <Minus size={24} className="md:w-7 md:h-7" /> : <Trash2 size={24} className="text-red-600 md:w-7 md:h-7" />}
                  </button>
                  <span className="text-xl md:text-3xl font-bold w-6 md:w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => incrementQuantity(item.id)}
                    className="p-2 md:p-3 text-lg md:text-2xl rounded-full border-none bg-gray-100 cursor-pointer active:scale-95 transition-transform flex items-center justify-center"
                  >
                    <Plus size={24} className="md:w-7 md:h-7" />
                  </button>
                </div>

                <div className="font-bold text-xl md:text-3xl shrink-0 w-[120px] md:w-[150px] text-right">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-xl md:rounded-[20px] p-6 md:p-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex flex-col shrink-0 min-h-[300px]">
          <h2 className="text-xl md:text-3xl border-b-2 border-gray-200 pb-3 md:pb-5 mb-4 md:mb-8 font-bold">Total to Pay</h2>
          
          <div className="text-4xl md:text-5xl font-bold text-mcd-green text-center my-6 md:my-10">
            {formatPrice(getTotalPrice())}
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`mt-auto p-4 md:p-8 text-xl md:text-3xl font-bold text-white border-none rounded-xl md:rounded-2xl w-full ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-mcd-green cursor-pointer active:scale-95 transition-transform'
            }`}
          >
            {isProcessing ? 'PROCESSING...' : 'PAY NOW'}
          </button>
        </div>
      </div>
    </div>
  );
}
