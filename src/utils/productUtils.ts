import { Product } from '../types/store';

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getProductSlug = (product: { id: string; name: string; sku?: string; slug?: string }): string => {
  if (product.slug && product.slug.trim()) {
    return slugify(product.slug);
  }
  const nameSlug = slugify(product.name);
  return nameSlug || product.id;
};

export const getProductUrl = (product: { id: string; name: string; sku?: string; slug?: string }): string => {
  return `/products/${getProductSlug(product)}`;
};

export const findProductBySlug = (products: Product[], slug: string): Product | undefined => {
  if (!slug || !products || products.length === 0) return undefined;
  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
  
  return products.find((p) => {
    if (p.slug && p.slug.toLowerCase().trim() === cleanSlug) return true;
    if (p.slug && slugify(p.slug) === cleanSlug) return true;
    if (p.id.toLowerCase() === cleanSlug) return true;
    if (slugify(p.name) === cleanSlug) return true;
    if (p.sku && p.sku.toLowerCase() === cleanSlug) return true;
    // Partial id matching if slug ends with -prod-id or is prod-id
    if (cleanSlug.endsWith(`-${p.id.toLowerCase()}`)) return true;
    return false;
  });
};
