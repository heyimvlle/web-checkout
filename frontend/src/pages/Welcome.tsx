import { useNavigate } from 'react-router-dom';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/menu')}
      className="h-screen w-screen bg-mcd-red flex flex-col justify-center items-center text-white cursor-pointer select-none"
    >
      <h1 className="text-[80px] mb-5 font-bold text-center m-0">
        BEM-VINDO
      </h1>
      <p className="text-[40px] bg-mcd-yellow text-black px-10 py-5 rounded-full font-bold m-0">
        TOQUE NA TELA PARA INICIAR O PEDIDO
      </p>
    </div>
  );
}
