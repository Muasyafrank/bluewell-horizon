import React, { useState } from 'react';
import { bmsApi } from '../../../api';
import { AsyncSection, Button, Field, Modal } from '../../../components/ui';
import { useApiResource } from '../../../hooks';
import { toastError, toastSuccess } from '../../../utils/toast';
import { useStaff } from '../StaffContext';
import { PageHead, Tone } from '../ui';

const ROLES = [
  { value: 'admin', label: 'Administrator: everything' },
  { value: 'sales', label: 'Sales: customers and invoices' },
  { value: 'accounts', label: 'Accounts: invoices, payments and reports' },
  { value: 'stores', label: 'Stores: stock, suppliers and purchasing' },
];

export default function TeamPage() {
  const { token, me } = useStaff();
  const { data, loading, error, reload } = useApiResource((o) => bmsApi.listStaff({ ...o, token }), { deps: [token], initialData: [] });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'sales', password: '' });
  const [saving, setSaving] = useState(false);
  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));

  const open = (member) => {
    setEditing(member || {});
    setForm(member ? { name: member.name, email: member.email, role: member.role, password: '' } : { name: '', email: '', role: 'sales', password: '' });
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing.id) {
        const body = { name: form.name.trim(), role: form.role };
        if (form.password) body.password = form.password;
        await bmsApi.updateStaff(editing.id, body, { token });
      } else {
        await bmsApi.createStaff({ name: form.name.trim(), email: form.email.trim(), role: form.role, password: form.password }, { token });
      }
      toastSuccess('Saved');
      setEditing(null);
      reload();
    } catch (err) {
      toastError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (member) => {
    try {
      await bmsApi.updateStaff(member.id, { isActive: !member.isActive }, { token });
      reload();
    } catch (err) {
      toastError(err.message);
    }
  };

  return (
    <>
      <PageHead title="Team" subtitle="Who can sign in, and what each role can open."><Button onClick={() => open(null)}>Add staff member</Button></PageHead>
      <AsyncSection loading={loading} error={error} onRetry={reload}>
        <div className="bms-table-wrap">
          <table className="bms-table">
            <thead><tr><th>Name</th><th>Role</th><th>Status</th><th /></tr></thead>
            <tbody>
              {data.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}{m.id === me.id ? ' (you)' : ''}<div className="bms-sub">{m.email}</div></td>
                  <td>{m.roleLabel}</td>
                  <td><Tone tone={m.isActive ? 'success' : 'muted'}>{m.isActive ? 'Active' : 'Deactivated'}</Tone></td>
                  <td className="num">
                    <Button size="sm" variant="outline" onClick={() => open(m)}>Edit</Button>{' '}
                    {m.id !== me.id && <Button size="sm" variant="outline" onClick={() => toggle(m)}>{m.isActive ? 'Deactivate' : 'Reactivate'}</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AsyncSection>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit staff member' : 'Add staff member'} onSubmit={save} submitting={saving}>
        <div className="bms-form">
          <Field className="full" label="Name" value={form.name} onChange={set('name')} required />
          <Field className="full" label="Email" type="email" value={form.email} onChange={set('email')} disabled={Boolean(editing?.id)} required />
          <Field className="full" label="Role" as="select" options={ROLES} value={form.role} onChange={set('role')} />
          <Field className="full" label={editing?.id ? 'New password' : 'Password'} type="password" autoComplete="new-password" value={form.password}
            onChange={set('password')} required={!editing?.id} optional={Boolean(editing?.id)} hint="At least 12 characters. Share it privately; they can be given a new one at any time." />
        </div>
      </Modal>
    </>
  );
}
