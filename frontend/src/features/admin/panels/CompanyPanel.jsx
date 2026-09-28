import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api';
import { Button, Field } from '../../../components/ui';
import { toastError, toastSuccess } from '../../../utils/toast';

const FIELDS = [
  { name: 'aboutUs', label: 'About us', as: 'textarea', rows: 4, width: 12 },
  { name: 'mission', label: 'Mission', as: 'textarea', rows: 5, width: 6 },
  { name: 'vision', label: 'Vision', as: 'textarea', rows: 5, width: 6 },
  { name: 'email', label: 'Email', type: 'email', width: 6 },
  { name: 'website', label: 'Website', width: 6 },
  { name: 'phone1', label: 'Phone 1', width: 4 },
  { name: 'phone2', label: 'Phone 2', width: 4 },
  { name: 'address', label: 'Address', width: 4 },
];

/**
 * Company info editor.
 * Previously PUT to the public read-only `/api/company-info`, which the
 * backend does not accept — saving always failed with 405, silently, because
 * the handler checked `res.ok` but the toast underneath was never reached.
 */
export default function CompanyPanel({ companyInfo, token, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState(companyInfo || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) setValues(companyInfo || {});
  }, [companyInfo, editing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateCompanyInfo(values, { token });
      toastSuccess('Company information updated');
      setEditing(false);
      onChanged();
    } catch (error) {
      toastError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h5 mb-0">Company information</h2>
        <Button
          size="sm"
          variant={editing ? 'outline' : 'primary'}
          onClick={() => setEditing((value) => !value)}
        >
          {editing ? 'Cancel' : 'Edit information'}
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {FIELDS.map((field) => (
            <div className={`col-md-${field.width}`} key={field.name}>
              <Field
                label={field.label}
                name={field.name}
                as={field.as}
                type={field.type}
                rows={field.rows}
                value={values[field.name] || ''}
                onChange={handleChange}
                disabled={!editing}
                className="mb-0"
              />
            </div>
          ))}

          {editing ? (
            <div className="col-12 text-end">
              <Button type="submit" loading={saving} loadingText="Saving">
                Save changes
              </Button>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}
