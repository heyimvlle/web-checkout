import { useNavigate } from 'react-router-dom';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/menu')}
      className="h-screen w-screen bg-mcd-red flex flex-col justify-center items-center text-white cursor-pointer select-none p-4 text-center"
    >
      <h1 className="text-5xl sm:text-7xl md:text-[80px] mb-4 md:mb-5 font-bold m-0 leading-tight">
        WELCOME
      </h1>
      <p className="text-2xl sm:text-3xl md:text-[40px] bg-mcd-yellow text-black px-6 md:px-10 py-3 md:py-5 rounded-full font-bold m-0 shadow-lg">
        TOUCH SCREEN TO START
      </p>
    </div>
  );
}
