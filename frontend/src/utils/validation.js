/** Shared form validation rules. */

/** Kenyan mobile numbers: 07XXXXXXXX, 01XXXXXXXX, +2547..., +2541... */
const KE_PHONE = /^(?:\+?254|0)(?:7|1)\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidKenyanPhone(value = '') {
  return KE_PHONE.test(value.replace(/[\s-]/g, ''));
}

export function isValidEmail(value = '') {
  return EMAIL.test(value.trim());
}

export function isRequired(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value != null;
}

/**
 * Runs a map of `{ field: validatorFn }` against form values.
 * Returns `{ field: 'message' }` for every field that failed.
 */
export function validate(values, rules) {
  const errors = {};
  Object.entries(rules).forEach(([field, checks]) => {
    for (const { test, message } of checks) {
      if (!test(values[field], values)) {
        errors[field] = message;
        break;
      }
    }
  });
  return errors;
}

export const required = (message = 'This field is required') => ({
  test: isRequired,
  message,
});

export const email = (message = 'Enter a valid email address') => ({
  test: (value) => !value || isValidEmail(value),
  message,
});

export const kenyanPhone = (message = 'Enter a valid Kenyan number, e.g. 0712 345 678') => ({
  test: (value) => !value || isValidKenyanPhone(value),
  message,
});

export const minLength = (length, message) => ({
  test: (value) => !value || String(value).length >= length,
  message: message || `Use at least ${length} characters`,
});
