import React, { useMemo, useState } from 'react';
import { FaMinus, FaPlus, FaSearch, FaWarehouse } from 'react-icons/fa';
import { adminApi } from '../../../api';
import { Badge, EmptyState, Field, Modal } from '../../../components/ui';
import { Image } from '../../../components/common';
import { toastError, toastSuccess } from '../../../utils/toast';
import { STOCK_ACTIONS, STOCK_LEVELS, nextStock, stockLevel, summariseStock } from '../stock';

const SUMMARY_TILES = [
  { key: 'total', label: 'Total products' },
  { key: 'in', label: 'In stock' },
  { key: 'low', label: 'Low stock' },
  { key: 'out', label: 'Out of stock' },
];

const FILTER_OPTIONS = [
  { value: 'all', label: 'All stock' },
  { value: 'in', label: STOCK_LEVELS.in.label },
  { value: 'low', label: STOCK_LEVELS.low.label },
  { value: 'out', label: STOCK_LEVELS.out.label },
];

/**
 * Stock levels at a glance, with add / remove / set adjustments.
 *
 * Replaces the Inventory tab of the old 6,000-line dashboard. That version
 * built the update request by hand against a hard-coded `localhost:5000` URL,
 * and sent the product's whole record back, including a null price that the
 * server then rejected — so adjusting stock on any catalogue product failed.
 */
export default function InventoryPanel({ products, token, onChanged }) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [adjustment, setAdjustment] = useState(null); // { product, action }
  const [quantity, setQuantity] = useState('');
  const [saving, setSaving] = useState(false);

  const summary = useMemo(() => summariseStock(products), [products]);

  // Lowest stock first, so the products that need attention are at the top.
  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products
      .filter((product) => {
        const matchesSearch =
          !term ||
          product.name?.toLowerCase().includes(term) ||
          product.category?.toLowerCase().includes(term);
        return matchesSearch && (levelFilter === 'all' || stockLevel(product.stock) === levelFilter);
      })
      .sort((a, b) => (Number(a.stock) || 0) - (Number(b.stock) || 0));
  }, [products, search, levelFilter]);

  const openAdjustment = (product, action) => {
    setAdjustment({ product, action });
    setQuantity(action === 'set' ? String(Number(product.stock) || 0) : '');
  };

  const closeAdjustment = () => setAdjustment(null);

  const handleSubmit = async () => {
    const { product, action } = adjustment;
    const stock = nextStock(product.stock, action, quantity);
    if (stock === null) {
      toastError('Enter a whole number that is 0 or more.');
      return;
    }

    setSaving(true);
    try {
      // The server replaces the whole product on update, so send every field.
      await adminApi.updateItem(
        'product',
        product.id,
        {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image,
          stock,
        },
        { token },
      );
      toastSuccess(`${product.name} now has ${stock} in stock`);
      closeAdjustment();
      onChanged();
    } catch (error) {
      toastError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const action = adjustment ? STOCK_ACTIONS[adjustment.action] : null;

  return (
    <>
      <div className="row g-3 mb-4">
        {SUMMARY_TILES.map((tile) => (
          <div className="col-6 col-lg-3" key={tile.key}>
            <div className="bw-card bw-card--tint text-center">
              <p className="bw-stat-tile__value mb-0">{summary[tile.key]}</p>
              <p className="bw-stat-tile__label mb-0">{tile.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3">
        <div>
          <h2 className="h5 mb-1">Inventory</h2>
          <p className="text-muted small mb-0">Monitor and update product stock levels.</p>
        </div>
        <div className="d-flex flex-column flex-md-row gap-2 align-items-md-end">
          <Field
            label="Search inventory"
            name="inventory-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name or category"
            className="mb-0"
          />
          <Field
            label="Stock level"
            name="inventory-level"
            as="select"
            value={levelFilter}
            onChange={(event) => setLevelFilter(event.target.value)}
            options={FILTER_OPTIONS}
            className="mb-0"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<FaSearch />}
          title="No products match"
          description="Try a different search or stock level."
        />
      ) : (
        <div className="bw-table__scroll">
          <table className="bw-table">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Category</th>
                <th scope="col">Stock</th>
                <th scope="col">Status</th>
                <th scope="col">Adjust</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((product) => {
                const level = STOCK_LEVELS[stockLevel(product.stock)];
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Image src={product.image} alt="" className="bw-thumb bw-thumb--sm" />
                        <span className="fw-semibold">{product.name}</span>
                      </div>
                    </td>
                    <td className="small text-muted">{product.category || 'Uncategorised'}</td>
                    <td className="fw-bold">{Number(product.stock) || 0}</td>
                    <td>
                      <Badge tone={level.tone}>{level.label}</Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="bw-icon-btn"
                          aria-label={`Add stock to ${product.name}`}
                          title="Add stock"
                          onClick={() => openAdjustment(product, 'add')}
                        >
                          <FaPlus aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="bw-icon-btn"
                          aria-label={`Remove stock from ${product.name}`}
                          title="Remove stock"
                          onClick={() => openAdjustment(product, 'remove')}
                        >
                          <FaMinus aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="bw-icon-btn"
                          aria-label={`Set stock for ${product.name}`}
                          title="Set stock"
                          onClick={() => openAdjustment(product, 'set')}
                        >
                          <FaWarehouse aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={Boolean(adjustment)}
        onClose={closeAdjustment}
        title={action ? `${action.label}: ${adjustment.product.name}` : ''}
        onSubmit={handleSubmit}
        submitLabel={action ? action.verb : 'Save'}
        submitting={saving}
      >
        {adjustment ? (
          <>
            <p className="text-muted small">
              Current stock: <strong>{Number(adjustment.product.stock) || 0}</strong>
            </p>
            <Field
              label="Quantity"
              name="stock-quantity"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              hint={action.hint}
              required
            />
          </>
        ) : null}
      </Modal>
    </>
  );
}
