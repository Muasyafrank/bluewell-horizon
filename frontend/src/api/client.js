/**
 * Central HTTP client.
 *
 * Previously every component built its own `fetch` call against a hard-coded
 * `http://localhost:5000` URL and read `data.message` for errors — a field the
 * FastAPI backend never sends (it uses `detail`). Both problems are solved here
 * once: the base URL comes from the environment and error payloads are
 * normalised into a single ApiError shape.
 */

export const API_BASE_URL = (
  process.env.REACT_APP_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

/**
 * Turns a stored image path into a URL the browser can load.
 *
 * Only `/uploads/...` (and legacy `/static/...`) paths are backend-hosted —
 * those get the API origin prepended. Everything else, including every
 * `/images/...` path, is one of the frontend's own bundled assets (fallback
 * product photos, seeded demo content, banner images) and is left as a
 * plain relative path so the browser resolves it against the frontend
 * itself. The two used to share the `/images/` prefix, which meant a
 * bundled asset like `/images/gallery-1.png` was incorrectly rewritten to
 * `{API_BASE_URL}/images/gallery-1.png` — a URL that 404s, since that file
 * only exists in the frontend's own public folder, not on the API server.
 */
export function assetUrl(path, fallback = '/images/placeholder.png') {
  if (!path) return fallback;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/uploads/') || path.startsWith('/static/')) {
    return `${API_BASE_URL}${path}`;
  }
  return path;
}

export class ApiError extends Error {
  constructor(message, { status = 0, data = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }

  get isUnauthorized() {
    return this.status === 401 || this.status === 403;
  }

  get isNetworkError() {
    return this.status === 0;
  }
}

/** FastAPI reports errors as `detail`, which may be a string or a list. */
function extractMessage(payload, status) {
  const detail = payload?.detail ?? payload?.message;

  if (typeof detail === 'string' && detail.trim()) return detail;

  if (Array.isArray(detail) && detail.length) {
    // Pydantic validation errors: [{ loc: [...], msg: '...' }]
    return detail
      .map((item) => {
        const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : null;
        return field ? `${field}: ${item.msg}` : item.msg;
      })
      .filter(Boolean)
      .join(', ');
  }

  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to do that.';
  if (status === 404) return 'We could not find what you were looking for.';
  if (status >= 500) return 'The server ran into a problem. Please try again shortly.';
  return 'Something went wrong. Please try again.';
}

async function parseBody(response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    return text || null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Performs a request against the API.
 *
 * @param {string} path      Path beginning with `/api/...`
 * @param {object} options
 * @param {string} [options.method]
 * @param {object|FormData} [options.body]  Serialised as JSON unless FormData.
 * @param {string} [options.token]          Bearer token, when authenticated.
 * @param {AbortSignal} [options.signal]
 */
export async function request(path, { method = 'GET', body, token, signal, headers = {} } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const requestHeaders = { ...headers };

  if (token) requestHeaders.Authorization = `Bearer ${token}`;
  if (body !== undefined && !isFormData) requestHeaders['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: requestHeaders,
      signal,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Cannot reach the server. Check your connection and try again.', {
      status: 0,
    });
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(extractMessage(payload, response.status), {
      status: response.status,
      data: payload,
    });
  }

  return payload;
}

export const http = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
