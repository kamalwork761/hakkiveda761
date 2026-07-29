import React, { useState, useMemo, useRef } from 'react';
import { uploadFileToServer } from '../utils/upload';
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Copy,
  ArrowUp,
  ArrowDown,
  Upload,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Globe,
  Star,
  CheckCircle2,
  ChevronRight,
  GripVertical,
  ExternalLink,
  PackageCheck,
  RefreshCw,
  SlidersHorizontal,
  FileText,
  Tag,
  Monitor,
  Smartphone,
  Info,
} from 'lucide-react';
import { Category, Product } from '../types/store';
import { useStore } from '../context/StoreContext';

interface AdminCategoryManagerProps {
  onSwitchToProductsTab?: (categoryFilter?: string) => void;
  showToast: (msg: string) => void;
}

export const AdminCategoryManager: React.FC<AdminCategoryManagerProps> = ({
  onSwitchToProductsTab,
  showToast,
}) => {
  const { categories, products, addCategory, updateCategory, deleteCategory, reorderCategories } =
    useStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'DRAFT' | 'HIDDEN'>('ALL');
  const [featureFilter, setFeatureFilter] = useState<'ALL' | 'FEATURED' | 'NAV' | 'HOMEPAGE'>('ALL');

  // Modals & Active Category State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewCategory, setPreviewCategory] = useState<Category | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
  const [categoryForProducts, setCategoryForProducts] = useState<Category | null>(null);

  // Form active tab in editor: 'basic' | 'images' | 'seo'
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'images' | 'seo'>('basic');

  // Form State
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    fullDescription: '',
    image: '',
    imageFilename: '',
    desktopBanner: '',
    desktopBannerFilename: '',
    mobileBanner: '',
    mobileBannerFilename: '',
    status: 'ACTIVE',
    showInNav: true,
    showOnHomepage: true,
    isFeatured: false,
    parentId: null,
    seoTitle: '',
    seoMetaDescription: '',
    seoKeywords: '',
  });

  const [formErrors, setFormErrors] = useState<{ name?: string; slug?: string }>({});

  // Reorder Drag State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Helper to generate slug from name
  const generateSlug = (nameStr: string) => {
    return nameStr
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Helper to calculate product count for a category name or ID
  const getProductCountForCategory = (cat: Category): number => {
    const directCount = products.filter(
      (p) =>
        p.category.toLowerCase() === cat.name.toLowerCase() ||
        p.category.toLowerCase() === cat.slug.toLowerCase()
    ).length;

    // Check subcategory products if any
    const subCats = categories.filter((c) => c.parentId === cat.id);
    const subNames = subCats.map((s) => s.name.toLowerCase());
    const subCount = products.filter((p) => subNames.includes(p.category.toLowerCase())).length;

    return directCount + subCount;
  };

  // Get products list for a category
  const getProductsForCategory = (cat: Category): Product[] => {
    const subCats = categories.filter((c) => c.parentId === cat.id);
    const validNames = [cat.name, cat.slug, ...subCats.map((s) => s.name), ...subCats.map((s) => s.slug)].map(
      (n) => n.toLowerCase()
    );

    return products.filter((p) => validNames.includes(p.category.toLowerCase()));
  };

  // Sorted and Filtered Categories
  const filteredCategories = useMemo(() => {
    let result = [...categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((c) => (c.status || 'ACTIVE') === statusFilter);
    }

    // Feature filter
    if (featureFilter === 'FEATURED') {
      result = result.filter((c) => c.isFeatured);
    } else if (featureFilter === 'NAV') {
      result = result.filter((c) => c.showInNav !== false);
    } else if (featureFilter === 'HOMEPAGE') {
      result = result.filter((c) => c.showOnHomepage !== false);
    }

    return result;
  }, [categories, searchQuery, statusFilter, featureFilter]);

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      fullDescription: '',
      image: '/images/hakkiveda_108_oil_gold.jpg',
      imageFilename: 'hakkiveda_108_oil_gold.jpg',
      desktopBanner: '',
      desktopBannerFilename: '',
      mobileBanner: '',
      mobileBannerFilename: '',
      status: 'ACTIVE',
      showInNav: true,
      showOnHomepage: true,
      isFeatured: false,
      parentId: null,
      seoTitle: '',
      seoMetaDescription: '',
      seoKeywords: '',
    });
    setFormErrors({});
    setActiveFormTab('basic');
    setIsEditorOpen(true);
  };

  // Open Edit Form
  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      fullDescription: cat.fullDescription || '',
      image: cat.image || '',
      imageFilename: cat.imageFilename || 'thumbnail.jpg',
      desktopBanner: cat.desktopBanner || '',
      desktopBannerFilename: cat.desktopBannerFilename || '',
      mobileBanner: cat.mobileBanner || '',
      mobileBannerFilename: cat.mobileBannerFilename || '',
      status: cat.status || 'ACTIVE',
      showInNav: cat.showInNav !== false,
      showOnHomepage: cat.showOnHomepage !== false,
      isFeatured: !!cat.isFeatured,
      parentId: cat.parentId || null,
      seoTitle: cat.seoTitle || '',
      seoMetaDescription: cat.seoMetaDescription || '',
      seoKeywords: cat.seoKeywords || '',
    });
    setFormErrors({});
    setActiveFormTab('basic');
    setIsEditorOpen(true);
  };

  // Duplicate Category
  const handleDuplicate = (cat: Category) => {
    const baseName = `${cat.name} (Copy)`;
    let uniqueSlug = generateSlug(baseName);
    let counter = 1;
    while (categories.some((c) => c.slug.toLowerCase() === uniqueSlug.toLowerCase())) {
      uniqueSlug = `${generateSlug(baseName)}-${counter}`;
      counter++;
    }

    const newCatData: Omit<Category, 'id'> = {
      name: baseName,
      slug: uniqueSlug,
      description: cat.description || '',
      fullDescription: cat.fullDescription || '',
      image: cat.image || '',
      imageFilename: cat.imageFilename || '',
      desktopBanner: cat.desktopBanner || '',
      desktopBannerFilename: cat.desktopBannerFilename || '',
      mobileBanner: cat.mobileBanner || '',
      mobileBannerFilename: cat.mobileBannerFilename || '',
      itemCount: 0,
      status: 'DRAFT',
      showInNav: cat.showInNav !== false,
      showOnHomepage: cat.showOnHomepage !== false,
      isFeatured: false,
      parentId: cat.parentId || null,
      sortOrder: categories.length + 1,
      seoTitle: cat.seoTitle ? `${cat.seoTitle} (Copy)` : '',
      seoMetaDescription: cat.seoMetaDescription || '',
      seoKeywords: cat.seoKeywords || '',
    };

    addCategory(newCatData);
    showToast(`Duplicated "${cat.name}" as "${baseName}"`);
  };

  // Toggle Quick Status
  const handleToggleStatus = (cat: Category) => {
    const nextStatusMap: Record<Category['status'], Category['status']> = {
      ACTIVE: 'DRAFT',
      DRAFT: 'HIDDEN',
      HIDDEN: 'ACTIVE',
    };
    const nextStatus = nextStatusMap[cat.status || 'ACTIVE'];
    updateCategory(cat.id, { status: nextStatus });
    showToast(`Category status set to ${nextStatus}`);
  };

  // Validate Form
  const validateForm = (): boolean => {
    const errors: { name?: string; slug?: string } = {};

    const trimmedName = (formData.name || '').trim();
    const trimmedSlug = (formData.slug || '').trim();

    if (!trimmedName) {
      errors.name = 'Category name is required.';
    } else {
      const duplicateName = categories.some(
        (c) => c.id !== editingCategory?.id && c.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (duplicateName) {
        errors.name = 'A category with this name already exists.';
      }
    }

    if (!trimmedSlug) {
      errors.slug = 'URL slug is required.';
    } else {
      const duplicateSlug = categories.some(
        (c) => c.id !== editingCategory?.id && c.slug.toLowerCase() === trimmedSlug.toLowerCase()
      );
      if (duplicateSlug) {
        errors.slug = 'A category with this URL slug already exists.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Form Submit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setActiveFormTab('basic');
      return;
    }

    const payload: Omit<Category, 'id'> = {
      name: formData.name!.trim(),
      slug: generateSlug(formData.slug || formData.name!),
      description: formData.description?.trim() || '',
      fullDescription: formData.fullDescription?.trim() || '',
      image: formData.image || '/images/hakkiveda_108_oil_gold.jpg',
      imageFilename: formData.imageFilename || 'thumbnail.jpg',
      desktopBanner: formData.desktopBanner || '',
      desktopBannerFilename: formData.desktopBannerFilename || '',
      mobileBanner: formData.mobileBanner || '',
      mobileBannerFilename: formData.mobileBannerFilename || '',
      itemCount: editingCategory ? editingCategory.itemCount : 0,
      status: formData.status || 'ACTIVE',
      showInNav: formData.showInNav !== false,
      showOnHomepage: formData.showOnHomepage !== false,
      isFeatured: !!formData.isFeatured,
      parentId: formData.parentId || null,
      sortOrder: editingCategory ? editingCategory.sortOrder || 1 : categories.length + 1,
      seoTitle: formData.seoTitle?.trim() || '',
      seoMetaDescription: formData.seoMetaDescription?.trim() || '',
      seoKeywords: formData.seoKeywords?.trim() || '',
      updatedAt: new Date().toISOString(),
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, payload);
      showToast('Category updated successfully');
    } else {
      addCategory({
        ...payload,
        createdAt: new Date().toISOString(),
      });
      showToast('New category created successfully');
    }

    setIsEditorOpen(false);
  };

  // Handle Image Upload for thumbnail / desktopBanner / mobileBanner
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: 'image' | 'desktopBanner' | 'mobileBanner',
    filenameKey: 'imageFilename' | 'desktopBannerFilename' | 'mobileBannerFilename'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file');
      return;
    }

    try {
      const url = await uploadFileToServer(file);
      setFormData((prev) => ({
        ...prev,
        [fieldKey]: url,
        [filenameKey]: file.name,
      }));
      showToast(`Uploaded ${file.name} to server`);
    } catch (err: any) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setFormData((prev) => ({
            ...prev,
            [fieldKey]: ev.target!.result as string,
            [filenameKey]: file.name,
          }));
          showToast(`Loaded ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.id);
    showToast(`Deleted category "${categoryToDelete.name}"`);
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  // Move Category Up / Down
  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const updated = [...categories];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;

    reorderCategories(updated);
    showToast('Category sort order updated');
  };

  // Drag & Drop Reordering
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIdx) return;

    const updated = [...categories];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIdx, 0, draggedItem);

    setDraggedIndex(null);
    reorderCategories(updated);
    showToast('Category sort order updated');
  };

  // Parent Category options (exclude current editing category and its children)
  const availableParentCategories = useMemo(() => {
    if (!editingCategory) return categories;
    return categories.filter((c) => c.id !== editingCategory.id && c.parentId !== editingCategory.id);
  }, [categories, editingCategory]);

  return (
    <div className="space-y-6 animate-in fade-in text-xs font-sans text-slate-100">
      {/* Module Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand-gold)]/20 border border-[var(--brand-gold)]/40 flex items-center justify-center text-[var(--brand-gold)]">
              <FolderTree className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-slate-100">
              Category Management
            </h1>
          </div>
          <p className="text-slate-400 mt-1">
            Organize formulations into structured parent-child categories, banners, and SEO metadata.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Categories</span>
          <span className="text-lg font-bold text-slate-100 font-mono mt-1">{categories.length}</span>
        </div>

        <div className="bg-[var(--brand-primary-dark)] border border-emerald-500/30 rounded-xl p-3 flex flex-col justify-between bg-emerald-950/10">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active</span>
          </span>
          <span className="text-lg font-bold text-emerald-300 font-mono mt-1">
            {categories.filter((c) => (c.status || 'ACTIVE') === 'ACTIVE').length}
          </span>
        </div>

        <div className="bg-[var(--brand-primary-dark)] border border-amber-500/30 rounded-xl p-3 flex flex-col justify-between bg-amber-950/10">
          <span className="text-[10px] text-amber-400 uppercase font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Draft</span>
          </span>
          <span className="text-lg font-bold text-amber-300 font-mono mt-1">
            {categories.filter((c) => c.status === 'DRAFT').length}
          </span>
        </div>

        <div className="bg-[var(--brand-primary-dark)] border border-slate-500/30 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Hidden</span>
          <span className="text-lg font-bold text-slate-300 font-mono mt-1">
            {categories.filter((c) => c.status === 'HIDDEN').length}
          </span>
        </div>

        <div className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 rounded-xl p-3 flex flex-col justify-between bg-[var(--brand-gold)]/10 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-[var(--brand-gold)] uppercase font-semibold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            <span>Featured</span>
          </span>
          <span className="text-lg font-bold text-[var(--brand-gold)] font-mono mt-1">
            {categories.filter((c) => c.isFeatured).length}
          </span>
        </div>
      </div>

      {/* Controls Bar: Search & Filter Options */}
      <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories by name, slug or description..."
              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status & Feature Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-[var(--brand-primary-deep)] border border-white/20 p-1 rounded-xl">
              {(['ALL', 'ACTIVE', 'DRAFT', 'HIDDEN'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                    statusFilter === st
                      ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Feature Filter */}
            <select
              value={featureFilter}
              onChange={(e) => setFeatureFilter(e.target.value as any)}
              className="bg-[var(--brand-primary-deep)] border border-white/20 text-slate-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-[var(--brand-gold)]"
            >
              <option value="ALL">All Visibility Controls</option>
              <option value="FEATURED">⭐ Featured Only</option>
              <option value="NAV">🧭 Main Navigation Only</option>
              <option value="HOMEPAGE">🏠 Homepage Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category List & Tree View */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-3">
          <p className="text-[11px] text-slate-400 flex items-center justify-between px-1">
            <span>Showing {filteredCategories.length} categories</span>
            <span className="font-mono text-[10px] text-[var(--brand-gold)]">
              Drag handle to reorder homepage / nav listing order
            </span>
          </p>

          <div className="space-y-2.5">
            {filteredCategories.map((cat, index) => {
              const productCount = getProductCountForCategory(cat);
              const parentCategory = categories.find((c) => c.id === cat.parentId);
              const isChild = !!cat.parentId;

              const statusColorMap = {
                ACTIVE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                DRAFT: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                HIDDEN: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
              };

              return (
                <div
                  key={cat.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`bg-[var(--brand-primary-dark)] border rounded-2xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isChild ? 'ml-0 sm:ml-8 border-l-4 border-l-[var(--brand-gold)]/60 border-white/10' : 'border-white/10'
                  } hover:border-[var(--brand-gold)]/50`}
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Drag Handle */}
                    <span
                      className="text-slate-500 hover:text-[var(--brand-gold)] cursor-grab active:cursor-grabbing p-1"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </span>

                    {/* Thumbnail Image */}
                    <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/10 p-1 shrink-0 overflow-hidden relative">
                      <img
                        src={cat.image || '/images/hakkiveda_108_oil_gold.jpg'}
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Category Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                          {cat.name}
                        </h3>

                        {/* Status Badge */}
                        <button
                          onClick={() => handleToggleStatus(cat)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase transition-colors ${
                            statusColorMap[cat.status || 'ACTIVE']
                          }`}
                          title="Click to toggle status (ACTIVE -> DRAFT -> HIDDEN)"
                        >
                          {cat.status || 'ACTIVE'}
                        </button>

                        {/* Parent Indicator Badge */}
                        {parentCategory && (
                          <span className="bg-[var(--brand-primary-deep)] text-slate-300 border border-white/15 px-2 py-0.5 rounded-md text-[10px] flex items-center gap-1">
                            <span>Child of:</span>
                            <span className="font-bold text-[var(--brand-gold)]">{parentCategory.name}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-400 font-mono">
                        <span>slug: /{cat.slug}</span>
                        <span>•</span>
                        {/* Products Count Link */}
                        <button
                          onClick={() => {
                            setCategoryForProducts(cat);
                            setIsProductsModalOpen(true);
                          }}
                          className="text-[var(--brand-gold)] hover:underline font-bold flex items-center gap-1"
                        >
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>{productCount} Products</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-300 line-clamp-1 mt-1 font-sans">
                        {cat.description || 'No short description provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Visibility Badges & Quick Action Controls */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                    {/* Toggles Status Bar */}
                    <div className="flex items-center gap-1 bg-[var(--brand-primary-deep)] p-1 rounded-xl border border-white/10">
                      <span
                        className={`p-1.5 rounded-lg text-[10px] flex items-center gap-1 ${
                          cat.showInNav !== false
                            ? 'bg-emerald-950/80 text-emerald-300'
                            : 'text-slate-500 opacity-50'
                        }`}
                        title={cat.showInNav !== false ? 'Shown in Main Nav' : 'Hidden from Main Nav'}
                      >
                        <Globe className="w-3 h-3" />
                      </span>

                      <span
                        className={`p-1.5 rounded-lg text-[10px] flex items-center gap-1 ${
                          cat.showOnHomepage !== false
                            ? 'bg-amber-950/80 text-amber-300'
                            : 'text-slate-500 opacity-50'
                        }`}
                        title={cat.showOnHomepage !== false ? 'Shown on Homepage' : 'Hidden from Homepage'}
                      >
                        <Monitor className="w-3 h-3" />
                      </span>

                      <span
                        className={`p-1.5 rounded-lg text-[10px] flex items-center gap-1 ${
                          cat.isFeatured
                            ? 'bg-[var(--brand-gold)]/20 text-[var(--brand-gold)]'
                            : 'text-slate-500 opacity-50'
                        }`}
                        title={cat.isFeatured ? 'Featured Category' : 'Not Featured'}
                      >
                        <Star className="w-3 h-3" />
                      </span>
                    </div>

                    {/* Order Up/Down Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveCategory(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 bg-black/40 hover:bg-black/80 disabled:opacity-30 text-slate-300 rounded-lg border border-white/10"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveCategory(index, 'down')}
                        disabled={index === filteredCategories.length - 1}
                        className="p-1.5 bg-black/40 hover:bg-black/80 disabled:opacity-30 text-slate-300 rounded-lg border border-white/10"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Primary Actions */}
                    <div className="flex items-center gap-1">
                      {/* View Details Modal */}
                      <button
                        onClick={() => {
                          setPreviewCategory(cat);
                          setIsPreviewOpen(true);
                        }}
                        className="p-2 bg-[var(--brand-primary-deep)] text-slate-200 hover:text-white hover:bg-black/40 rounded-lg border border-white/10"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicate(cat)}
                        className="p-2 bg-[var(--brand-primary-deep)] text-[var(--brand-gold)] hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] rounded-lg border border-[var(--brand-gold)]/30 transition-colors"
                        title="Duplicate Category"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-2 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] hover:bg-white rounded-lg font-bold transition-all"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          setCategoryToDelete(cat);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 bg-rose-950/60 text-rose-300 hover:bg-rose-900 rounded-lg border border-rose-500/30 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-[var(--brand-primary-dark)] border border-white/10 rounded-2xl p-8 text-center space-y-3">
          <FolderTree className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No categories found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No category matches your current search or filter rules. Create a new category or adjust your filters.
          </p>
          <button
            onClick={handleOpenCreate}
            className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2 rounded-xl font-bold text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. Category Editor Modal (Create / Edit)                 */}
      {/* ========================================================= */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)] rounded-2xl p-5 sm:p-6 max-w-3xl w-full max-h-[92vh] overflow-y-auto space-y-5 text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] flex items-center justify-center border border-[var(--brand-gold)]/30">
                  <FolderTree className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--brand-gold)] uppercase tracking-wider">
                    {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Configure names, banners, visibility, and search metadata.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-black/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Tabs Navigation */}
            <div className="flex border-b border-white/10 gap-2">
              <button
                type="button"
                onClick={() => setActiveFormTab('basic')}
                className={`pb-2.5 px-3 font-bold text-xs uppercase flex items-center gap-1.5 transition-colors border-b-2 ${
                  activeFormTab === 'basic'
                    ? 'border-[var(--brand-gold)] text-[var(--brand-gold)]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Basic Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab('images')}
                className={`pb-2.5 px-3 font-bold text-xs uppercase flex items-center gap-1.5 transition-colors border-b-2 ${
                  activeFormTab === 'images'
                    ? 'border-[var(--brand-gold)] text-[var(--brand-gold)]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>2. Images & Banners</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab('seo')}
                className={`pb-2.5 px-3 font-bold text-xs uppercase flex items-center gap-1.5 transition-colors border-b-2 ${
                  activeFormTab === 'seo'
                    ? 'border-[var(--brand-gold)] text-[var(--brand-gold)]'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>3. SEO & Metadata</span>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* TAB 1: BASIC DETAILS */}
              {activeFormTab === 'basic' && (
                <div className="space-y-4">
                  {/* Category Name & Auto Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        Category Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => {
                          const nameVal = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            name: nameVal,
                            slug: prev.slug ? prev.slug : generateSlug(nameVal),
                          }));
                          if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }));
                        }}
                        placeholder="e.g. Hair Oils & Elixirs"
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100 placeholder-slate-500 focus:border-[var(--brand-gold)] focus:outline-none"
                      />
                      {formErrors.name && (
                        <p className="text-rose-400 text-[10px] font-bold mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-300 font-bold">
                          URL Slug <span className="text-rose-400">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              slug: generateSlug(prev.name || ''),
                            }))
                          }
                          className="text-[10px] text-[var(--brand-gold)] hover:underline font-bold"
                        >
                          Auto-generate
                        </button>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[11px]">
                          /category/
                        </span>
                        <input
                          type="text"
                          required
                          value={formData.slug || ''}
                          onChange={(e) => {
                            setFormData((prev) => ({ ...prev, slug: generateSlug(e.target.value) }));
                            if (formErrors.slug) setFormErrors((p) => ({ ...p, slug: undefined }));
                          }}
                          placeholder="hair-oils"
                          className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 pl-22 rounded-xl text-slate-100 font-mono text-[11px] focus:border-[var(--brand-gold)] focus:outline-none"
                        />
                      </div>
                      {formErrors.slug && (
                        <p className="text-rose-400 text-[10px] font-bold mt-1">{formErrors.slug}</p>
                      )}
                    </div>
                  </div>

                  {/* Parent Category & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        Parent Category (Optional Hierarchy)
                      </label>
                      <select
                        value={formData.parentId || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, parentId: e.target.value || null }))
                        }
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100 focus:border-[var(--brand-gold)] focus:outline-none"
                      >
                        <option value="">None (Top-Level Category)</option>
                        {availableParentCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            📁 {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Publish Status</label>
                      <select
                        value={formData.status || 'ACTIVE'}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, status: e.target.value as any }))
                        }
                        className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100 font-bold focus:border-[var(--brand-gold)] focus:outline-none"
                      >
                        <option value="ACTIVE">🟢 Active (Visible to store visitors)</option>
                        <option value="DRAFT">🟡 Draft (In progress, hidden from public)</option>
                        <option value="HIDDEN">🔴 Hidden (Unlisted / Direct link only)</option>
                      </select>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Short Description (Card & List Overview)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="A brief 1-2 sentence overview of formulations in this category..."
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100 placeholder-slate-500 focus:border-[var(--brand-gold)] focus:outline-none"
                    />
                  </div>

                  {/* Full Rich Text Description */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Full Category Description (Rich Formulation Story)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.fullDescription || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, fullDescription: e.target.value }))
                      }
                      placeholder="Detailed origin story, tribal harvesting techniques, or ingredients guide..."
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100 placeholder-slate-500 focus:border-[var(--brand-gold)] focus:outline-none font-sans"
                    />
                  </div>

                  {/* Display & Homepage Controls Toggles */}
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wider block">
                      Visibility & Placement Controls
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2 cursor-pointer bg-black/30 p-2.5 rounded-lg border border-white/10 hover:border-[var(--brand-gold)]/40">
                        <input
                          type="checkbox"
                          checked={formData.showInNav !== false}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, showInNav: e.target.checked }))
                          }
                          className="accent-[var(--brand-gold)] w-4 h-4 rounded"
                        />
                        <div>
                          <span className="font-bold text-slate-200 block">Main Navigation</span>
                          <span className="text-[10px] text-slate-400">Show in top navbar dropdown</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer bg-black/30 p-2.5 rounded-lg border border-white/10 hover:border-[var(--brand-gold)]/40">
                        <input
                          type="checkbox"
                          checked={formData.showOnHomepage !== false}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, showOnHomepage: e.target.checked }))
                          }
                          className="accent-[var(--brand-gold)] w-4 h-4 rounded"
                        />
                        <div>
                          <span className="font-bold text-slate-200 block">Homepage Section</span>
                          <span className="text-[10px] text-slate-400">Show in homepage category grid</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer bg-black/30 p-2.5 rounded-lg border border-white/10 hover:border-[var(--brand-gold)]/40">
                        <input
                          type="checkbox"
                          checked={!!formData.isFeatured}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                          }
                          className="accent-[var(--brand-gold)] w-4 h-4 rounded"
                        />
                        <div>
                          <span className="font-bold text-slate-200 block">Featured Category</span>
                          <span className="text-[10px] text-slate-400">Highlight with gold badge</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: IMAGES & BANNERS */}
              {activeFormTab === 'images' && (
                <div className="space-y-4">
                  {/* Category Thumbnail */}
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-200 font-bold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[var(--brand-gold)]" />
                        <span>Category Square Thumbnail Image *</span>
                      </label>
                      {formData.imageFilename && (
                        <span className="text-[10px] text-[var(--brand-gold)] font-mono font-bold bg-black/40 px-2 py-0.5 rounded border border-[var(--brand-gold)]/30">
                          {formData.imageFilename}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Preview Box */}
                      <div className="w-24 h-24 rounded-xl bg-black/40 border border-white/20 p-1 shrink-0 overflow-hidden relative flex items-center justify-center">
                        {formData.image ? (
                          <img
                            src={formData.image}
                            alt="Thumbnail Preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-slate-500 text-[10px]">No image</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-white transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Thumbnail</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'image', 'imageFilename')}
                              className="hidden"
                            />
                          </label>

                          {formData.image && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, image: '', imageFilename: '' }))
                              }
                              className="p-2 text-rose-400 hover:text-white bg-rose-950/50 rounded-xl border border-rose-500/30"
                              title="Remove Image"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={formData.image || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              image: e.target.value,
                              imageFilename: e.target.value.split('/').pop() || 'url-image.jpg',
                            }))
                          }
                          placeholder="Or paste direct image URL (https://...)"
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2 rounded-xl text-slate-100 text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desktop Banner Image */}
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-200 font-bold flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-[var(--brand-gold)]" />
                        <span>Desktop Header Banner Image</span>
                      </label>
                      {formData.desktopBannerFilename && (
                        <span className="text-[10px] text-[var(--brand-gold)] font-mono font-bold bg-black/40 px-2 py-0.5 rounded border border-[var(--brand-gold)]/30">
                          {formData.desktopBannerFilename}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="h-28 w-full bg-black/40 rounded-xl border border-white/20 p-1 relative flex items-center justify-center overflow-hidden">
                        {formData.desktopBanner ? (
                          <img
                            src={formData.desktopBanner}
                            alt="Desktop Banner Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center text-slate-500 text-[11px]">
                            <span>No Desktop Banner set. Click upload below.</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer bg-[var(--brand-primary-dark)] text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Desktop Banner</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(e, 'desktopBanner', 'desktopBannerFilename')
                            }
                            className="hidden"
                          />
                        </label>

                        <input
                          type="text"
                          value={formData.desktopBanner || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              desktopBanner: e.target.value,
                              desktopBannerFilename:
                                e.target.value.split('/').pop() || 'desktop-banner.jpg',
                            }))
                          }
                          placeholder="Or paste Desktop Banner URL"
                          className="flex-1 bg-[var(--brand-primary-dark)] border border-white/20 p-2 rounded-xl text-slate-100 text-[11px]"
                        />

                        {formData.desktopBanner && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                desktopBanner: '',
                                desktopBannerFilename: '',
                              }))
                            }
                            className="p-2 text-rose-400 hover:text-white bg-rose-950/50 rounded-xl border border-rose-500/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Banner Image */}
                  <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-200 font-bold flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[var(--brand-gold)]" />
                        <span>Mobile Banner Image</span>
                      </label>
                      {formData.mobileBannerFilename && (
                        <span className="text-[10px] text-[var(--brand-gold)] font-mono font-bold bg-black/40 px-2 py-0.5 rounded border border-[var(--brand-gold)]/30">
                          {formData.mobileBannerFilename}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-20 h-28 bg-black/40 rounded-xl border border-white/20 p-1 relative flex items-center justify-center overflow-hidden shrink-0">
                        {formData.mobileBanner ? (
                          <img
                            src={formData.mobileBanner}
                            alt="Mobile Banner Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-slate-500 text-[10px] text-center">Mobile Banner</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer bg-[var(--brand-primary-dark)] text-[var(--brand-gold)] border border-[var(--brand-gold)]/40 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-[var(--brand-gold)] hover:text-[var(--brand-primary-dark)] transition-all">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Mobile Banner</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageUpload(e, 'mobileBanner', 'mobileBannerFilename')
                              }
                              className="hidden"
                            />
                          </label>

                          {formData.mobileBanner && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  mobileBanner: '',
                                  mobileBannerFilename: '',
                                }))
                              }
                              className="p-2 text-rose-400 hover:text-white bg-rose-950/50 rounded-xl border border-rose-500/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={formData.mobileBanner || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              mobileBanner: e.target.value,
                              mobileBannerFilename:
                                e.target.value.split('/').pop() || 'mobile-banner.jpg',
                            }))
                          }
                          placeholder="Or paste Mobile Banner URL"
                          className="w-full bg-[var(--brand-primary-dark)] border border-white/20 p-2 rounded-xl text-slate-100 text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SEO & METADATA */}
              {activeFormTab === 'seo' && (
                <div className="space-y-4">
                  {/* SEO Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-300 font-bold">SEO Title Tag</label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(formData.seoTitle || '').length} / 60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={70}
                      value={formData.seoTitle || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))}
                      placeholder="e.g. Adivasi Hair Oils & Natural Elixirs - HakkiVeda"
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100 placeholder-slate-500 focus:border-[var(--brand-gold)] focus:outline-none"
                    />
                  </div>

                  {/* SEO Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-300 font-bold">SEO Meta Description</label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(formData.seoMetaDescription || '').length} / 160 chars
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={180}
                      value={formData.seoMetaDescription || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, seoMetaDescription: e.target.value }))
                      }
                      placeholder="Pure adivasi 108 herbal hair oils handcrafted in Mysore for deep root regrowth..."
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100 placeholder-slate-500 focus:border-[var(--brand-gold)] focus:outline-none"
                    />
                  </div>

                  {/* SEO Keywords */}
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      SEO Search Keywords (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={formData.seoKeywords || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, seoKeywords: e.target.value }))}
                      placeholder="adivasi hair oil, 108 herbs, root growth, natural shampoo"
                      className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2.5 rounded-xl text-slate-100 placeholder-slate-500 focus:border-[var(--brand-gold)] focus:outline-none"
                    />
                  </div>

                  {/* Live Google Search Snippet Preview Box */}
                  <div className="bg-black/50 p-4 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-2 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[var(--brand-gold)]" />
                      <span>Google Search Result Snippet Preview</span>
                    </span>

                    <span className="text-slate-400 text-[11px] block truncate">
                      https://hakkiveda.com › category › {formData.slug || 'category-slug'}
                    </span>
                    <h4 className="text-blue-400 font-semibold text-sm hover:underline cursor-pointer truncate">
                      {formData.seoTitle || formData.name || 'Category Page Title'}
                    </h4>
                    <p className="text-slate-300 text-xs line-clamp-2">
                      {formData.seoMetaDescription ||
                        formData.description ||
                        'Discover authentic 108 herbal adivasi formulations crafted slow-brewed in copper cauldrons.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 bg-black/40 hover:bg-black/80 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-6 py-2 rounded-xl font-bold uppercase tracking-wider hover:bg-white transition-all shadow-lg flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. Category Preview Modal                                 */}
      {/* ========================================================= */}
      {isPreviewOpen && previewCategory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-[var(--brand-gold)] uppercase flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Category Details: {previewCategory.name}</span>
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop / Mobile Banner Preview */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 h-40 flex items-center justify-center">
              <img
                src={
                  previewCategory.desktopBanner ||
                  previewCategory.image ||
                  '/images/hakkiveda_108_oil_gold.jpg'
                }
                alt={previewCategory.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] text-[var(--brand-gold)] font-mono uppercase tracking-widest font-bold">
                  Slug: /{previewCategory.slug}
                </span>
                <h2 className="text-lg font-bold text-white font-serif-luxury">
                  {previewCategory.name}
                </h2>
              </div>
            </div>

            {/* Description & Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[var(--brand-primary-deep)] p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Short Overview</span>
                <p className="text-slate-200">{previewCategory.description}</p>
              </div>

              <div className="bg-[var(--brand-primary-deep)] p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Category Status</span>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]">
                    {previewCategory.status || 'ACTIVE'}
                  </span>
                  <span className="text-slate-300">
                    Assigned Products: <strong>{getProductCountForCategory(previewCategory)}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Full Story */}
            {previewCategory.fullDescription && (
              <div className="bg-[var(--brand-primary-deep)] p-4 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-[var(--brand-gold)] uppercase font-bold">Formulation Story</span>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed">
                  {previewCategory.fullDescription}
                </p>
              </div>
            )}

            {/* SEO Data */}
            <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                SEO Metadata
              </span>
              <p>
                <strong>Title:</strong> {previewCategory.seoTitle || 'Default Page Title'}
              </p>
              <p>
                <strong>Meta Description:</strong>{' '}
                {previewCategory.seoMetaDescription || previewCategory.description}
              </p>
              <p>
                <strong>Keywords:</strong> {previewCategory.seoKeywords || 'None'}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setIsPreviewOpen(false);
                  handleOpenEdit(previewCategory);
                }}
                className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-5 py-2 rounded-xl font-bold text-xs uppercase"
              >
                Edit Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. Delete Confirmation Dialog Modal                      */}
      {/* ========================================================= */}
      {isDeleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--brand-primary-dark)] border border-rose-500/50 rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-400 border-b border-white/10 pb-3">
              <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase text-white">Confirm Category Deletion</h3>
                <p className="text-[11px] text-rose-300">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-slate-200">
              Are you sure you want to permanently delete the category{' '}
              <strong className="text-[var(--brand-gold)]">"{categoryToDelete.name}"</strong>?
            </p>

            {getProductCountForCategory(categoryToDelete) > 0 && (
              <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl text-amber-200 text-[11px]">
                ⚠️ <strong>Warning:</strong> This category has{' '}
                <strong>{getProductCountForCategory(categoryToDelete)}</strong> products assigned to it.
                Deleting this category will unassign them from this category list.
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCategoryToDelete(null);
                }}
                className="px-4 py-2 bg-black/40 hover:bg-black/80 text-slate-300 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl font-bold uppercase tracking-wider shadow-lg"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. Products in Category Inspector Modal                   */}
      {/* ========================================================= */}
      {isProductsModalOpen && categoryForProducts && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)] rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-[var(--brand-gold)] uppercase flex items-center gap-2">
                  <PackageCheck className="w-4 h-4" />
                  <span>Products in "{categoryForProducts.name}"</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Total {getProductsForCategory(categoryForProducts).length} formulations listed under this
                  category
                </p>
              </div>

              <button
                onClick={() => setIsProductsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-black/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {getProductsForCategory(categoryForProducts).length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {getProductsForCategory(categoryForProducts).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 bg-[var(--brand-primary-deep)] p-3 rounded-xl border border-white/10 hover:border-white/30"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 object-contain rounded-lg bg-black/40 p-0.5 border border-white/10 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-100">{p.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          SKU: {p.sku} • Stock: {p.stock}
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono font-bold text-[var(--brand-gold)]">
                      ₹{p.priceINR}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 bg-[var(--brand-primary-deep)] rounded-xl border border-white/10">
                No products are currently assigned to this category.
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-[10px] text-slate-400">
                Need to reassign or add products? Use the Products tab.
              </span>
              <button
                onClick={() => {
                  setIsProductsModalOpen(false);
                  if (onSwitchToProductsTab) {
                    onSwitchToProductsTab(categoryForProducts.name);
                  }
                }}
                className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2 rounded-xl font-bold uppercase text-[11px] flex items-center gap-1.5"
              >
                <span>View in Products Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
