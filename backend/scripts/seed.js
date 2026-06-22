const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Gallery = require('../models/Gallery');

const seed = async () => {
  try {
    // force: true drops all tables and recreates them
    await sequelize.sync({ force: true });
    console.log('️  Tables dropped and recreated.');

    // 1. Create Admin
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    await Admin.create({ email: 'admin@bluewellhorizon.com', password: hashedPassword });
    console.log('✅ Admin created (admin@bluewellhorizon.com / Admin123!)');

    // 2. Seed Services
    await Service.bulkCreate([
      { title: 'Water Purification', shortDesc: 'Comprehensive purification', description: 'Advanced RO and UV systems.', icon: 'FaTint', image: '/images/service-purification.jpg' },
      { title: 'Water Bottling Plants', shortDesc: 'Complete setup', description: 'End-to-end bottling solutions.', icon: 'FaIndustry', image: '/images/service-bottling.jpg' },
      { title: 'Desalination Systems', shortDesc: 'Saline to fresh water', description: 'Coastal and borehole solutions.', icon: 'FaWater', image: '/images/service-desalination.jpg' }
    ]);
    console.log('✅ Services seeded.');

    // 3. Seed Gallery
    await Gallery.bulkCreate([
      { title: 'Industrial Plant', category: 'Industrial', image: '/images/gallery-1.png' },
      { title: 'RO Installation', category: 'RO Systems', image: '/images/gallery-2.png' },
      { title: 'Water Testing', category: 'Diagnostics', image: '/images/gallery-3.png' }
    ]);
    console.log('✅ Gallery seeded.');

    // 4. Seed Products
    await Product.bulkCreate([
      { name: 'RO System 500L/H', description: 'Commercial grade RO system with 5-stage filtration.', price: 85000.00, category: 'Purification', image: '/images/product-ro.jpg', stock: 10 },
      { name: 'UV Sterilizer 40W', description: 'High-efficiency UV sterilizer for water disinfection.', price: 25000.00, category: 'Disinfection', image: '/images/product-uv.jpg', stock: 15 },
      { name: 'Water Softener 2000L', description: 'Automatic water softener with PLC control.', price: 65000.00, category: 'Softening', image: '/images/product-softener.jpg', stock: 8 }
    ]);
    console.log('✅ Products seeded.');

    console.log('\n🎉 SEEDING COMPLETE! You can now start your server.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();