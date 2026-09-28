import React, { useEffect, useState } from 'react';
import { Field, Modal } from '../../components/ui';
import ImageUploadField from './ImageUploadField';
import { CONTENT_SCHEMAS, emptyValues, toFormValues, toPayload } from './contentSchemas';

/**
 * One form for all five content types, driven by `contentSchemas`.
 * Replaces ten near-identical hand-written modals.
 */
export default function ContentFormModal({ type, record, open, onClose, onSubmit, token, saving }) {
  const schema = type ? CONTENT_SCHEMAS[type] : null;
  const [values, setValues] = useState({});

  useEffect(() => {
    if (!open || !type) return;
    setValues(record ? toFormValues(type, record) : emptyValues(type));
  }, [open, type, record]);

  if (!schema) return null;

  const setValue = (name, value) => setValues((current) => ({ ...current, [name]: value }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={`${record ? 'Edit' : 'Add'} ${schema.label.toLowerCase()}`}
      submitLabel={record ? 'Save changes' : `Add ${schema.label.toLowerCase()}`}
      submitting={saving}
      onSubmit={() => onSubmit(toPayload(type, values))}
    >
      <div className="row g-3">
        {schema.fields.map((field) => (
          <div className={`col-md-${field.width || 12}`} key={field.name}>
            {field.type === 'image' ? (
              <ImageUploadField
                label={field.label}
                value={values[field.name]}
                token={token}
                onChange={(path) => setValue(field.name, path)}
              />
            ) : (
              <Field
                label={field.label}
                name={field.name}
                as={field.as}
                type={field.type}
                rows={field.rows}
                min={field.min}
                hint={field.hint}
                required={field.required}
                options={field.options}
                value={values[field.name] ?? ''}
                onChange={(event) => setValue(field.name, event.target.value)}
                className="mb-0"
              >
                {field.as === 'select' ? (
                  <>
                    <option value="">Select one</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </>
                ) : undefined}
              </Field>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
