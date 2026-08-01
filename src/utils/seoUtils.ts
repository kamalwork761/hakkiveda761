export const slugify = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_]+/g, '-')  // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
};

export const getProductUrl = (product: { id: string; name: string }): string => {
  const slug = slugify(product.name) || product.id;
  return `/products/${slug}`;
};

export const getCategoryUrl = (category: { id: string; name: string; slug?: string }): string => {
  const slug = category.slug || slugify(category.name) || category.id;
  return `/categories/${slug}`;
};

export const getBlogUrl = (blog: { id: string; title: string }): string => {
  const slug = slugify(blog.title) || blog.id;
  return `/journal/${slug}`;
};
