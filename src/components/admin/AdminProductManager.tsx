import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Copy,
  Layers,
  Sparkles,
  DollarSign,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  FileText,
  Sliders,
  Share2,
  Link2,
  Star,
  Flame,
  ArrowUpDown,
  X,
  Check,
  Globe,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Product, ProductVariant, Category } from '../../types/store';
import { AdminProductGalleryEditor } from './AdminProductGalleryEditor';
import { AdminProductVariantsEditor } from './AdminProductVariantsEditor';
import { AdminProductSectionsEditor } from './AdminProductSectionsEditor';
import { AdminProductSeoEditor } from './AdminProductSeoEditor';
import { AdminProductRelatedEditor } from './AdminProductRelatedEditor';
import { AdminProductPreviewModal } from './AdminProductPreviewModal';
import { slugify, getProductUrl } from '../../utils/productUtils';

interface AdminProductManagerProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (prod: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onShowToast: (msg: string) => void;
  formatINR: (val: number) => string;
}

type EditorTab = 'basic' | 'gallery' | 'variants' | 'sections' | 'related' | 'seo';

export const AdminProductManager: React.FC<AdminProductManagerProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onShowToast,
  formatINR,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [badgeFilter, setBadgeFilter] = useState<'ALL' | 'BESTSELLER' | 'NEW'>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'order'>('order');

  // Modal states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState<EditorTab>('basic');
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  // New Product Draft State
  const defaultNewProduct: Omit<Product, 'id'> = {
    name: '',
    category: categories[0]?.name || 'Hair Care',
    primaryCategory: 'hair-care',
    subtitle: '',
    priceINR: 1499,
    originalPriceINR: 1999,
    rating: 4.9,
    reviewsCount: 24,
    image: 'https://images.unsplash.com/photo-1608248597359-00f722a44a95?auto=format&fit=crop&q=80&w=800',
    additionalImages: [],
    description: '',
    shortDescription: '',
    fullDescription: '',
    benefits: [
      'Stops severe hair fall & root shedding within 14 nights',
      'Infused with 42 rare Nilgiri wild mountain roots & herbs',
      'Stimulates dormant hair follicles for natural new regrowth',
    ],
    ingredients: ['Bhringraj', 'Amla', 'Nilgiri Mountain Herb', 'Virgin Sesame Oil', 'Brahmi'],
    volume: '200 ml',
    usageRitual: 'Apply gently on scalp at bedtime and massage in circular motion.',
    howToUse: [
      'Take 5-10 ml of warm oil into palms',
      'Massage deeply into roots and scalp for 5 minutes',
      'Leave overnight or for at least 2 hours before bathing',
    ],
    whoItIsFor: [
      'Individuals suffering from severe crown thinning or receding hairline',
      'Men and women dealing with stress-induced excessive shedding',
    ],
    safetyPrecautions: ['Patch test recommended prior to first use', 'External application only'],
    storageInstructions: 'Store in a cool dry place away from direct sunlight',
    shippingAndDelivery: 'Dispatched within 24-48 hours via Shiprocket express delivery.',
    returnsPolicy: '7-day replacement guarantee if seal is broken or damaged in transit.',
    countryOfOrigin: 'India (Mysore & Nilgiri Mountain Reserves)',
    stock: 100,
    sku: 'HKV-NEW-01',
    isBestseller: false,
    isNew: true,
    inStock: true,
    displayOrder: products.length + 1,
    status: 'ACTIVE',
    productAttributes: [
      { label: 'Formulation Type', value: '100% Cold-Pressed Ayurvedic Extraction' },
      { label: 'Shelf Life', value: '24 Months from MFD' },
      { label: 'Aroma', value: 'Earthy Wild Jungle Herbs & Vetiver' },
      { label: 'Suitable For', value: 'All Scalp Types (Men & Women)' },
    ],
  };

  const [newProductForm, setNewProductForm] = useState<Omit<Product, 'id'>>(defaultNewProduct);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          !searchTerm ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;

        let matchesStock = true;
        if (stockFilter === 'IN_STOCK') matchesStock = p.inStock && p.stock > 10;
        if (stockFilter === 'LOW_STOCK') matchesStock = p.inStock && p.stock > 0 && p.stock <= 10;
        if (stockFilter === 'OUT_OF_STOCK') matchesStock = !p.inStock || p.stock <= 0;

        let matchesBadge = true;
        if (badgeFilter === 'BESTSELLER') matchesBadge = p.isBestseller;
        if (badgeFilter === 'NEW') matchesBadge = p.isNew;

        return matchesSearch && matchesCat && matchesStock && matchesBadge;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return a.priceINR - b.priceINR;
        if (sortBy === 'stock') return b.stock - a.stock;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (a.displayOrder || 0) - (b.displayOrder || 0);
      });
  }, [products, searchTerm, selectedCategory, stockFilter, badgeFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = products.length;
    const bestsellers = products.filter((p) => p.isBestseller).length;
    const outOfStock = products.filter((p) => !p.inStock || p.stock <= 0).length;
    const multiVariant = products.filter((p) => p.variants && p.variants.length > 0).length;
    return { total, bestsellers, outOfStock, multiVariant };
  }, [products]);

  // Handle Edit Save
  const handleSaveEditingProduct = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!editingProduct) return;

    onUpdateProduct(editingProduct.id, editingProduct);
    onShowToast(`Formulation "${editingProduct.name}" updated successfully!`);
    setEditingProduct(null);
  };

  // Handle Create Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) {
      onShowToast('Product Title is required.');
      return;
    }

    onAddProduct(newProductForm);
    onShowToast(`New formulation "${newProductForm.name}" created!`);
    setIsCreatingNew(false);
    setNewProductForm(defaultNewProduct);
  };

  // Handle Duplicate
  const handleDuplicate = (p: Product) => {
    const cloned: Omit<Product, 'id'> = {
      ...p,
      name: `${p.name} (Copy)`,
      sku: `${p.sku || 'PROD'}-COPY-${Math.floor(Math.random() * 1000)}`,
      slug: `${slugify(p.name)}-copy`,
      isNew: true,
      displayOrder: (p.displayOrder || 0) + 1,
    };
    onAddProduct(cloned);
    onShowToast(`Duplicated formulation "${p.name}"`);
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Top Header & Quick Add */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--brand-primary-deep,#07150E)] border border-[var(--brand-gold,#D4AF37)]/30 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-slate-100">
              Product Detail Page & Catalog Manager
            </h1>
            <span className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Phase 3 Live
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Configure formulation stories, multi-angle galleries, volume variants, ritual accordions, and SEO meta tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setNewProductForm(defaultNewProduct);
              setIsCreatingNew(true);
            }}
            className="bg-[var(--brand-gold)] hover:bg-white text-[var(--brand-primary-dark)] px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Formulation</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 p-3.5 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Formulations</span>
          <div className="text-2xl font-bold text-slate-100 font-mono mt-0.5">{stats.total}</div>
        </div>
        <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 p-3.5 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-amber-400">Featured Best Sellers</span>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-0.5">{stats.bestsellers}</div>
        </div>
        <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 p-3.5 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-cyan-400">Multi-Pack Variants</span>
          <div className="text-2xl font-bold text-cyan-300 font-mono mt-0.5">{stats.multiVariant}</div>
        </div>
        <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 p-3.5 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-rose-400">Out of Stock</span>
          <div className="text-2xl font-bold text-rose-300 font-mono mt-0.5">{stats.outOfStock}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[var(--brand-primary-deep,#07150E)] border border-white/10 p-4 rounded-2xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search formulations by name, category, or SKU..."
              className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 rounded-xl pl-9 pr-3 py-2 text-slate-100 placeholder-slate-500 focus:border-[var(--brand-gold)]"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 rounded-xl px-3 py-2 text-slate-100"
            >
              <option value="ALL">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 rounded-xl px-3 py-2 text-slate-100"
            >
              <option value="ALL">All Stock Statuses</option>
              <option value="IN_STOCK">In Stock (&gt; 10)</option>
              <option value="LOW_STOCK">Low Stock (1–10)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0)</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[var(--brand-primary-dark,#0B1D13)] border border-white/20 rounded-xl px-3 py-2 text-slate-100"
            >
              <option value="order">Sort: Display Order</option>
              <option value="name">Sort: Alphabetical</option>
              <option value="price">Sort: Price (Low to High)</option>
              <option value="stock">Sort: Stock Quantity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => {
          const gallery = [p.image, ...(p.additionalImages || [])].filter(Boolean);
          const hasVariants = p.variants && p.variants.length > 0;
          const isOutOfStock = !p.inStock || p.stock <= 0;

          return (
            <div
              key={p.id}
              className="bg-[var(--brand-primary-dark,#0B1D13)] border border-white/15 hover:border-[var(--brand-gold)]/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-md group relative"
            >
              <div>
                <div className="flex gap-3.5 items-start">
                  {/* Thumbnail & Gallery Count Badge */}
                  <div className="relative shrink-0 w-24 h-24 bg-black/40 border border-white/10 rounded-xl overflow-hidden p-1 flex items-center justify-center">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                    {gallery.length > 1 && (
                      <span className="absolute bottom-1 right-1 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow">
                        {gallery.length} Photos
                      </span>
                    )}
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-[var(--brand-gold)] uppercase font-bold tracking-wider">
                        {p.category}
                      </span>
                      {p.isBestseller && (
                        <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 fill-current" />
                          <span>Bestseller</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-100 line-clamp-2 leading-snug">
                      {p.name}
                    </h4>

                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-xs font-bold font-mono text-emerald-400">
                        {formatINR(p.priceINR)}
                      </span>
                      {p.originalPriceINR && p.originalPriceINR > p.priceINR && (
                        <span className="text-[10px] text-slate-500 line-through font-mono">
                          {formatINR(p.originalPriceINR)}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>SKU: {p.sku}</span>
                      <span>•</span>
                      <span className={isOutOfStock ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {isOutOfStock ? 'Out of Stock' : `Stock: ${p.stock}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtitle / Short Description Excerpt */}
                {p.subtitle && (
                  <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-2.5 pt-2 border-t border-white/10">
                    "{p.subtitle}"
                  </p>
                )}

                {/* Variants Preview Badges */}
                {hasVariants && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    <span className="text-[10px] text-slate-500 font-semibold">Packs:</span>
                    {p.variants?.slice(0, 3).map((v) => (
                      <span
                        key={v.id}
                        className="bg-black/40 border border-white/10 text-slate-300 text-[9px] px-1.5 py-0.5 rounded font-mono"
                      >
                        {v.name}
                      </span>
                    ))}
                    {(p.variants?.length || 0) > 3 && (
                      <span className="text-[9px] text-[var(--brand-gold)] font-bold">
                        +{(p.variants?.length || 0) - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewProduct(p)}
                  className="bg-black/40 hover:bg-black/80 text-[var(--brand-gold)] hover:text-white border border-[var(--brand-gold)]/30 hover:border-[var(--brand-gold)] px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-[11px]"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview PDP</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(p);
                      setActiveEditorTab('basic');
                    }}
                    className="bg-[var(--brand-gold)] hover:bg-white text-[var(--brand-primary-dark)] px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1 transition-all text-[11px]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Manage PDP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(p)}
                    className="p-1.5 text-slate-400 hover:text-white bg-black/30 hover:bg-black/60 rounded-xl"
                    title="Duplicate Formulation"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete product formulation "${p.name}"?`)) {
                        onDeleteProduct(p.id);
                        onShowToast('Product deleted');
                      }
                    }}
                    className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 rounded-xl"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
          <div className="bg-[var(--brand-primary-dark,#0B1D13)] border border-[var(--brand-gold,#D4AF37)] rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 bg-[var(--brand-primary-deep,#07150E)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-serif-luxury text-slate-100 line-clamp-1">
                    Manage PDP: {editingProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span>SKU: {editingProduct.sku}</span>
                    <span>•</span>
                    <span className="text-[var(--brand-gold)]">{editingProduct.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewProduct(editingProduct)}
                  className="bg-black/50 hover:bg-black/80 text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 text-xs transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Live Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-slate-400 hover:text-white bg-white/10 p-2 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Editor Navigation Tabs */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-white/10 bg-black/40 overflow-x-auto text-xs shrink-0">
              <button
                type="button"
                onClick={() => setActiveEditorTab('basic')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeEditorTab === 'basic'
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>1. General & Pricing</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditorTab('gallery')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeEditorTab === 'gallery'
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>2. Image Gallery</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditorTab('variants')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeEditorTab === 'variants'
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>3. Variants & Packs ({editingProduct.variants?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditorTab('sections')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeEditorTab === 'sections'
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>4. PDP Sections & Rituals</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditorTab('related')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeEditorTab === 'related'
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>5. Cross-Sell</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditorTab('seo')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                  activeEditorTab === 'seo'
                    ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>6. SEO & Social</span>
              </button>
            </div>

            {/* Modal Body Tab Content */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
              {/* Tab 1: General & Pricing */}
              {activeEditorTab === 'basic' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-bold mb-1">Product Title *</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100 font-bold text-sm focus:border-[var(--brand-gold)]"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Catalog Category *</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-amber-300 font-bold mb-1">Primary Dedicated Category *</label>
                      <select
                        value={editingProduct.primaryCategory || 'hair-care'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, primaryCategory: e.target.value as any })}
                        className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-amber-500/50 p-2.5 rounded-xl text-amber-300 font-bold"
                      >
                        <option value="hair-care">Hair Care (/hair-care)</option>
                        <option value="skin-care">Skin Care (/skin-care)</option>
                        <option value="tribal-wellness">Tribal Wellness (/tribal-wellness)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-emerald-400 font-bold mb-1">Base Price (INR ₹) *</label>
                      <input
                        type="number"
                        value={editingProduct.priceINR}
                        onChange={(e) => setEditingProduct({ ...editingProduct, priceINR: Number(e.target.value) })}
                        className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-emerald-500/40 p-2.5 rounded-xl text-emerald-400 font-bold font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">MRP / Strikethrough Price (INR ₹)</label>
                      <input
                        type="number"
                        value={editingProduct.originalPriceINR || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, originalPriceINR: Number(e.target.value) })}
                        className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100 font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">SKU Code *</label>
                      <input
                        type="text"
                        value={editingProduct.sku}
                        onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value.toUpperCase() })}
                        className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Base Stock Quantity *</label>
                      <input
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                        className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Net Quantity / Volume</label>
                      <input
                        type="text"
                        value={editingProduct.volume || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value })}
                        placeholder="e.g. 200 ml or 150 g"
                        className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Display Sort Order</label>
                      <input
                        type="number"
                        value={editingProduct.displayOrder || 1}
                        onChange={(e) => setEditingProduct({ ...editingProduct, displayOrder: Number(e.target.value) })}
                        className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100 font-mono"
                      />
                    </div>

                    {/* Checkboxes & Badges */}
                    <div className="sm:col-span-2 pt-2 border-t border-white/10 flex items-center gap-6 flex-wrap">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.inStock !== false}
                          onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                          className="accent-[var(--brand-gold)] w-4 h-4"
                        />
                        <span className="font-bold text-slate-200">Active / In Stock</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.isBestseller || false}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })}
                          className="accent-[var(--brand-gold)] w-4 h-4"
                        />
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 fill-current" />
                          <span>Best Seller Badge</span>
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.isNew || false}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                          className="accent-[var(--brand-gold)] w-4 h-4"
                        />
                        <span className="font-bold text-emerald-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>New Launch Badge</span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Image Gallery */}
              {activeEditorTab === 'gallery' && (
                <div className="animate-fadeIn">
                  <AdminProductGalleryEditor
                    images={[editingProduct.image, ...(editingProduct.additionalImages || [])].filter(Boolean)}
                    galleryItems={editingProduct.galleryItems}
                    onChange={(newImages, newGalleryItems) => {
                      setEditingProduct({
                        ...editingProduct,
                        image: newImages[0] || '',
                        additionalImages: newImages.slice(1),
                        galleryItems: newGalleryItems,
                      });
                    }}
                    onShowToast={onShowToast}
                  />
                </div>
              )}

              {/* Tab 3: Variants */}
              {activeEditorTab === 'variants' && (
                <div className="animate-fadeIn">
                  <AdminProductVariantsEditor
                    variants={editingProduct.variants}
                    basePriceINR={editingProduct.priceINR}
                    baseSku={editingProduct.sku}
                    galleryImages={[editingProduct.image, ...(editingProduct.additionalImages || [])].filter(Boolean)}
                    onChange={(newVariants) => {
                      setEditingProduct({
                        ...editingProduct,
                        variants: newVariants,
                      });
                    }}
                    onShowToast={onShowToast}
                  />
                </div>
              )}

              {/* Tab 4: Sections */}
              {activeEditorTab === 'sections' && (
                <div className="animate-fadeIn">
                  <AdminProductSectionsEditor
                    product={editingProduct}
                    onChange={(updates) => {
                      setEditingProduct({
                        ...editingProduct,
                        ...updates,
                      });
                    }}
                    onShowToast={onShowToast}
                  />
                </div>
              )}

              {/* Tab 5: Related */}
              {activeEditorTab === 'related' && (
                <div className="animate-fadeIn">
                  <AdminProductRelatedEditor
                    currentProductId={editingProduct.id}
                    allProducts={products}
                    relatedProductIds={editingProduct.relatedProductIds}
                    relatedProductsMode={editingProduct.relatedProductsMode}
                    onChange={(updates) => {
                      setEditingProduct({
                        ...editingProduct,
                        ...updates,
                      });
                    }}
                    onShowToast={onShowToast}
                  />
                </div>
              )}

              {/* Tab 6: SEO */}
              {activeEditorTab === 'seo' && (
                <div className="animate-fadeIn">
                  <AdminProductSeoEditor
                    product={editingProduct}
                    galleryImages={[editingProduct.image, ...(editingProduct.additionalImages || [])].filter(Boolean)}
                    onChange={(updates) => {
                      setEditingProduct({
                        ...editingProduct,
                        ...updates,
                      });
                    }}
                    onShowToast={onShowToast}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer Save Bar */}
            <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between gap-3 bg-[var(--brand-primary-deep,#07150E)] shrink-0">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/70 border border-white/20 text-slate-300 font-bold"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewProduct(editingProduct)}
                  className="px-4 py-2.5 rounded-xl bg-black/50 hover:bg-black/80 text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 font-bold flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Changes</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveEditingProduct()}
                  className="px-6 py-2.5 rounded-xl bg-[var(--brand-gold)] hover:bg-white text-[var(--brand-primary-dark)] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Formulation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Product Modal */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
          <div className="bg-[var(--brand-primary-dark,#0B1D13)] border border-[var(--brand-gold,#D4AF37)] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[var(--brand-primary-deep,#07150E)] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 font-serif-luxury uppercase">
                  Add New Ayurvedic Formulation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    placeholder="e.g. 42 Herbs Tribal Elixir Oil"
                    className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category *</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-amber-300 font-bold mb-1">Primary Dedicated Category *</label>
                  <select
                    value={newProductForm.primaryCategory || 'hair-care'}
                    onChange={(e) => setNewProductForm({ ...newProductForm, primaryCategory: e.target.value as any })}
                    className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-amber-500/50 p-2.5 rounded-xl text-amber-300 font-bold"
                  >
                    <option value="hair-care">Hair Care (/hair-care)</option>
                    <option value="skin-care">Skin Care (/skin-care)</option>
                    <option value="tribal-wellness">Tribal Wellness (/tribal-wellness)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.priceINR}
                    onChange={(e) => setNewProductForm({ ...newProductForm, priceINR: Number(e.target.value) })}
                    className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                    className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value.toUpperCase() })}
                    placeholder="e.g. HKV-OIL-01"
                    className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Net Quantity / Volume</label>
                  <input
                    type="text"
                    value={newProductForm.volume || ''}
                    onChange={(e) => setNewProductForm({ ...newProductForm, volume: e.target.value })}
                    placeholder="e.g. 200 ml"
                    className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Short Description / Subtitle</label>
                  <textarea
                    rows={2}
                    value={newProductForm.description}
                    onChange={(e) =>
                      setNewProductForm({
                        ...newProductForm,
                        description: e.target.value,
                        shortDescription: e.target.value,
                      })
                    }
                    placeholder="Concise overview of the formulation..."
                    className="w-full bg-[var(--brand-primary-deep,#07150E)] border border-white/20 p-2.5 rounded-xl text-slate-100"
                  />
                </div>

                {/* Gallery component in new form */}
                <div className="sm:col-span-2 pt-2">
                  <AdminProductGalleryEditor
                    images={[newProductForm.image, ...(newProductForm.additionalImages || [])].filter(Boolean)}
                    galleryItems={newProductForm.galleryItems}
                    onChange={(newImages, newGalleryItems) => {
                      setNewProductForm((prev) => ({
                        ...prev,
                        image: newImages[0] || '',
                        additionalImages: newImages.slice(1),
                        galleryItems: newGalleryItems,
                      }));
                    }}
                    onShowToast={onShowToast}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 rounded-xl bg-black/40 border border-white/20 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold uppercase tracking-wider hover:bg-white transition-all shadow"
                >
                  Save & Add Formulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Live PDP Preview Modal */}
      {previewProduct && (
        <AdminProductPreviewModal
          product={previewProduct}
          allProducts={products}
          onClose={() => setPreviewProduct(null)}
          onSaveAndClose={() => {
            if (editingProduct && editingProduct.id === previewProduct.id) {
              handleSaveEditingProduct();
            }
            setPreviewProduct(null);
          }}
        />
      )}
    </div>
  );
};
