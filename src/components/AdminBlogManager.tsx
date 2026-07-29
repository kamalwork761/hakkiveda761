import React, { useState } from 'react';
import { uploadFileToServer } from '../utils/upload';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Search,
  Upload,
  X,
  Tag as TagIcon,
  Globe,
  Calendar,
  Sparkles,
  Link2,
  ShoppingBag,
  List,
  Bold,
  Italic,
  Heading,
  Quote,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BlogArticle } from '../types/store';

interface AdminBlogManagerProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminBlogManager: React.FC<AdminBlogManagerProps> = ({ showToast }) => {
  const { blogs, products, addBlog, updateBlog, deleteBlog, setAllBlogs } = useStore();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'SCHEDULED'>('ALL');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);

  // Live Article Reader Preview Modal
  const [previewArticle, setPreviewArticle] = useState<BlogArticle | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');

  // Delete Modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('Dr. Hakki Vaidya (Ayurvedic Acharya)');
  const [category, setCategory] = useState('Hair Rituals');
  const [readTime, setReadTime] = useState('5 min read');
  const [image, setImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'SCHEDULED'>('PUBLISHED');
  const [scheduledDate, setScheduledDate] = useState('');
  const [tags, setTags] = useState<string[]>(['Ayurveda', 'Hair Care', 'Herbal Oil']);
  const [tagInput, setTagInput] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<string[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<string[]>([]);

  // Categories list
  const categoriesList = [
    'Hair Rituals',
    'Tribal Herbal Wisdom',
    'Ayurvedic Science',
    'Scalp Health',
    'Ingredient Spotlight',
    'Lifestyle & Wellness',
  ];

  const resetForm = () => {
    setEditingArticle(null);
    setTitle('');
    setSlug('');
    setAuthor('Dr. Hakki Vaidya (Ayurvedic Acharya)');
    setCategory('Hair Rituals');
    setReadTime('5 min read');
    setImage('');
    setExcerpt('');
    setContent('');
    setStatus('PUBLISHED');
    setScheduledDate('');
    setTags(['Ayurveda', 'Hair Care', 'Herbal Oil']);
    setTagInput('');
    setGallery([]);
    setSeoTitle('');
    setMetaDescription('');
    setRelatedProducts([]);
    setRelatedArticles([]);
    setIsModalOpen(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: BlogArticle) => {
    setEditingArticle(art);
    setTitle(art.title || '');
    setSlug(art.slug || '');
    setAuthor(art.author || 'Dr. Hakki Vaidya');
    setCategory(art.category || 'Hair Rituals');
    setReadTime(art.readTime || '5 min read');
    setImage(art.image || '');
    setExcerpt(art.excerpt || '');
    setContent(art.content || '');
    setStatus(art.status || 'PUBLISHED');
    setScheduledDate(art.scheduledDate || '');
    setTags(art.tags || ['Ayurveda']);
    setGallery(art.gallery || []);
    setSeoTitle(art.seoTitle || art.title || '');
    setMetaDescription(art.metaDescription || art.excerpt || '');
    setRelatedProducts(art.relatedProducts || []);
    setRelatedArticles(art.relatedArticles || []);
    setIsModalOpen(true);
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingArticle) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, '')
          .replace(/\s+/g, '-')
      );
      if (!seoTitle) setSeoTitle(val);
    }
  };

  // Image Upload helper
  const handleImageRead = async (file: File, callback: (res: string) => void) => {
    try {
      const url = await uploadFileToServer(file);
      callback(url);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          callback(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRem: string) => {
    setTags(tags.filter((t) => t !== tagToRem));
  };

  // Rich Text Formatting helper insertions
  const insertFormat = (tag: string) => {
    if (tag === 'b') setContent((prev) => prev + ' **Bold Text** ');
    if (tag === 'i') setContent((prev) => prev + ' *Italic Text* ');
    if (tag === 'h2') setContent((prev) => prev + '\n\n## Subheading Title\n');
    if (tag === 'quote') setContent((prev) => prev + '\n> "Ayurveda restores root balance through nature."\n');
    if (tag === 'ul') setContent((prev) => prev + '\n- Item 1\n- Item 2\n- Item 3\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Please enter article title and body content.', 'error');
      return;
    }

    const articleData = {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      author,
      date: editingArticle?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: readTime || `${Math.max(2, Math.ceil(content.split(' ').length / 150))} min read`,
      image: image || 'https://images.unsplash.com/photo-1608248597263-0057e12739c9?w=800&auto=format&fit=crop&q=80',
      category,
      excerpt: excerpt || content.slice(0, 150) + '...',
      content,
      status,
      scheduledDate: status === 'SCHEDULED' ? scheduledDate : undefined,
      tags,
      gallery,
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || excerpt,
      relatedProducts,
      relatedArticles,
    };

    if (editingArticle) {
      updateBlog(editingArticle.id, articleData);
      showToast('Journal article updated.', 'success');
    } else {
      addBlog(articleData);
      showToast('New Journal article published.', 'success');
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteBlog(id);
    showToast('Article deleted.', 'info');
    setDeleteId(null);
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'ALL' || b.category === filterCategory;
    const bStatus = b.status || 'PUBLISHED';
    const matchesStatus = filterStatus === 'ALL' || bStatus === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider block mb-1 font-sans">
            Editorial CMS & Content Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-slate-100">
            Journal & Articles Manager
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-1">
            Publish tribal herbal guides, Ayurvedic hair rituals, and SEO articles.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-5 py-2.5 rounded-xl font-bold hover:bg-white transition-all shadow-lg text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400 block">Total Articles</span>
          <span className="text-2xl font-bold font-serif-luxury text-slate-100">{blogs.length}</span>
        </div>
        <div className="bg-[var(--brand-primary-deep)] border border-emerald-500/20 rounded-xl p-4 space-y-1">
          <span className="text-xs text-emerald-400 block">Published</span>
          <span className="text-2xl font-bold font-serif-luxury text-emerald-300">
            {blogs.filter((b) => (b.status || 'PUBLISHED') === 'PUBLISHED').length}
          </span>
        </div>
        <div className="bg-[var(--brand-primary-deep)] border border-amber-500/20 rounded-xl p-4 space-y-1">
          <span className="text-xs text-amber-400 block">Drafts & Scheduled</span>
          <span className="text-2xl font-bold font-serif-luxury text-amber-300">
            {blogs.filter((b) => (b.status || 'PUBLISHED') !== 'PUBLISHED').length}
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles by title, author, text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[var(--brand-gold)]"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[var(--brand-gold)]"
          >
            <option value="ALL">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[var(--brand-gold)]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Drafts</option>
            <option value="SCHEDULED">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-serif-luxury text-slate-200">No Articles Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Write New Article" above to create and publish a new Journal post.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBlogs.map((b) => {
            const bStatus = b.status || 'PUBLISHED';

            return (
              <div
                key={b.id}
                className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:border-[var(--brand-gold)]/40 transition-all shadow-lg group"
              >
                {/* Image Banner */}
                <div className="relative h-48 overflow-hidden bg-black/60">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[var(--brand-primary-dark)]/90 backdrop-blur-md text-[var(--brand-gold)] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[var(--brand-gold)]/30">
                    {b.category}
                  </span>
                  <span
                    className={`absolute top-3 right-3 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      bStatus === 'PUBLISHED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : bStatus === 'SCHEDULED'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {bStatus}
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{b.author}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3 text-[var(--brand-gold)]" />
                    <span>{b.readTime || '5 min read'}</span>
                  </div>

                  <h3 className="text-sm font-bold font-serif-luxury text-slate-100 line-clamp-2 leading-snug">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-300 font-sans line-clamp-3 font-light leading-relaxed">
                    {b.excerpt}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="p-3 bg-[#052018] border-t border-white/10 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setPreviewArticle(b)}
                    className="text-[var(--brand-gold)] hover:text-white font-bold text-[11px] flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Reader Preview</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="p-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10"
                      title="Edit Article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(b.id)}
                      className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-950"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Write / Edit Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/40 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 my-8">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[var(--brand-primary-dark)]">
              <h3 className="text-lg font-bold font-serif-luxury text-slate-100">
                {editingArticle ? 'Edit Article' : 'Compose New Journal Article'}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Ancient Hakki-Pikki Herbs for Scalp Nourishment"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="5-ancient-hakki-pikki-herbs"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              </div>

              {/* Author, Category, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Publish Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  >
                    <option value="PUBLISHED">Published Live</option>
                    <option value="DRAFT">Save as Draft</option>
                    <option value="SCHEDULED">Schedule Publish Date</option>
                  </select>
                </div>
              </div>

              {status === 'SCHEDULED' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              )}

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cover Image Header *</label>
                <div className="flex items-center gap-3">
                  {image && (
                    <img src={image} alt="Cover preview" className="w-20 h-14 rounded-lg object-cover border" />
                  )}
                  <label className="bg-[var(--brand-primary-dark)] border border-dashed border-[var(--brand-gold)]/50 text-[var(--brand-gold)] text-xs font-bold px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Featured Cover Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] && handleImageRead(e.target.files[0], setImage)
                      }
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Summary / Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief 2-sentence teaser shown on journal index cards..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              {/* Rich Body Content with Editor Toolbar */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300">Article Body Content *</label>
                  {/* Rich Text Toolbar */}
                  <div className="flex items-center gap-1 bg-[var(--brand-primary-dark)] border border-white/15 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => insertFormat('b')}
                      className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded"
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat('i')}
                      className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded"
                      title="Italic"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat('h2')}
                      className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded"
                      title="Heading 2"
                    >
                      <Heading className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat('quote')}
                      className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded"
                      title="Quote Block"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormat('ul')}
                      className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded"
                      title="List"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  required
                  rows={10}
                  placeholder="Write full article in Markdown or rich text..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl p-4 text-xs text-slate-100 font-sans leading-relaxed focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              {/* Tag Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tags</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add tag (e.g. Scalp Care)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-3 py-1.5 rounded-xl text-xs font-bold"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/30 text-[var(--brand-gold)] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                    >
                      <span>#{t}</span>
                      <button type="button" onClick={() => handleRemoveTag(t)}>
                        <X className="w-3 h-3 hover:text-white" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO Settings Preview Box */}
              <div className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl p-4 space-y-3">
                <span className="text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider block">
                  SEO & Search Engine Snippet Preview
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">SEO Meta Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full bg-[var(--brand-primary-deep)] border border-white/15 rounded-lg p-2 text-xs text-slate-100"
                  />
                </div>

                {/* Google Search Result Preview Card */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-1">
                  <span className="text-[10px] text-emerald-400 font-mono block truncate">
                    https://hakkiveda.com/journal/{slug || 'article-slug'}
                  </span>
                  <h4 className="text-xs font-bold text-blue-400 hover:underline">{seoTitle || title || 'Article Title'}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {metaDescription || excerpt || 'Search result description text...'}
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-6 py-2 rounded-xl font-bold hover:bg-white transition-all text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingArticle ? 'Save Article' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Live Reader Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/40 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[var(--brand-gold)] text-[10px] font-bold uppercase tracking-wider block">
                  Customer Journal Reader View
                </span>
                <span className="text-xs text-slate-300">{previewArticle.category}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl p-1 flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setPreviewDevice('DESKTOP')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 ${
                      previewDevice === 'DESKTOP' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-300'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('MOBILE')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 ${
                      previewDevice === 'MOBILE' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-300'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>

                <button
                  onClick={() => setPreviewArticle(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Reader Simulation Container */}
            <div className={`mx-auto bg-[var(--brand-primary-deep)] p-6 rounded-xl border border-white/10 space-y-4 ${
              previewDevice === 'MOBILE' ? 'max-w-sm' : 'w-full'
            }`}>
              <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-slate-100">
                {previewArticle.title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-[var(--brand-gold)]">
                <span>By {previewArticle.author}</span>
                <span>•</span>
                <span>{previewArticle.date}</span>
                <span>•</span>
                <span>{previewArticle.readTime}</span>
              </div>

              <img
                src={previewArticle.image}
                alt={previewArticle.title}
                className="w-full h-64 object-cover rounded-xl border border-white/15"
              />

              <p className="text-sm font-semibold text-slate-200 italic border-l-2 border-[var(--brand-gold)] pl-3 py-1">
                {previewArticle.excerpt}
              </p>

              <div className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap space-y-3 font-light">
                {previewArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--brand-primary-deep)] border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold font-serif-luxury text-slate-100">Delete Article?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this journal post?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="bg-rose-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-rose-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
