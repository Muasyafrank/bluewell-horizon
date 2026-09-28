import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaBoxOpen } from 'react-icons/fa';
import { catalogApi } from '../api';
import { useApiResource, useDebouncedValue } from '../hooks';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { SEO } from '../components/common';
import { AsyncSection, Button, EmptyState, Field, Pagination } from '../components/ui';
import ProductCard from '../components/shop/ProductCard';
import CategorySidebar from '../components/shop/CategorySidebar';
import { products as fallbackProducts } from '../data/products';
import { PRODUCT_CATEGORIES } from '../data/categories';
import { toastSuccess } from '../utils/toast';
import { pluralise } from '../utils/format';

const ALL = 'All';
const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'name', label: 'Name: A to Z' },
];
export default function Shop() {
  const { addItem, setQuantity, quantityOf, maxQuantity } = useCart();
  const { isWishlisted, toggleItem: toggleWishlist } = useWishlist();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(ALL);
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 250);

  const { data, loading, error, reload } = useApiResource((options) => catalogApi.listProducts(options), { initialData: null },);
  const products = data?.length ? data : fallbackProducts;
  const usingFallback = Boolean(error) || !data?.length;

  const categories = PRODUCT_CATEGORIES;

  const searchMatched = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (product) => product.name?.toLowerCase().includes(term) || product.description?.toLowerCase().includes(term),
    );
  }, [products, debouncedSearch]);

  const categoryCounts = useMemo(() => {
    const counts = { [ALL]: searchMatched.length };
    searchMatched.forEach((product) => {
      if (!product.category) return;
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    return counts;
  }, [searchMatched]);

  const visibleProducts = useMemo(() => {
    const filtered = category === ALL ? searchMatched : searchMatched.filter((product) => product.category === category);

    if (sort === 'name') {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    return filtered;
  }, [searchMatched, category, sort]);

  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
  const pagedProducts = visibleProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);

  }, [category, debouncedSearch, sort]);

  const handleAdd = (product) => {
    addItem(product);
    toastSuccess(`${product.name} added to your cart`);
  };

  const handleToggleWishlist = (product) => {
    const wasWishlisted = isWishlisted(product.id);
    toggleWishlist(product);
    toastSuccess(wasWishlisted ? `${product.name} removed from your wishlist` : `${product.name} saved to your wishlist`);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory(ALL);
    setSort('featured');
  };

  return (
    <>
      <SEO
        title="Shop"
        description="Browse water purification, disinfection, softening and filtration system with delivery across Kenya"
        path="/shop"
      />
      <section className="bw-page bw-section">
        <div className="container">
          <div className="bw-catalog">
            <CategorySidebar
              categories={categories}
              active={category}
              onSelect={setCategory}
              counts={categoryCounts}
            />

            <div>
              <div className="bw-catalog-header">
                <span className="bw-catalog-header__title">Product Center</span>
                <span className="bw-catalog-header__crumb">Home / Shop / {category}</span>
              </div>

              <div className="bw-catalog-toolbar">
                <div className="bw-catalog-toolbar__search">
                  <Field
                    label="Search products"
                    name="search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Try “reverse osmosis” or “UV”"
                    className="mb-0"
                  />
                </div>
                <div className="bw-catalog-toolbar__sort">
                  <Field
                    label="Sort by"
                    name="sort"
                    as="select"
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    options={SORT_OPTIONS}
                    className="mb-0"
                  />
                </div>
              </div>

              <AsyncSection
                loading={loading && !usingFallback}
                error={null}
                onRetry={reload}
                loadingText="Loading products"
              >
                <p className="small text-muted mb-3" aria-live="polite">
                  {visibleProducts.length} {pluralise(visibleProducts.length, 'product')} in {category}
                </p>

                {visibleProducts.length === 0 ? (
                  <EmptyState
                    icon={<FaSearch />}
                    title="Nothing matches those filters"
                    description="Try a different search term or clear the filters to see the full range."
                    action={
                      <Button variant="outline" onClick={clearFilters}>
                        Clear filters
                      </Button>
                    }
                  />
                ) : (
                  <>
                    <div className="row g-3">
                      {pagedProducts.map((product) => (
                        <div className="col-6 col-lg-3" key={product.id}>
                          <ProductCard
                            product={product}
                            quantity={quantityOf(product.id)}
                            maxQuantity={maxQuantity}
                            onAdd={handleAdd}
                            onSetQuantity={setQuantity}
                            wishlisted={isWishlisted(product.id)}
                            onToggleWishlist={handleToggleWishlist}
                          />
                        </div>
                      ))}
                    </div>

                    <Pagination page={page} pageCount={pageCount} onChange={setPage} />
                  </>
                )}
              </AsyncSection>

              {products.length === 0 ? (
                <EmptyState
                  icon={<FaBoxOpen />}
                  title="The shop is being stocked"
                  description="Products will appear here shortly. In the meantime we can quote for any system directly."
                  action={<Button to="/quote">Request a quote</Button>}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}