import React from 'react';


export default function CategorySidebar({ categories, active, onSelect, counts, title = 'Product Catalog' }) {
  return (
    <nav className="bw-catalog-sidebar" aria-label="Product categories">
      <div className="bw-catalog-sidebar__header">{title}</div>
      <ul className="bw-catalog-sidebar__list list-unstyled mb-0">
        {categories.map((category) => (
          <li key={category}>
            <button
              type="button"
              className="bw-catalog-sidebar__item"
              aria-current={active === category}
              onClick={() => onSelect(category)}
            >
              <span>{category}</span>
              {counts?.[category] != null ? (
                <span className="bw-catalog-sidebar__count">{counts[category]}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
