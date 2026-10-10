export const PRODUCT_CATEGORIES = [
  "All",
  "Domestic Municipal Water Filters",
  "Domestic & Commercial RO Systems",
  "Water Softeners",
  "Bottling Equipment",
  "UV Disinfection Chambers",
  "Filter Housings",
  "Accessories",
  "RO Membranes",
];

export const REAL_CATEGORIES = PRODUCT_CATEGORIES.filter(
  (category) => category !== "All"
);
