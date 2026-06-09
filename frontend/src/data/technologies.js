// src/data/technologies.js
export const technologiesData = [
  {
    id: 1,
    name: 'Reverse Osmosis (RO)',
    shortDesc: 'Advanced membrane filtration for highest purity',
    description: 'Reverse Osmosis is a water purification process that uses a semi-permeable membrane to remove ions, molecules, and larger particles from drinking water. Our RO systems provide the highest level of water purification by forcing water through a membrane that filters out contaminants.',
    features: [
      'Removes up to 99% of dissolved salts and impurities',
      'Effective against bacteria, viruses, and heavy metals',
      'Multi-stage filtration process',
      'Automatic membrane flushing',
      'High recovery rate and efficiency',
      'Low maintenance requirements'
    ],
    applications: [
      { name: 'Residential', icon: 'FaHome' },
      { name: 'Commercial', icon: 'FaIndustry' },
      { name: 'Industrial', icon: 'FaIndustry' },
      { name: 'Healthcare', icon: 'FaHospital' }
    ],
    benefits: 'RO technology provides the gold standard in water purification, ensuring your water is free from harmful contaminants while maintaining essential minerals. Perfect for applications requiring the highest water quality standards.'
  },
  {
    id: 2,
    name: 'Ultrafiltration (UF)',
    shortDesc: 'Precise membrane filtration for clean water',
    description: 'Ultrafiltration uses hollow fiber or sheet membranes to physically separate particles and microorganisms from water. This technology is highly effective for removing suspended solids, bacteria, and viruses while retaining beneficial minerals.',
    features: [
      'Pore size: 0.01-0.1 microns',
      'Removes bacteria and viruses',
      'Retains essential minerals',
      'Low energy consumption',
      'Chemical-free operation',
      'Compact system design'
    ],
    applications: [
      { name: 'Borehole Treatment', icon: 'FaTint' },
      { name: 'Surface Water', icon: 'FaTint' },
      { name: 'Wastewater Reuse', icon: 'FaIndustry' },
      { name: 'Food & Beverage', icon: 'FaIndustry' }
    ],
    benefits: 'UF provides excellent clarification and disinfection without chemicals, making it an environmentally friendly choice. It\'s ideal for pretreatment and standalone applications where mineral retention is important.'
  },
  {
    id: 3,
    name: 'Nanofiltration (NF)',
    shortDesc: 'Selective filtration for specific contaminants',
    description: 'Nanofiltration is a membrane filtration process that falls between reverse osmosis and ultrafiltration. It effectively removes divalent ions, organic molecules, and specific contaminants while allowing monovalent ions to pass through.',
    features: [
      'Selective ion removal',
      'Removes hardness and organics',
      'Lower operating pressure than RO',
      'Energy efficient',
      'Partial demineralization',
      'Color and odor removal'
    ],
    applications: [
      { name: 'Water Softening', icon: 'FaTint' },
      { name: 'Industrial Processes', icon: 'FaIndustry' },
      { name: 'Agriculture', icon: 'FaIndustry' },
      { name: 'Municipal Water', icon: 'FaHome' }
    ],
    benefits: 'NF offers a balanced approach to water treatment, removing problematic contaminants while maintaining water taste and beneficial minerals. It\'s cost-effective for applications requiring partial demineralization.'
  },
  {
    id: 4,
    name: 'UV Sterilization',
    shortDesc: 'Chemical-free disinfection technology',
    description: 'Ultraviolet (UV) sterilization uses UV-C light to inactivate microorganisms by disrupting their DNA. This chemical-free disinfection method is highly effective against bacteria, viruses, and protozoa without altering water taste or chemistry.',
    features: [
      '99.99% effective against pathogens',
      'No chemicals added',
      'No change to water taste or pH',
      'Instant disinfection',
      'Low operating costs',
      'Environmentally friendly'
    ],
    applications: [
      { name: 'Residential Homes', icon: 'FaHome' },
      { name: 'Hospitals', icon: 'FaHospital' },
      { name: 'Hotels', icon: 'FaHotel' },
      { name: 'Schools', icon: 'FaIndustry' }
    ],
    benefits: 'UV sterilization provides safe, chemical-free disinfection that\'s perfect for health-conscious applications. It\'s an excellent final barrier against microbial contamination in conjunction with other treatment methods.'
  },
  {
    id: 5,
    name: 'Water Softening',
    shortDesc: 'Remove hardness minerals effectively',
    description: 'Water softening systems use ion exchange technology to remove calcium and magnesium ions that cause water hardness. This prevents scale buildup, extends equipment life, and improves water efficiency in homes and businesses.',
    features: [
      'Automatic regeneration cycles',
      'PLC-controlled operation',
      'Stainless steel and FRP tanks',
      'Energy efficient',
      'Reduces scaling by 99%',
      'Extends appliance lifespan'
    ],
    applications: [
      { name: 'Residential', icon: 'FaHome' },
      { name: 'Hotels', icon: 'FaHotel' },
      { name: 'Hospitals', icon: 'FaHospital' },
      { name: 'Factories', icon: 'FaIndustry' }
    ],
    benefits: 'Soft water protects your plumbing and appliances from scale damage, reduces soap and detergent usage by up to 50%, and provides better cleaning results. Essential for areas with hard water conditions.'
  },
  {
    id: 6,
    name: 'Electrodeionization (EDI)',
    shortDesc: 'Ultra-pure water for critical applications',
    description: 'Electrodeionization combines ion exchange membranes and ion exchange resins with electrical current to produce ultrapure water continuously. This technology is essential for laboratories, pharmaceutical, and high-tech manufacturing.',
    features: [
      'Continuous operation',
      'No chemical regeneration',
      'Resistivity up to 18 MΩ·cm',
      'Automated monitoring',
      'Environmentally friendly',
      'Consistent water quality'
    ],
    applications: [
      { name: 'Laboratories', icon: 'FaFlask' },
      { name: 'Pharmaceutical', icon: 'FaHospital' },
      { name: 'Semiconductor', icon: 'FaIndustry' },
      { name: 'Power Generation', icon: 'FaIndustry' }
    ],
    benefits: 'EDI produces consistent ultrapure water without the need for hazardous chemical regeneration. It\'s the preferred choice for applications requiring the highest water purity standards with minimal environmental impact.'
  },
  {
    id: 7,
    name: 'Ozone Treatment',
    shortDesc: 'Powerful oxidation and disinfection',
    description: 'Ozone treatment uses ozone gas (O₃) as a powerful oxidizing agent to disinfect water, remove color, odor, and organic contaminants. It\'s one of the most effective methods for water purification and taste improvement.',
    features: [
      'Strongest oxidizing agent',
      'Eliminates bacteria and viruses',
      'Removes taste and odor',
      'Breaks down organic compounds',
      'No chemical residues',
      'Improves water clarity'
    ],
    applications: [
      { name: 'Bottled Water', icon: 'FaIndustry' },
      { name: 'Swimming Pools', icon: 'FaHome' },
      { name: 'Wastewater', icon: 'FaIndustry' },
      { name: 'Food Processing', icon: 'FaIndustry' }
    ],
    benefits: 'Ozone treatment provides superior disinfection and oxidation without leaving harmful byproducts. It improves water taste, odor, and clarity while ensuring complete microbial safety.'
  },
  {
    id: 8,
    name: 'Automated Controls & PLC',
    shortDesc: 'Smart water management systems',
    description: 'Our Programmable Logic Controller (PLC) systems provide intelligent automation for water treatment operations. These systems monitor, control, and optimize treatment processes in real-time for maximum efficiency.',
    features: [
      'Real-time monitoring',
      'Automated process control',
      'Remote access capability',
      'Data logging and reporting',
      'Alarm and alert systems',
      'Energy optimization'
    ],
    applications: [
      { name: 'Industrial Plants', icon: 'FaIndustry' },
      { name: 'Municipal Systems', icon: 'FaHome' },
      { name: 'Large Facilities', icon: 'FaBuilding' },
      { name: 'Commercial Buildings', icon: 'FaIndustry' }
    ],
    benefits: 'Automated controls reduce operational costs, minimize human error, and ensure consistent water quality. Remote monitoring capabilities allow for proactive maintenance and quick response to any system issues.'
  }
];