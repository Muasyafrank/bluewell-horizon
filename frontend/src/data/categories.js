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

/** Short names for the tag on a product card; the full name stays in the sidebar. */
const SHORT_CATEGORY_NAMES = {
  "Domestic Municipal Water Filters": "Municipal filters",
  "Domestic & Commercial RO Systems": "RO systems",
  "Water Softeners": "Softeners",
  "Bottling Equipment": "Bottling",
  "UV Disinfection Chambers": "UV disinfection",
  "Filter Housings": "Filter housings",
  "Accessories": "Accessories",
  "RO Membranes": "RO membranes",
};

export const shortCategoryName = (category) => SHORT_CATEGORY_NAMES[category] || category;
