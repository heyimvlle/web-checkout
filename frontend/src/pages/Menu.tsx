import { useState, useEffect } from 'react';
import { CategoryMenu } from '../components/CategoryMenu';
import { ProductCard } from '../components/ProductCard';
import { SidebarCart } from '../components/SidebarCart';
import type { Product } from '../types';
import { api } from '../services/api';

export function Menu() {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('🔥 Bestsellers');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes, bestsellersRes] = await Promise.all([
          api.get('/products/categories'),
          api.get('/products'),
          api.get('/products/bestsellers')
        ]);
        setCategories(['🔥 Bestsellers', ...categoriesRes.data]);
        setProducts(productsRes.data);
        setBestsellers(bestsellersRes.data);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    fetchData();
  }, []);

  const activeProducts = activeCategory === '🔥 Bestsellers' 
    ? bestsellers 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-mcd-gray-light">
      <div className="w-[25%] md:w-[250px] lg:w-[300px] bg-white border-r-2 border-mcd-border flex flex-col shrink-0">
        <div className="p-4 md:p-6 bg-mcd-red text-white text-center flex items-center justify-center">
          <h2 className="m-0 text-xl md:text-3xl font-bold">Menu</h2>
        </div>
        <CategoryMenu 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelectCategory={setActiveCategory} 
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 md:p-6 bg-white shadow-sm z-10 shrink-0 border-b border-gray-200">
          <h1 className="m-0 text-2xl md:text-3xl text-gray-800 font-bold truncate">
            {activeCategory || 'Place your order'}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 md:gap-8">
            {activeProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <SidebarCart />
    </div>
  );
}
