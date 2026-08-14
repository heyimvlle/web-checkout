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
    description: 'Artisan burger with cheese, lettuce, tomato, and house sauce.',
    price: 28.9,
    category: 'Burgers',
    image_filename: 'classic-burger.png',
  },
  {
    name: 'Double Bacon',
    description: 'Two smash burgers, cheddar cheese, and crispy bacon.',
    price: 36.9,
    category: 'Burgers',
    image_filename: 'double-bacon.png',
  },
  {
    name: 'Chicken Crispy',
    description: 'Breaded chicken fillet, seasoned mayo, and fresh salad.',
    price: 27.5,
    category: 'Burgers',
    image_filename: 'chicken-crispy.png',
  },
  {
    name: 'Veggie Delight',
    description: 'Plant-based burger with vegan cheese and special sauce.',
    price: 29.9,
    category: 'Burgers',
    image_filename: 'veggie-delight.png',
  },

  // Sides
  {
    name: 'French Fries',
    description: 'Medium portion of crispy french fries.',
    price: 12.9,
    category: 'Sides',
    image_filename: 'fries.png',
  },
  {
    name: 'Onion Rings',
    description: 'Breaded and golden onion rings.',
    price: 14.9,
    category: 'Sides',
    image_filename: 'onion-rings.png',
  },
  {
    name: 'Chicken Nuggets (6pc)',
    description: 'Six chicken nuggets with barbecue sauce.',
    price: 16.5,
    category: 'Sides',
    image_filename: 'nuggets.png',
  },

  // Drinks
  {
    name: 'Soda 500ml',
    description: 'Cold soda — cola, guarana, or lemon.',
    price: 8.9,
    category: 'Drinks',
    image_filename: 'soda.png',
  },
  {
    name: 'Natural Juice',
    description: 'Freshly squeezed orange or lemon juice.',
    price: 11.9,
    category: 'Drinks',
    image_filename: 'juice.png',
  },
  {
    name: 'Milkshake',
    description: 'Creamy chocolate, strawberry, or vanilla milkshake.',
    price: 15.9,
    category: 'Drinks',
    image_filename: 'milkshake.png',
  },

  // Desserts
  {
    name: 'Sundae',
    description: 'Ice cream with chocolate or caramel syrup.',
    price: 9.9,
    category: 'Desserts',
    image_filename: 'sundae.png',
  },
  {
    name: 'Brownie',
    description: 'Warm brownie with Belgian chocolate topping.',
    price: 13.5,
    category: 'Desserts',
    image_filename: 'brownie.png',
  },
  {
    name: 'Cookie Duo',
    description: 'Two crispy chocolate chip cookies.',
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
