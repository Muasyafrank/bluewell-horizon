import React, { useState } from 'react';
import { FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import { adminApi } from '../../../api';
import { Badge, Button, Modal } from '../../../components/ui';
import { Image } from '../../../components/common';
import { formatCurrency } from '../../../utils/format';
import { toastError, toastSuccess } from '../../../utils/toast';
import ContentFormModal from '../ContentFormModal';
import { CONTENT_SCHEMAS } from '../contentSchemas';

function CellValue({ column, item }) {
  const value = item[column.key];
  if (column.type === 'image') return <Image src={value} alt="" className="bw-thumb bw-thumb--sm" />;
  if (column.type === 'currency') return <span>{formatCurrency(value)}</span>;
  if (column.type === 'badge') return <Badge tone="neutral">{value}</Badge>;
  return <span className={column.muted ? 'text-muted small' : column.emphasis ? 'fw-semibold' : ''}>{value}</span>;
}

/**
 * Generic list + create/edit/delete panel for a content type.
 * Replaces five separate hand-written table + modal pairs in the old
 * dashboard, one per content type, that differed only in field names.
 */
export default function ContentPanel({ type, items, token, onChanged }) {
  const schema = CONTENT_SCHEMAS[type];
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateItem(type, editing.id, payload, { token });
        toastSuccess(`${schema.label} updated`);
      } else {
        await adminApi.createItem(type, payload, { token });
        toastSuccess(`${schema.label} added`);
      }
      setFormOpen(false);
      onChanged();
    } catch (error) {
      toastError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteItem(type, deleting.id, { token });
      toastSuccess(`${schema.label} deleted`);
      setDeleting(null);
      onChanged();
    } catch (error) {
      toastError(error.message);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Manage {schema.plural.toLowerCase()}</h2>
        <Button size="sm" icon={<FaPlus aria-hidden="true" />} onClick={openAdd}>
          Add {schema.label.toLowerCase()}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-muted text-center py-5 mb-0">
          No {schema.plural.toLowerCase()} yet. Add the first one to publish it on the site.
        </p>
      ) : (
        <div className="bw-table__scroll">
          <table className="bw-table">
            <thead>
              <tr>
                {schema.columns.map((column) => (
                  <th key={column.key} scope="col">
                    {column.label}
                  </th>
                ))}
                <th scope="col" style={{ width: '150px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {schema.columns.map((column) => (
                    <td key={column.key}>
                      <CellValue column={column} item={item} />
                    </td>
                  ))}
                  <td>
                    <div className="d-flex gap-2">
                      <button type="button" className="bw-icon-btn" aria-label={`View ${item.name || item.title}`} onClick={() => setViewing(item)}>
                        <FaEye />
                      </button>
                      <button type="button" className="bw-icon-btn" aria-label={`Edit ${item.name || item.title}`} onClick={() => openEdit(item)}>
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="bw-icon-btn bw-icon-btn--danger"
                        aria-label={`Delete ${item.name || item.title}`}
                        onClick={() => setDeleting(item)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ContentFormModal
        type={type}
        record={editing}
        open={formOpen}
        saving={saving}
        token={token}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={viewing?.name || viewing?.title || schema.label}>
        {viewing ? (
          <dl className="row mb-0">
            {Object.entries(viewing)
              .filter(([key]) => key !== 'id')
              .map(([key, value]) => (
                <React.Fragment key={key}>
                  <dt className="col-4 small text-muted fw-normal text-capitalize">{key}</dt>
                  <dd className="col-8">{typeof value === 'object' ? JSON.stringify(value) : String(value ?? '—')}</dd>
                </React.Fragment>
              ))}
          </dl>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title={`Delete this ${schema.label.toLowerCase()}?`}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="mb-0">
          This removes “{deleting?.name || deleting?.title}” from the site immediately. This cannot be
          undone.
        </p>
      </Modal>
    </>
  );
}
