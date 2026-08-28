import DOMPurify from 'dompurify';

/**
 * Strict HTML Sanitizer for user- or admin-entered rich text
 * Removes dangerous tags, attributes, javascript: URIs, and event handlers.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'u', 'p', 'br', 'span', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr', 'a', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:https?|mailto|tel):)|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'style', 'input', 'button', 'svg', 'meta', 'link'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'style'],
  });
}

/**
 * Validates and sanitizes URLs for href and src attributes.
 * Allows only:
 * - https: and http:
 * - mailto:
 * - tel:
 * - Relative paths starting with / or #
 * 
 * Explicitly rejects:
 * - javascript:
 * - data:
 * - vbscript:
 * - null bytes and control chars
 */
export function sanitizeUrl(url?: string | null, fallback = '#'): string {
  if (!url || typeof url !== 'string') return fallback;

  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Reject control characters, null bytes, newlines
  if (/[\u0000-\u001F\u007F-\u009F]/.test(trimmed)) {
    return fallback;
  }

  // Reject dangerous protocols
  const lower = trimmed.toLowerCase().replace(/[\s\r\n\t]/g, '');
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return fallback;
  }

  // Allow relative URLs starting with / or # or ?
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('?')) {
    return trimmed;
  }

  // Allow standard safe protocols
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }

  // If no scheme is present and looks like a relative page slug, allow safe slug
  if (/^[a-zA-Z0-9_\-\.\/]+$/.test(trimmed)) {
    return trimmed;
  }

  return fallback;
}
