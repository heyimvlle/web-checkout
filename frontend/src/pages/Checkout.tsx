import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
// import { api } from '../services/api';

export function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulação da chamada de API
      /*
      const response = await api.post('/orders', {
        items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
        total: getTotalPrice()
      });
      setOrderNumber(response.data.orderNumber);
      */
      
      // Simulando delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOrderNumber(Math.floor(Math.random() * 1000).toString().padStart(3, '0'));
      setOrderSuccess(true);
      clearCart();
      
      // Volta para a tela inicial após 5 segundos
      setTimeout(() => {
        navigate('/');
      }, 5000);
      
    } catch (error) {
      console.error("Erro ao finalizar pedido", error);
      alert("Ocorreu um erro ao processar seu pagamento. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-mcd-green text-white select-none">
        <h1 className="text-[60px] mb-5">PEDIDO CONFIRMADO!</h1>
        <p className="text-3xl mb-10">Sua senha é:</p>
        <div className="text-[100px] font-bold bg-white text-black px-16 py-5 rounded-2xl">
          {orderNumber}
        </div>
        <p className="text-2xl mt-10">Aguarde ser chamado no painel.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-mcd-gray-light select-none">
      <div className="p-8 bg-mcd-red text-white flex items-center">
        <button 
          onClick={() => navigate('/menu')}
          className="px-8 py-4 text-xl rounded-lg border-none bg-white/20 text-white cursor-pointer mr-8 active:scale-95 transition-transform"
        >
          Voltar
        </button>
        <h1 className="m-0 text-4xl">Confirme seu Pedido</h1>
      </div>

      <div className="flex-1 flex p-10 gap-10">
        {/* Resumo do Pedido */}
        <div className="flex-[2] bg-white rounded-[20px] p-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] overflow-y-auto">
          <h2 className="text-3xl border-b-2 border-gray-200 pb-5 mb-8">Resumo dos Itens</h2>
          
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center text-2xl border-b border-gray-100 py-5">
              <div>
                <span className="font-bold mr-4">{item.quantity}x</span>
                {item.name}
              </div>
              <div className="font-bold">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Pagamento */}
        <div className="flex-1 bg-white rounded-[20px] p-10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex flex-col">
          <h2 className="text-3xl border-b-2 border-gray-200 pb-5 mb-8">Total a Pagar</h2>
          
          <div className="text-5xl font-bold text-mcd-green text-center my-10">
            {formatPrice(getTotalPrice())}
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`mt-auto p-8 text-3xl font-bold text-white border-none rounded-2xl w-full ${
              isProcessing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-mcd-green cursor-pointer active:scale-95 transition-transform'
            }`}
          >
            {isProcessing ? 'PROCESSANDO...' : 'PAGAR AGORA'}
          </button>
        </div>
      </div>
    </div>
  );
}
