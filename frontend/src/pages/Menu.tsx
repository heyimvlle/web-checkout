import { useState, useEffect } from 'react';
import { CategoryMenu } from '../components/CategoryMenu';
import { ProductCard } from '../components/ProductCard';
import { SidebarCart } from '../components/SidebarCart';
import type { Product } from '../types';
import { api } from '../services/api';

export function Menu() {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          api.get('/products/categories'),
          api.get('/products')
        ]);
        setCategories(categoriesRes.data);
        setProducts(productsRes.data);
        if (categoriesRes.data.length > 0) {
          setActiveCategory(categoriesRes.data[0]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };
    fetchData();
  }, []);

  const activeProducts = products.filter(p => p.category === activeCategory);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-mcd-gray-light">
      {/* Sidebar Categorias (Esquerda) */}
      <div className="w-[300px] bg-white border-r-2 border-mcd-border flex flex-col shrink-0">
        <div className="p-6 bg-mcd-red text-white text-center">
          <h2 className="m-0 text-3xl font-bold">Menu</h2>
        </div>
        <CategoryMenu 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelectCategory={setActiveCategory} 
        />
      </div>

      {/* Conteúdo Central (Produtos) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Dinâmico */}
        <div className="p-6 bg-white shadow-sm z-10 shrink-0 border-b border-gray-200">
          <h1 className="m-0 text-3xl text-gray-800 font-bold">
            {activeCategory || 'Faça seu pedido'}
          </h1>
        </div>

        {/* Grid de Produtos */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-8">
            {activeProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Carrinho Lateral (Direita) */}
      <SidebarCart />
    </div>
  );
}
