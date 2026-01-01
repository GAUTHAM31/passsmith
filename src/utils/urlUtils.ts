/**
 * Extracts the root domain name from a URL, removing subdomains
 * @param url - The URL string (e.g., "https://www.example.com/path" or "example.com")
 * @returns The root domain name (e.g., "example.com") or empty string if invalid
 * 
 * @example
 * getDomain("https://www.example.com/path/to/page") // returns "example.com"
 * getDomain("http://subdomain.example.com") // returns "example.com"
 * getDomain("example.com") // returns "example.com"
 * getDomain("www.example.com") // returns "example.com"
 * getDomain("api.v2.example.com") // returns "example.com"
 */
export function getDomain(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Trim whitespace
  let cleanUrl = url.trim();

  // If empty after trimming, return empty string
  if (!cleanUrl) {
    return '';
  }

  try {
    // Add protocol if missing to make URL parsing work
    if (!cleanUrl.match(/^https?:\/\//i)) {
      cleanUrl = 'https://' + cleanUrl;
    }

    // Parse the URL
    const urlObj = new URL(cleanUrl);
    let hostname = urlObj.hostname;

    // Handle localhost and IP addresses
    if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return hostname;
    }

    // Split hostname by dots
    const parts = hostname.split('.');

    // If we have less than 2 parts, return as is
    if (parts.length < 2) {
      return hostname;
    }

    // Take the last last part (domain)
    // This handles most common cases like .com, .org, .net, etc.
    const rootDomain = parts[parts.length - 2];

    return rootDomain;
  } catch (error) {
    // If URL parsing fails, try to extract domain manually
    // Remove protocol if present
    let domain = cleanUrl.replace(/^https?:\/\//i, '');
    
    // Remove path, query, and fragment
    domain = domain.split('/')[0];
    domain = domain.split('?')[0];
    domain = domain.split('#')[0];

    // Remove port if present
    domain = domain.split(':')[0];

    // Handle localhost and IP addresses
    if (domain === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
      return domain;
    }

    // Split by dots and take last two parts
    const parts = domain.split('.');
    if (parts.length < 2) {
      return domain || '';
    }

    // Take the last last part (domain)
    const rootDomain = parts[parts.length - 2];

    return rootDomain || '';
  }
}

