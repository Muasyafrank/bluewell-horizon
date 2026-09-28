import React, { useId } from 'react';

/**
 * Labelled form control with hint and error slots.
 *
 * Inputs across the checkout, contact and quote forms repeated the same twelve
 * lines of inline styling, and their labels were not tied to their inputs — so
 * clicking a label did nothing and screen readers announced the fields as
 * unlabelled. `Field` wires up `htmlFor`, `aria-describedby` and
 * `aria-invalid` automatically.
 */
export default function Field({
  label,
  name,
  type = 'text',
  as = 'input',
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  optional = false,
  options = [],
  children,
  className = '',
  ...rest
}) {
  const generatedId = useId();
  const id = rest.id || `${name || 'field'}-${generatedId}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const controlProps = {
    id,
    name,
    value: value ?? '',
    onChange,
    onBlur,
    required,
    className: 'bw-field__control',
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    ...rest,
  };

  let control;
  if (as === 'select') {
    control = (
      <select {...controlProps}>
        {children ||
          options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value;
            const optionLabel = typeof option === 'string' ? option : option.label;
            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
      </select>
    );
  } else if (as === 'textarea') {
    control = <textarea rows={rest.rows || 4} {...controlProps} />;
  } else {
    control = <input type={type} {...controlProps} />;
  }

  return (
    <div className={['bw-field', error ? 'bw-field--invalid' : '', className].filter(Boolean).join(' ')}>
      {label ? (
        <label className="bw-field__label" htmlFor={id}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
          {optional ? <span className="bw-field__optional"> (optional)</span> : null}
        </label>
      ) : null}
      {control}
      {hint ? (
        <span className="bw-field__hint" id={hintId}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className="bw-field__error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
