interface CategoryMenuProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryMenu({ categories, activeCategory, onSelectCategory }: CategoryMenuProps) {
  return (
    <div className="flex flex-col overflow-y-auto p-4 gap-4 flex-1 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`w-full py-8 px-4 text-xl font-bold rounded-2xl border-none cursor-pointer transition-colors shadow-sm active:scale-95 break-words ${
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
