import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  category: string;
  image_filename: string;
};

const products: SeedProduct[] = [
  // Burgers
  {
    name: 'Classic Burger',
    description: 'Hambúrguer artesanal com queijo, alface, tomate e molho da casa.',
    price: 28.9,
    category: 'Burgers',
    image_filename: 'classic-burger.png',
  },
  {
    name: 'Double Bacon',
    description: 'Dois smash burgers, queijo cheddar e bacon crocante.',
    price: 36.9,
    category: 'Burgers',
    image_filename: 'double-bacon.png',
  },
  {
    name: 'Chicken Crispy',
    description: 'Filé de frango empanado, maionese temperada e salada fresca.',
    price: 27.5,
    category: 'Burgers',
    image_filename: 'chicken-crispy.png',
  },
  {
    name: 'Veggie Delight',
    description: 'Burger plant-based com queijo vegano e molho especial.',
    price: 29.9,
    category: 'Burgers',
    image_filename: 'veggie-delight.png',
  },

  // Sides
  {
    name: 'Batata Frita',
    description: 'Porção média de batatas fritas crocantes.',
    price: 12.9,
    category: 'Sides',
    image_filename: 'fries.png',
  },
  {
    name: 'Onion Rings',
    description: 'Anéis de cebola empanados e dourados.',
    price: 14.9,
    category: 'Sides',
    image_filename: 'onion-rings.png',
  },
  {
    name: 'Nuggets (6un)',
    description: 'Seis nuggets de frango com molho barbecue.',
    price: 16.5,
    category: 'Sides',
    image_filename: 'nuggets.png',
  },

  // Drinks
  {
    name: 'Refrigerante 500ml',
    description: 'Refrigerante gelado — cola, guaraná ou limão.',
    price: 8.9,
    category: 'Drinks',
    image_filename: 'soda.png',
  },
  {
    name: 'Suco Natural',
    description: 'Suco de laranja ou limão feito na hora.',
    price: 11.9,
    category: 'Drinks',
    image_filename: 'juice.png',
  },
  {
    name: 'Milkshake',
    description: 'Milkshake cremoso de chocolate, morango ou baunilha.',
    price: 15.9,
    category: 'Drinks',
    image_filename: 'milkshake.png',
  },

  // Desserts
  {
    name: 'Sundae',
    description: 'Sorvete com calda de chocolate ou caramelo.',
    price: 9.9,
    category: 'Desserts',
    image_filename: 'sundae.png',
  },
  {
    name: 'Brownie',
    description: 'Brownie quente com cobertura de chocolate belga.',
    price: 13.5,
    category: 'Desserts',
    image_filename: 'brownie.png',
  },
  {
    name: 'Cookie Duo',
    description: 'Dois cookies crocantes com gotas de chocolate.',
    price: 10.9,
    category: 'Desserts',
    image_filename: 'cookie-duo.png',
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  const existingCount = await prisma.product.count();
  const force = process.env.FORCE_SEED === 'true';

  if (existingCount > 0 && !force) {
    console.log(`⏭️  Database already has ${existingCount} products. Skipping seed.`);
    console.log('   Set FORCE_SEED=true to re-seed.');
    return;
  }

  if (force) {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
  }

  const created = await prisma.product.createMany({
    data: products,
  });

  const categories = [...new Set(products.map((p) => p.category))];

  console.log(`✅ Seeded ${created.count} products`);
  console.log(`📁 Categories: ${categories.join(', ')}`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
