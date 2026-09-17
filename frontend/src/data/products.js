// Product data - static content for the shop
export const products = [
  {
    id: 1,
    name: "Commercial Reverse Osmosis (RO) System",
    description: "Advanced water purification system utilizing RO membrane technology to effectively eliminate bacteria, viruses, chemicals, and heavy metals. Perfect for commercial and industrial applications requiring high-purity water.",
    price: 120000,
    category: "Water Purification",
    image: "/images/gallery-1.png",
    stock: 8,
    features: [
      "Advanced RO membrane technology",
      "Eliminates 99% of contaminants",
      "Low maintenance requirements",
      "Energy efficient operation",
      "Compact design"
    ]
  },
  {
    id: 2,
    name: "UV Sterilization System",
    description: "Chemical-free water disinfection using ultraviolet technology to eliminate 99.99% of harmful microorganisms, bacteria, and pathogens. Ensures safe and hygienic water for all applications.",
    price: 35000,
    category: "Water Disinfection",
    image: "/images/gallery-2.png",
    stock: 20,
    features: [
      "Chemical-free disinfection",
      "99.99% pathogen elimination",
      "No change in water taste",
      "Low energy consumption",
      "Easy installation"
    ]
  },
  {
    id: 3,
    name: "Water Softening System",
    description: "Designed to remove hardness minerals (calcium and magnesium), prevent scaling, protect equipment, and improve water efficiency. Features automatic regeneration cycles and durable FRP tanks.",
    price: 85000,
    category: "Water Softening",
    image: "/images/gallery-3.png",
    stock: 10,
    features: [
      "Automatic regeneration",
      "Durable FRP tanks",
      "Prevents scale buildup",
      "Protects equipment",
      "Improves water efficiency"
    ]
  },
  {
    id: 4,
    name: "Multimedia Filtration System",
    description: "Multi-layer filtration system that removes sediment, turbidity, chlorine, and suspended impurities from raw water sources. Ideal for borehole water treatment and industrial pretreatment.",
    price: 65000,
    category: "Filtration",
    image: "/images/gallery-4.png",
    stock: 15,
    features: [
      "Multi-layer filtration",
      "Removes sediment & turbidity",
      "Chlorine reduction",
      "Ideal for borehole water",
      "Industrial pretreatment"
    ]
  },
  {
    id: 5,
    name: "UltraPure Water System (EDI)",
    description: "Advanced Electrodeionization (EDI) systems ensure high-purity water through automated monitoring, efficient filtration, and reliable performance. Ideal for laboratories, pharmaceutical industries, and medical facilities.",
    price: 350000,
    category: "UltraPure Water",
    image: "/images/gallery-5.png",
    stock: 3,
    features: [
      "Electrodeionization technology",
      "Automated monitoring",
      "Ultra-high purity water",
      "Chemical-free regeneration",
      "Continuous operation"
    ]
  },
  {
    id: 6,
    name: "Activated Carbon Filter",
    description: "Uses activated carbon to adsorb chlorine, volatile organic compounds (VOCs), pesticides, and improve taste and odor. Essential for removing chemical contaminants and improving water quality.",
    price: 25000,
    category: "Filtration",
    image: "/images/gallery-6.png",
    stock: 25,
    features: [
      "Activated carbon media",
      "Chlorine removal",
      "VOC elimination",
      "Improves taste & odor",
      "Long service life"
    ]
  }
];

// Product categories for filtering
export const productCategories = [
  "All",
  "Water Purification",
  "Water Disinfection",
  "Water Softening",
  "Filtration",
  "UltraPure Water"
];