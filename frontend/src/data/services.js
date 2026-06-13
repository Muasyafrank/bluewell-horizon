// src/data/services.js
import { FaTint, FaIndustry, FaWater, FaShieldAlt, FaClipboardCheck, FaTools } from 'react-icons/fa';

export const servicesData = [
  { 
    id: 1,
    image:'/images/gallery-6.png',
    icon: FaTint, 
    title: "Water Purification", 
    shortDesc: "Comprehensive purification, softening, and filtration",
    desc: "Complete water treatment solutions including RO, UV sterilization, multimedia filtration, and water softening for all environments.",
    description: "Bluewell Horizon Limited offers comprehensive water purification and treatment systems. Our solutions encompass advanced Reverse Osmosis (RO), UV sterilization, and activated carbon treatment to eliminate bacteria, viruses, and heavy metals. We also integrate Multimedia Filtration to remove sediment and turbidity, and Water Softening systems to prevent scaling. For critical applications, we provide UltraPure water systems using EDI technology. This multi-barrier approach guarantees the highest purity standards for residential, commercial, industrial, and medical applications.",
    features: [
      'Reverse Osmosis (RO) and UV sterilization',
      'Multimedia filtration for sediment and turbidity removal',
      'Water softening to remove hardness minerals and prevent scaling',
      'UltraPure EDI systems for laboratories and medical facilities',
      'PLC-controlled automated operation and monitoring',
      'Multi-barrier purification approach'
    ],
    applications: [
      { name: 'Residential Homes', icon: 'FaHome' },
      { name: 'Commercial Buildings', icon: 'FaBuilding' },
      { name: 'Industrial Facilities', icon: 'FaIndustry' },
      { name: 'Laboratories & Medical', icon: 'FaFlask' },
      { name: 'Borehole Treatment', icon: 'FaTint' }
    ],
    benefits: 'Our comprehensive multi-barrier approach guarantees the highest purity standards. Whether you need basic sediment removal, hardness prevention, or ultrapure water for medical use, our integrated systems ensure your water is completely safe, efficient, and tailored to your specific environment.'
  },
  { 
    id: 2,
    image:'/images/gallery-7.png',
    icon: FaIndustry, 
    title: "Water Bottling Plant Solutions", 
    shortDesc: "Complete bottling plant setup and support",
    desc: "Complete water bottling solutions for entrepreneurs and established businesses, from design to operational support.",
    description: "We provide complete water bottling solutions for entrepreneurs and established businesses. Our services include system design, purification setup, bottling equipment installation, and operational support to ensure compliance and efficiency. We focus on delivering reliable systems that enhance productivity and product quality, helping our clients build profitable and sustainable operations.",
    features: [
      'Complete system design and layout',
      'Purification and bottling equipment installation',
      'Operational and compliance support',
      'Productivity and quality enhancement',
      'Sustainable and profitable operations'
    ],
    applications: [
      { name: 'Entrepreneurs', icon: 'FaUser' },
      { name: 'Established Businesses', icon: 'FaIndustry' },
      { name: 'Beverage Companies', icon: 'FaGlassMartini' }
    ],
    benefits: 'We help you build a profitable and sustainable bottling operation by providing end-to-end support, ensuring your plant meets all regulatory compliance and efficiency standards from day one.'
  },
  { 
    id: 3,
    image: '/images/gallery-8.png',
    icon: FaWater, 
    title: "Desalination Systems", 
    shortDesc: "Convert saline water to fresh water",
    desc: "Advanced membrane technology to convert saline or brackish water into fresh, usable water for coastal regions and high-salinity boreholes.",
    description: "Our desalination solutions convert saline or brackish water into fresh, usable water using advanced membrane technology. These systems are ideal for coastal regions, high-salinity boreholes, and industrial applications that require a reliable freshwater supply. We design efficient and scalable solutions to ensure consistent performance and long-term sustainability—providing dependable water where it is needed most.",
    features: [
      'Advanced membrane technology',
      'Converts saline and brackish water',
      'Scalable and efficient design',
      'Consistent long-term performance',
      'Ideal for high-salinity environments'
    ],
    applications: [
      { name: 'Coastal Regions', icon: 'FaHome' },
      { name: 'High-Salinity Boreholes', icon: 'FaTint' },
      { name: 'Industrial Applications', icon: 'FaIndustry' }
    ],
    benefits: 'We provide dependable freshwater in areas where traditional sources are unavailable or compromised, ensuring consistent performance and long-term sustainability for your operations.'
  },
  { 
    id: 4,
    image: '/images/gallery-9.png',
    icon: FaShieldAlt, 
    title: "Water Disinfection", 
    shortDesc: "Eliminate harmful pathogens safely",
    desc: "Effective UV, chlorination, and ozone technologies to eliminate harmful microorganisms for safe and hygienic water.",
    description: "We offer effective water disinfection systems using UV, chlorination, and ozone technologies to eliminate harmful microorganisms and pathogens. Our solutions ensure safe and hygienic water for residential estates, institutions, and commercial facilities. We design each system to meet specific water quality requirements and regulatory standards—protecting both public health and water integrity.",
    features: [
      'UV, chlorination, and ozone technologies',
      'Eliminates harmful microorganisms',
      'Meets regulatory water quality standards',
      'Protects public health and water integrity',
      'Customized to specific facility needs'
    ],
    applications: [
      { name: 'Residential Estates', icon: 'FaHome' },
      { name: 'Institutions & Schools', icon: 'FaSchool' },
      { name: 'Commercial Facilities', icon: 'FaBuilding' }
    ],
    benefits: 'Protect public health and ensure water integrity with our customized disinfection systems that strictly meet regulatory standards without compromising water quality.'
  },
  { 
    id: 5,
    image: '/images/gallery-10.png',
    icon: FaClipboardCheck, 
    title: "Water Diagnosis & System Design", 
    shortDesc: "Professional analysis and custom design",
    desc: "Professional water quality analysis and diagnostics to design customized, cost-effective treatment systems.",
    description: "We conduct professional water quality analysis and system diagnostics to identify specific water challenges. Based on our findings, we design customized treatment systems tailored to meet each client’s needs and budget. Our goal is to deliver efficient, reliable, and cost-effective water solutions that ensure optimal performance and long-term sustainability.",
    features: [
      'Professional water quality analysis',
      'Comprehensive system diagnostics',
      'Customized treatment system design',
      'Tailored to client needs and budget',
      'Ensures optimal long-term performance'
    ],
    applications: [
      { name: 'New Installations', icon: 'FaTools' },
      { name: 'System Upgrades', icon: 'FaCog' },
      { name: 'Troubleshooting', icon: 'FaSearch' }
    ],
    benefits: 'Stop guessing and start treating. Our precise diagnostics ensure you only invest in the exact solutions your water needs, saving you money and ensuring optimal system performance.'
  },
  { 
    id: 6,
    image: '/images/gallery-11.png',
    icon: FaTools, 
    title: "Installation & Technical Support", 
    shortDesc: "Expert installation and after-sales care",
    desc: "Professional installation, routine maintenance, troubleshooting, and spare parts supply for long-term reliability.",
    description: "Our experienced technical team ensures professional installation and dependable after-sales support. We provide routine maintenance, troubleshooting, system upgrades, and spare parts to maintain optimal performance. We are committed to fast response times and long-term reliability—ensuring your water systems operate efficiently at all times.",
    features: [
      'Professional system installation',
      'Routine maintenance and servicing',
      'Rapid troubleshooting and repairs',
      'System upgrades and spare parts supply',
      'Fast response times and long-term reliability'
    ],
    applications: [
      { name: 'All System Types', icon: 'FaCog' },
      { name: 'Emergency Repairs', icon: 'FaExclamationTriangle' },
      { name: 'Preventative Maintenance', icon: 'FaCalendarCheck' }
    ],
    benefits: 'Maximize the lifespan and efficiency of your water treatment system with our dedicated technical support, ensuring zero downtime and consistent water quality.'
  }
];