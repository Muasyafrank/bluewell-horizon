/**
 * Field definitions for the admin content editor.
 *
 * The dashboard previously carried a separate hand-written modal for each
 * content type — five add forms and five edit forms, each repeating the same
 * label/input/onChange boilerplate, and each with its own copy of the
 * "are we adding or editing?" ternary on every single field. Describing the
 * fields as data means one form component renders them all.
 */
import { ICON_NAMES } from '../../utils/icons';

/** Turns "a\nb\nc" into ['a','b','c'] and back, for list fields. */
const linesToArray = (value) =>
  (value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const arrayToLines = (value) => (Array.isArray(value) ? value.join('\n') : value || '');

export const CONTENT_SCHEMAS = {
  product: {
    label: 'Product',
    plural: 'Products',
    fields: [
      { name: 'name', label: 'Name', required: true, width: 12 },
      { name: 'image', label: 'Image', type: 'image', width: 12 },
      { name: 'price', label: 'Price (KES)', type: 'number', min: 0, required: true, width: 4 },
      { name: 'stock', label: 'Stock', type: 'number', min: 0, required: true, width: 4 },
      { name: 'category', label: 'Category', required: true, width: 4 },
      { name: 'description', label: 'Description', as: 'textarea', rows: 3, required: true, width: 12 },
    ],
    columns: [
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'name', label: 'Name', emphasis: true },
      { key: 'category', label: 'Category', type: 'badge' },
      { key: 'price', label: 'Price', type: 'currency' },
      { key: 'stock', label: 'Stock' },
    ],
  },

  service: {
    label: 'Service',
    plural: 'Services',
    fields: [
      { name: 'title', label: 'Title', required: true, width: 12 },
      { name: 'shortDesc', label: 'Short description', required: true, width: 12, hint: 'One line, shown on the services grid.' },
      { name: 'icon', label: 'Icon', as: 'select', options: ICON_NAMES, required: true, width: 6 },
      { name: 'image', label: 'Image', type: 'image', width: 12 },
      { name: 'description', label: 'Full description', as: 'textarea', rows: 4, required: true, width: 12 },
      {
        name: 'features',
        label: 'What it includes',
        as: 'textarea',
        rows: 4,
        width: 12,
        hint: 'One item per line.',
        toInput: arrayToLines,
        toPayload: linesToArray,
      },
      {
        name: 'applications',
        label: 'Typical applications',
        as: 'textarea',
        rows: 3,
        width: 12,
        hint: 'One per line, written as Name:IconName — for example Hotels:FaBuilding.',
        toInput: (value) =>
          Array.isArray(value) ? value.map((item) => `${item.name}:${item.icon}`).join('\n') : '',
        toPayload: (value) =>
          linesToArray(value).map((line) => {
            const [name, icon] = line.split(':');
            return { name: name?.trim(), icon: icon?.trim() || 'FaBuilding' };
          }),
      },
      { name: 'benefits', label: 'Why clients choose it', as: 'textarea', rows: 2, width: 12 },
    ],
    columns: [
      { key: 'title', label: 'Title', emphasis: true },
      { key: 'shortDesc', label: 'Short description', muted: true },
      { key: 'icon', label: 'Icon', type: 'badge' },
    ],
  },

  technology: {
    label: 'Technology',
    plural: 'Technologies',
    fields: [
      { name: 'name', label: 'Name', required: true, width: 12 },
      { name: 'icon', label: 'Icon', as: 'select', options: ICON_NAMES, required: true, width: 6 },
      { name: 'image', label: 'Image', type: 'image', width: 12 },
      { name: 'description', label: 'Description', as: 'textarea', rows: 3, required: true, width: 12 },
    ],
    columns: [
      { key: 'name', label: 'Name', emphasis: true },
      { key: 'icon', label: 'Icon', type: 'badge' },
    ],
  },

  gallery: {
    label: 'Gallery image',
    plural: 'Gallery',
    fields: [
      { name: 'title', label: 'Title', required: true, width: 12 },
      { name: 'category', label: 'Category', required: true, width: 12 },
      { name: 'image', label: 'Image', type: 'image', width: 12 },
    ],
    columns: [
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'title', label: 'Title', emphasis: true },
      { key: 'category', label: 'Category', type: 'badge' },
    ],
  },

  process: {
    label: 'Process step',
    plural: 'Process steps',
    fields: [
      { name: 'stepNumber', label: 'Step number', type: 'number', min: 1, required: true, width: 4 },
      { name: 'title', label: 'Title', required: true, width: 8 },
      { name: 'description', label: 'Description', as: 'textarea', rows: 3, required: true, width: 12 },
    ],
    columns: [
      { key: 'stepNumber', label: 'Step', type: 'badge' },
      { key: 'title', label: 'Title', emphasis: true },
      { key: 'description', label: 'Description', muted: true },
    ],
  },
};

/** Blank form values for a content type. */
export function emptyValues(type) {
  return CONTENT_SCHEMAS[type].fields.reduce((values, field) => {
    values[field.name] = field.type === 'number' ? '' : '';
    return values;
  }, {});
}

/** Converts a stored record into form values. */
export function toFormValues(type, record) {
  return CONTENT_SCHEMAS[type].fields.reduce((values, field) => {
    const raw = record?.[field.name];
    values[field.name] = field.toInput ? field.toInput(raw) : raw ?? '';
    return values;
  }, {});
}

/** Converts form values into the payload the API expects. */
export function toPayload(type, values) {
  return CONTENT_SCHEMAS[type].fields.reduce((payload, field) => {
    const raw = values[field.name];
    if (field.toPayload) {
      payload[field.name] = field.toPayload(raw);
    } else if (field.type === 'number') {
      payload[field.name] = raw === '' ? null : Number(raw);
    } else {
      payload[field.name] = raw;
    }
    return payload;
  }, {});
}
