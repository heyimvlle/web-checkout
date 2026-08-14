interface CategoryMenuProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryMenu({ categories, activeCategory, onSelectCategory }: CategoryMenuProps) {
  return (
    <div className="flex flex-col overflow-y-auto p-2 md:p-4 gap-2 md:gap-4 flex-1 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`w-full py-4 md:py-8 px-2 md:px-4 text-sm sm:text-base md:text-xl font-bold rounded-xl md:rounded-2xl border-none cursor-pointer transition-colors shadow-sm active:scale-95 break-words ${
            activeCategory === category 
              ? 'bg-mcd-yellow text-black' 
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
