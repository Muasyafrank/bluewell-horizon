const { sequelize } = require('../config/db');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Reverse Osmosis System - 500L/H',
    description: 'Commercial grade RO system with 5-stage filtration. Ideal for small businesses and institutions.',
    price: 85000.00,
    category: 'Water Purification',
    image: '/images/product-ro-500.jpg',
    stock: 10,
    features: ['500L/Hour Capacity', '5-Stage Filtration', 'Automatic Flushing', 'Energy Efficient']
  },
  {
    name: 'UV Sterilizer - 40W',
    description: 'High-efficiency UV sterilizer for water disinfection. Eliminates 99.99% of bacteria and viruses.',
    price: 25000.00,
    category: 'Water Disinfection',
    image: '/images/product-uv-40w.jpg',
    stock: 15,
    features: ['40W UV Lamp', 'Stainless Steel Chamber', 'Low Maintenance', 'Chemical-Free']
  },
  {
    name: 'Water Softener - 2000L',
    description: 'Automatic water softener with PLC control. Removes hardness minerals and prevents scaling.',
    price: 65000.00,
    category: 'Water Softening',
    image: '/images/product-softener.jpg',
    stock: 8,
    features: ['2000L Capacity', 'Auto Regeneration', 'PLC Controlled', 'FRP Tank']
  },
  {
    name: 'RO Membrane - 4040',
    description: 'High-quality RO membrane replacement. Compatible with most standard RO systems.',
    price: 8500.00,
    category: 'Spare Parts',
    image: '/images/product-membrane.jpg',
    stock: 50,
    features: ['4040 Size', 'High Rejection Rate', 'Long Lifespan', 'Imported Quality']
  },
  {
    name: 'Activated Carbon Filter',
    description: 'Granular activated carbon filter for taste, odor, and chlorine removal.',
    price: 15000.00,
    category: 'Filtration',
    image: '/images/product-carbon.jpg',
    stock: 25,
    features: ['High Adsorption', 'Food Grade Carbon', 'Long Service Life', 'Easy Replacement']
  },
  {
    name: 'Water Testing Kit',
    description: 'Complete water quality testing kit. Tests for pH, TDS, hardness, chlorine, and more.',
    price: 5500.00,
    category: 'Testing Equipment',
    image: '/images/product-test-kit.jpg',
    stock: 30,
    features: ['Multi-Parameter', 'Easy to Use', 'Portable', 'Accurate Results']
  }
];

const seedProducts = async () => {
  try {
    await sequelize.sync({ alter: true });
    await Product.bulkCreate(sampleProducts);
    console.log('✅ Sample products added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();