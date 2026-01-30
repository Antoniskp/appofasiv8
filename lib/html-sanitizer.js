/**
 * Simple HTML sanitizer for article content
 * Allows only safe formatting tags to prevent XSS while supporting common HTML formatting
 */

// Allowed HTML tags for article content
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'strong', 'b', 'em', 'i', 'u', 's', 'mark',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td'
];

// Allowed attributes per tag
const ALLOWED_ATTRIBUTES = {
  'a': ['href', 'title', 'target', 'rel'],
  'span': ['class'],
  'div': ['class'],
  'th': ['colspan', 'rowspan'],
  'td': ['colspan', 'rowspan']
};

/**
 * Sanitizes HTML content by removing dangerous tags and attributes
 * @param {string} html - The HTML string to sanitize
 * @returns {string} - Sanitized HTML string
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Create a temporary DOM element to parse HTML
  if (typeof window === 'undefined') {
    // Server-side: return as-is (will be sanitized on client)
    return html;
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const sanitized = sanitizeNode(doc.body);
  
  return sanitized.innerHTML;
}

/**
 * Recursively sanitize a DOM node
 * @param {Node} node - The DOM node to sanitize
 * @returns {Node} - Sanitized DOM node
 */
function sanitizeNode(node) {
  const result = document.createElement('div');
  
  Array.from(node.childNodes).forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      // Keep text nodes as-is
      result.appendChild(child.cloneNode(true));
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const tagName = child.tagName.toLowerCase();
      
      if (ALLOWED_TAGS.includes(tagName)) {
        const newElement = document.createElement(tagName);
        
        // Copy allowed attributes
        const allowedAttrs = ALLOWED_ATTRIBUTES[tagName] || [];
        Array.from(child.attributes).forEach(attr => {
          if (allowedAttrs.includes(attr.name)) {
            // Special handling for links
            if (tagName === 'a' && attr.name === 'href') {
              const href = attr.value;
              // Only allow http, https, and mailto protocols
              if (href.match(/^(https?:\/\/|mailto:)/i)) {
                newElement.setAttribute(attr.name, attr.value);
              }
            } else {
              newElement.setAttribute(attr.name, attr.value);
            }
          }
        });
        
        // For links, ensure they open in new tab and have noopener noreferrer
        if (tagName === 'a') {
          newElement.setAttribute('target', '_blank');
          newElement.setAttribute('rel', 'noopener noreferrer');
        }
        
        // Recursively sanitize children
        const sanitizedChild = sanitizeNode(child);
        Array.from(sanitizedChild.childNodes).forEach(grandChild => {
          newElement.appendChild(grandChild);
        });
        
        result.appendChild(newElement);
      } else {
        // Disallowed tag: preserve its text content
        const sanitizedChild = sanitizeNode(child);
        Array.from(sanitizedChild.childNodes).forEach(grandChild => {
          result.appendChild(grandChild);
        });
      }
    }
  });
  
  return result;
}

/**
 * React component to safely render HTML content
 * @param {Object} props - Component props
 * @param {string} props.html - HTML content to render
 * @param {string} props.className - Optional CSS class name
 * @returns {JSX.Element}
 */
export function SafeHtml({ html, className = '' }) {
  const sanitized = sanitizeHtml(html);
  
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
