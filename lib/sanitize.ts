import DOMPurify from 'isomorphic-dompurify'

/**
 * DOMPurifyの共通設定 — 結果HTMLのサニタイズに使用
 */
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'b', 'i', 'u',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'a', 'blockquote', 'pre', 'code',
    'span', 'div', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'figure', 'figcaption', 'dl', 'dt', 'dd', 'hr', 'sup', 'sub',
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
  ],
}

/**
 * 結果HTMLをサニタイズして返す
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, DOMPURIFY_CONFIG)
}
