import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export default function CategorySidebar({
  categories,
  active,
  onSelect,
  counts,
  title = 'Product Catalog',
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (category) => {
    onSelect(category);

    // Close the menu after selecting a category on smaller screens.
    setOpen(false);
  };

  return (
    <nav className="bw-catalog-sidebar" aria-label="Product categories">
      {/* Mobile / tablet toggle */}
      <button
        type="button"
        className="bw-catalog-sidebar__toggle"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="product-category-list"
      >
        <span>{title}</span>

        <FaChevronDown
          className={`bw-catalog-sidebar__toggle-icon ${
            open ? 'is-open' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Desktop header */}
      <div className="bw-catalog-sidebar__header">
        {title}
      </div>

      <div
        id="product-category-list"
        className={`bw-catalog-sidebar__content ${
          open ? 'is-open' : ''
        }`}
      >
        <ul className="bw-catalog-sidebar__list list-unstyled mb-0">
          {categories.map((category) => (
            <li key={category}>
              <button
                type="button"
                className={`bw-catalog-sidebar__item ${
                  active === category ? 'is-active' : ''
                }`}
                aria-current={active === category ? 'page' : undefined}
                onClick={() => handleSelect(category)}
              >
                <span>{category}</span>

                {counts?.[category] != null ? (
                  <span className="bw-catalog-sidebar__count">
                    {counts[category]}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}