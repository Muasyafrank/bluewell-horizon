const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Gallery = require('../models/Gallery');
const Technology = require('../models/Technology');
const ProcessStep = require('../models/ProcessStep');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('🗑️  Tables dropped and recreated.');

    // 1. Admin Account
    await Admin.create({ 
      email: 'admin@bluewellhorizon.com', 
      password: await bcrypt.hash('Admin123!', 10) 
    });
    console.log('✅ Admin created.');

    // 2. Services (From Company Profile)
    await Service.bulkCreate([
      { 
        title: 'Water Purification', 
        shortDesc: 'Comprehensive purification systems using advanced technologies', 
        description: 'Bluewell Horizon Limited offers comprehensive purification systems utilizing advanced technologies including Reverse Osmosis (RO), UV sterilization, and activated carbon treatment. Our systems effectively eliminate bacteria, viruses, chemicals, and heavy metals to ensure safe and potable water. This multi-barrier approach guarantees the highest purity standards for residential, commercial, and industrial applications.', 
        icon: 'FaTint', 
        image: '/images/gallery-1.png',
        features: [
          'Reverse Osmosis (RO) technology',
          'UV sterilization systems',
          'Activated carbon treatment',
          'Eliminates bacteria, viruses, and chemicals',
          'Removes heavy metals',
          'Multi-barrier purification approach',
          'Safe and potable water guarantee'
        ],
        applications: [
          {name: 'Residential', icon: 'FaHome'}, 
          {name: 'Commercial', icon: 'FaBuilding'}, 
          {name: 'Industrial', icon: 'FaIndustry'}
        ],
        benefits: 'Our multi-barrier approach guarantees the highest purity standards for all applications, ensuring safe and clean water for every need.'
      },
      { 
        title: 'Water Bottling Plant Solutions', 
        shortDesc: 'Complete water bottling solutions for entrepreneurs and businesses', 
        description: 'We provide complete water bottling solutions for entrepreneurs and established businesses. Our services include system design, purification setup, bottling equipment installation, and operational support to ensure compliance and efficiency. We focus on delivering reliable systems that enhance productivity and product quality, helping our clients build profitable and sustainable operations.', 
        icon: 'FaIndustry', 
        image: '/images/gallery-2.png',
        features: [
          'Complete system design',
          'Purification setup',
          'Bottling equipment installation',
          'Operational support',
          'Compliance assurance',
          'Efficiency optimization',
          'Productivity enhancement'
        ],
        applications: [
          {name: 'Entrepreneurs', icon: 'FaUser'}, 
          {name: 'Established Businesses', icon: 'FaBuilding'}, 
          {name: 'Bottling Plants', icon: 'FaIndustry'}
        ],
        benefits: 'We help our clients build profitable and sustainable operations with reliable systems that enhance productivity and product quality.'
      },
      { 
        title: 'Water Disinfection', 
        shortDesc: 'Effective disinfection using UV, chlorination, and ozone', 
        description: 'We offer effective water disinfection systems using UV, chlorination, and ozone technologies to eliminate harmful microorganisms and pathogens. Our solutions ensure safe and hygienic water for residential estates, institutions, and commercial facilities. We design each system to meet specific water quality requirements and regulatory standards—protecting both public health and water integrity.', 
        icon: 'FaShieldAlt', 
        image: '/images/gallery-3.png',
        features: [
          'UV disinfection technology',
          'Chlorination systems',
          'Ozone treatment',
          'Eliminates harmful microorganisms',
          'Destroys pathogens',
          'Meets regulatory standards',
          'Protects public health'
        ],
        applications: [
          {name: 'Residential Estates', icon: 'FaHome'}, 
          {name: 'Institutions', icon: 'FaSchool'}, 
          {name: 'Commercial Facilities', icon: 'FaBuilding'}
        ],
        benefits: 'We protect both public health and water integrity with systems designed to meet specific water quality requirements and regulatory standards.'
      },
      { 
        title: 'Water Diagnosis & System Design', 
        shortDesc: 'Professional water quality analysis and customized system design', 
        description: 'We conduct professional water quality analysis and system diagnostics to identify specific water challenges. Based on our findings, we design customized treatment systems tailored to meet each clients needs and budget. Our goal is to deliver efficient, reliable, and cost-effective water solutions that ensure optimal performance and long-term sustainability.', 
        icon: 'FaClipboardCheck', 
        image: '/images/gallery-4.png',
        features: [
          'Professional water quality analysis',
          'System diagnostics',
          'Identifies specific water challenges',
          'Customized treatment system design',
          'Tailored to client needs and budget',
          'Efficient solutions',
          'Cost-effective design'
        ],
        applications: [
          {name: 'All Clients', icon: 'FaUsers'}, 
          {name: 'New Installations', icon: 'FaPlus'}, 
          {name: 'System Upgrades', icon: 'FaCog'}
        ],
        benefits: 'We deliver efficient, reliable, and cost-effective water solutions that ensure optimal performance and long-term sustainability tailored to your specific needs.'
      },
      { 
        title: 'Installation & Technical Support', 
        shortDesc: 'Professional installation and dependable after-sales support', 
        description: 'Our experienced technical team ensures professional installation and dependable after-sales support. We provide routine maintenance, troubleshooting, system upgrades, and spare parts to maintain optimal performance. We are committed to fast response times and long-term reliability—ensuring your water systems operate efficiently at all times.', 
        icon: 'FaTools', 
        image: '/images/gallery-5.png',
        features: [
          'Professional installation',
          'Experienced technical team',
          'Routine maintenance',
          'Troubleshooting services',
          'System upgrades',
          'Spare parts supply',
          'Fast response times'
        ],
        applications: [
          {name: 'All Systems', icon: 'FaCog'}, 
          {name: 'Maintenance', icon: 'FaWrench'}, 
          {name: 'Emergency Support', icon: 'FaExclamationTriangle'}
        ],
        benefits: 'We ensure your water systems operate efficiently at all times with our commitment to fast response times and long-term reliability.'
      }
    ]);
    console.log('✅ Services seeded.');

    // 3. Technologies (From Company Profile)
    await Technology.bulkCreate([
      { 
        name: 'Reverse Osmosis (RO)', 
        description: 'Advanced membrane filtration technology that removes dissolved solids, contaminants, and impurities to produce high-quality purified water.', 
        icon: 'FaFilter', 
        image: '/images/gallery-6.png' 
      },
      { 
        name: 'Ultrafiltration (UF)', 
        description: 'Membrane filtration process that removes suspended solids, bacteria, and high-molecular-weight substances while allowing water and low-molecular-weight solutes to pass through.', 
        icon: 'FaNetworkWired', 
        image: '/images/gallery-7.png' 
      },
      { 
        name: 'Nanofiltration (NF)', 
        description: 'Membrane technology that removes particles and molecules in the nanometer size range, effective for water softening and removal of organic matter.', 
        icon: 'FaAtom', 
        image: '/images/gallery-8.png' 
      },
      { 
        name: 'UV Sterilization', 
        description: 'Ultraviolet light technology that effectively eliminates bacteria, viruses, and other microorganisms without chemicals, ensuring safe and hygienic water.', 
        icon: 'FaBolt', 
        image: '/images/gallery-9.png' 
      },
      { 
        name: 'Water Softening', 
        description: 'Ion exchange process that removes hardness minerals (calcium and magnesium) to prevent scaling, protect equipment, and improve water efficiency.', 
        icon: 'FaTint', 
        image: '/images/gallery-10.png' 
      },
      { 
        name: 'Electrodeionization (EDI)', 
        description: 'Advanced technology combining ion exchange resins and electrical current to produce ultrapure water continuously, ideal for laboratories and pharmaceutical applications.', 
        icon: 'FaMicroscope', 
        image: '/images/gallery-11.png' 
      }
      
    ]);
    console.log('✅ Technologies seeded.');

    // 4. Process Steps (How We Work)
    await ProcessStep.bulkCreate([
      { 
        stepNumber: 1, 
        title: 'Water Quality Analysis', 
        description: 'Professional testing and diagnostics to identify specific water challenges and quality parameters.' 
      },
      { 
        stepNumber: 2, 
        title: 'System Design', 
        description: 'Customized treatment system design tailored to meet your specific needs, budget, and requirements.' 
      },
      { 
        stepNumber: 3, 
        title: 'Technology Selection', 
        description: 'Matching the right technologies (RO, UF, UV, EDI) to your exact water treatment needs.' 
      },
      { 
        stepNumber: 4, 
        title: 'Professional Installation', 
        description: 'Expert installation by our experienced technical team ensuring proper setup and configuration.' 
      },
      { 
        stepNumber: 5, 
        title: 'Testing & Commissioning', 
        description: 'Rigorous testing and system validation to ensure optimal performance and water quality standards.' 
      },
      { 
        stepNumber: 6, 
        title: 'Ongoing Support', 
        description: 'Continuous maintenance, troubleshooting, and technical support to maintain system efficiency.' 
      }
    ]);
    console.log('✅ Process Steps seeded.');

    // 5. Products (Based on Services)
    await Product.bulkCreate([
      { 
        name: 'RO Water Purification System - 500L/H', 
        description: 'Commercial grade Reverse Osmosis system with 5-stage filtration. Ideal for small businesses and institutions. Includes pre-filtration, RO membrane, and post-treatment.', 
        price: 85000.00, 
        category: 'Water Purification', 
        image: '/images/gallery-12.png', 
        stock: 10 
      },
      { 
        name: 'UV Sterilizer - 40W', 
        description: 'High-efficiency UV sterilizer for water disinfection. Eliminates 99.99% of bacteria and viruses. Chemical-free operation.', 
        price: 25000.00, 
        category: 'Water Disinfection', 
        image: '/images/gallery-1.png', 
        stock: 15 
      },
      { 
        name: 'Water Softener - 2000L', 
        description: 'Automatic water softener with PLC control. Removes hardness minerals and prevents scaling. FRP tank included.', 
        price: 65000.00, 
        category: 'Water Softening', 
        image: '/images/gallery-2.png', 
        stock: 8 
      },
      { 
        name: 'Multimedia Filter System', 
        description: 'Advanced filtration system removes sediment, turbidity, chlorine, and suspended impurities. Ideal for borehole water treatment.', 
        price: 45000.00, 
        category: 'Filtration', 
        image: '/images/gallery-3.png', 
        stock: 12 
      },
      { 
        name: 'EDI Ultrapure Water System', 
        description: 'Electrodeionization system for laboratories and pharmaceutical industries. Produces high-purity water with automated monitoring.', 
        price: 250000.00, 
        category: 'Ultrapure Water', 
        image: '/images/gallery-4.png', 
        stock: 3 
      },
      { 
        name: 'Complete Bottling Plant Package', 
        description: 'Turnkey water bottling plant solution including purification system, filling equipment, and operational training.', 
        price: 850000.00, 
        category: 'Bottling Plant', 
        image: '/images/gallery-4.png', 
        stock: 2 
      }
    ]);
    console.log('✅ Products seeded.');

    // 6. Gallery Items (From Company Profile - Pages 13-19)
    await Gallery.bulkCreate([
      { 
        title: 'Industrial Water Treatment Plant Installation', 
        category: 'Industrial', 
        image: '/images/gallery-1.png' 
      },
      { 
        title: 'Commercial RO System Setup', 
        category: 'Commercial', 
        image: '/images/gallery-2.png' 
      },
      { 
        title: 'Residential Water Purification System', 
        category: 'Residential', 
        image: '/images/gallery-3.png' 
      },
      { 
        title: 'Water Bottling Plant Equipment', 
        category: 'Bottling Plant', 
        image: '/images/gallery-4.png' 
      },
      { 
        title: 'UV Disinfection System Installation', 
        category: 'Disinfection', 
        image: '/images/gallery-5.png' 
      },
      { 
        title: 'Desalination Plant Project', 
        category: 'Desalination', 
        image: '/images/gallery-6.png' 
      },
      { 
        title: 'Laboratory EDI System', 
        category: 'Ultrapure Water', 
        image: '/images/gallery-7.png' 
      }
    ]);
    console.log('✅ Gallery seeded.');

    console.log('\n🎉 SEEDING COMPLETE!');
    console.log('📊 Database populated with Bluewell Horizon company profile data');
    console.log('\n📋 Login Credentials:');
    console.log('   Email: admin@bluewellhorizon.com');
    console.log('   Password: Admin123!');
    console.log('\n Company Information:');
    console.log('   Website: www.bluewellhorizonlimited.com');
    console.log('   Location: Harambee Estate');
    console.log('   Phone: 0721-633-223 / 0731-836-349');
    console.log('   Email: bluewellsynergy@gmail.com\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();