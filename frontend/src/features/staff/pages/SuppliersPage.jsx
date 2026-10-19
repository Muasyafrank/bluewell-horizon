import React, { useState } from 'react';
import { bmsApi } from '../../../api';
import { AsyncSection, Button, Field, Modal } from '../../../components/ui';
import { useApiResource } from '../../../hooks';
import { toastError, toastSuccess } from '../../../utils/toast';
import { useStaff } from '../StaffContext';
import { Empty, PageHead, Tone } from '../ui';

const BLANK = { name: '', contactPerson: '', email: '', phone: '', address: '', kraPin: '', notes: '', isActive: true };
const clean = (v) => (v && String(v).trim() ? String(v).trim() : null);

export default function SuppliersPage() {
  const { token } = useStaff();
  const { data, loading, error, reload } = useApiResource((o) => bmsApi.listSuppliers({ ...o, token }), { deps: [token], initialData: [] });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const open = (supplier) => {
    setEditing(supplier || {});
    setForm(supplier ? { ...BLANK, ...Object.fromEntries(Object.entries(supplier).map(([k, v]) => [k, v ?? ''])) } : BLANK);
  };
  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));

  const save = async () => {
    if (!form.name.trim()) return toastError('Enter the supplier name.');
    const body = {
      name: form.name.trim(), contactPerson: clean(form.contactPerson), email: clean(form.email), phone: clean(form.phone),
      address: clean(form.address), kraPin: clean(form.kraPin), notes: clean(form.notes), isActive: Boolean(form.isActive),
    };
    setSaving(true);
    try {
      if (editing.id) await bmsApi.updateSupplier(editing.id, body, { token });
      else await bmsApi.createSupplier(body, { token });
      toastSuccess('Supplier saved');
      setEditing(null);
      reload();
    } catch (err) {
      toastError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHead title="Suppliers" subtitle="Who you buy from."><Button onClick={() => open(null)}>Add supplier</Button></PageHead>
      <AsyncSection loading={loading} error={error} onRetry={reload}>
        {data.length === 0 ? <Empty>No suppliers yet.</Empty> : (
          <div className="bms-table-wrap">
            <table className="bms-table">
              <thead><tr><th>Supplier</th><th>Contact</th><th>Phone</th><th>Status</th><th /></tr></thead>
              <tbody>
                {data.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}{s.kraPin ? <div className="bms-sub">KRA PIN {s.kraPin}</div> : null}</td>
                    <td>{s.contactPerson || '—'}{s.email ? <div className="bms-sub">{s.email}</div> : null}</td>
                    <td>{s.phone || '—'}</td>
                    <td><Tone tone={s.isActive ? 'success' : 'muted'}>{s.isActive ? 'Active' : 'Inactive'}</Tone></td>
                    <td className="num"><Button size="sm" variant="outline" onClick={() => open(s)}>Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AsyncSection>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit supplier' : 'Add supplier'} onSubmit={save} submitting={saving}>
        <div className="bms-form">
          <Field className="full" label="Name" value={form.name} onChange={set('name')} required />
          <Field label="Contact person" optional value={form.contactPerson} onChange={set('contactPerson')} />
          <Field label="Phone" optional value={form.phone} onChange={set('phone')} />
          <Field label="Email" optional type="email" value={form.email} onChange={set('email')} />
          <Field label="KRA PIN" optional value={form.kraPin} onChange={set('kraPin')} />
          <Field className="full" label="Address" optional value={form.address} onChange={set('address')} />
          <Field className="full" label="Notes" optional as="textarea" rows={2} value={form.notes} onChange={set('notes')} />
          <label className="d-flex align-items-center gap-2 full">
            <input type="checkbox" checked={Boolean(form.isActive)} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
            Active (can receive purchase orders)
          </label>
        </div>
      </Modal>
    </>
  );
}
