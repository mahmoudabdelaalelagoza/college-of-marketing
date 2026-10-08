import { useEffect } from 'react';

/** Public origin used for canonical URLs and social metadata. */
const SITE_URL = 'https://kentbusinesscollege.co.uk';

const BRAND = 'Kent Business College';

export interface SeoConfig {
  /** Page title, without the brand suffix. */
  title: string;
  /** Meta description, ideally 120-160 characters. */
  description: string;
  /** Absolute site path, e.g. `/courses`. */
  path: string;
  /** Optional JSON-LD graph for rich results. */
  jsonLd?: unknown;
  /** Keeps the page out of search indexes (used by the staff dashboard). */
  noIndex?: boolean;
}

/**
 * Single source of truth for per-page metadata.
 *
 * The app is a client-rendered SPA, so every route otherwise inherits the
 * static tags in index.html. Applying them on navigation gives each page its
 * own title, description and canonical URL.
 */
export function useSeo(config: SeoConfig): void {
  const { title, description, path, jsonLd, noIndex } = config;

  useEffect(() => {
    const fullTitle = title.includes(BRAND) ? title : `${title} | ${BRAND}`;
    document.title = fullTitle;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    setLink('canonical', `${SITE_URL}${path}`);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `${SITE_URL}${path}`);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:locale', 'en_GB');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);

    const scriptId = 'page-structured-data';
    document.getElementById(scriptId)?.remove();
    if (!jsonLd) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = scriptId;
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }, [title, description, path, jsonLd, noIndex]);
}

function setMeta(kind: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${kind}="${key}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(kind, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setLink(rel: string, href: string): void {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}
