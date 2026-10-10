import React, { useEffect, useId, useRef, useState } from 'react';
import { useOnClickOutside } from '../../hooks';

export default function SearchableSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Start typing…',
  error,
  required,
  hint,
  className = '',
}) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef(null);
  const inputId = useId();
  const listId = `${inputId}-list`;

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useOnClickOutside(containerRef, () => setOpen(false), open);

  const filtered = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const selectOption = (option) => {
    setQuery(option);
    onChange({ target: { name, value: option } });
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const next = event.target.value;
    setQuery(next);
    setOpen(true);
    setHighlight(0);
    // Clear the committed value while mid-edit, so a half-typed county
    // can't be submitted as if it had actually been chosen from the list.
    if (next !== value) onChange({ target: { name, value: '' } });
  };

  const handleKeyDown = (event) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlight((current) => Math.min(current + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlight((current) => Math.max(current - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (filtered[highlight]) selectOption(filtered[highlight]);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className={`bw-field ${error ? 'bw-field--invalid' : ''} ${className}`} ref={containerRef}>
      {label ? (
        <label className="bw-field__label" htmlFor={inputId}>
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
      ) : null}

      <div className="position-relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-invalid={error ? true : undefined}
          className="bw-field__control"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          required={required}
        />

        {open && filtered.length > 0 ? (
          <ul
            className="bw-menu"
            id={listId}
            role="listbox"
            style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, maxHeight: '220px', overflowY: 'auto' }}
          >
            {filtered.map((option, index) => (
              <li key={option} role="option" aria-selected={option === value}>
                <button
                  type="button"
                  className="bw-menu__item"
                  style={index === highlight ? { backgroundColor: 'var(--bw-surface-tint)' } : undefined}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setHighlight(index)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {open && query.trim() && filtered.length === 0 ? (
          <div className="bw-menu" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0 }}>
            <p className="px-3 py-2 small text-muted mb-0">No matching county</p>
          </div>
        ) : null}
      </div>

      {hint ? <span className="bw-field__hint">{hint}</span> : null}
      {error ? (
        <span className="bw-field__error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}