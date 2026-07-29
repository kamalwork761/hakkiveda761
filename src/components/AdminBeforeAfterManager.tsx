import React, { useState } from 'react';
import { uploadFileToServer } from '../utils/upload';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle2,
  XCircle,
  Upload,
  X,
  Smartphone,
  Monitor,
  Sparkles,
  Clock,
  User,
  Sliders,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BeforeAfterItem } from '../types/store';

interface AdminBeforeAfterManagerProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminBeforeAfterManager: React.FC<AdminBeforeAfterManagerProps> = ({ showToast }) => {
  const { beforeAfterItems, addBeforeAfterItem, updateBeforeAfterItem, deleteBeforeAfterItem, setAllBeforeAfterItems } = useStore();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BeforeAfterItem | null>(null);

  // Live Interactive Preview Modal
  const [previewItem, setPreviewItem] = useState<BeforeAfterItem | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');
  const [sliderPos, setSliderPos] = useState(50);

  // Delete Confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('Delhi, India');
  const [treatmentDuration, setTreatmentDuration] = useState('6 Weeks');
  const [days, setDays] = useState(42);
  const [concern, setConcern] = useState('Severe Hair Fall & Scalp Thinning');
  const [testimonial, setTestimonial] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [active, setActive] = useState(true);
  const [showOnHomepage, setShowOnHomepage] = useState(true);

  const resetForm = () => {
    setEditingItem(null);
    setTitle('');
    setAuthor('');
    setLocation('Delhi, India');
    setTreatmentDuration('6 Weeks');
    setDays(42);
    setConcern('Severe Hair Fall & Scalp Thinning');
    setTestimonial('');
    setBeforeImage('');
    setAfterImage('');
    setActive(true);
    setShowOnHomepage(true);
    setIsModalOpen(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: BeforeAfterItem) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setAuthor(item.author || item.customerName || '');
    setLocation(item.location || 'India');
    setTreatmentDuration(item.treatmentDuration || `${item.days || 30} Days`);
    setDays(item.days || 30);
    setConcern(item.concern || 'Hair Thinning');
    setTestimonial(item.testimonial || item.description || '');
    setBeforeImage(item.beforeImage || '');
    setAfterImage(item.afterImage || '');
    setActive(item.active ?? true);
    setShowOnHomepage(item.showOnHomepage ?? true);
    setIsModalOpen(true);
  };

  const handleImageRead = async (file: File, callback: (url: string) => void) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeImage || !afterImage) {
      showToast('Please upload both Before and After images.', 'error');
      return;
    }
    if (!title.trim() || !author.trim()) {
      showToast('Please enter a title and customer name.', 'error');
      return;
    }

    const payload = {
      title,
      author,
      customerName: author,
      location,
      days,
      treatmentDuration,
      concern,
      testimonial,
      description: testimonial,
      beforeImage,
      afterImage,
      active,
      showOnHomepage,
    };

    if (editingItem) {
      updateBeforeAfterItem(editingItem.id, payload);
      showToast('Comparison slide updated.', 'success');
    } else {
      addBeforeAfterItem(payload);
      showToast('New Before/After comparison created.', 'success');
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteBeforeAfterItem(id);
    showToast('Comparison slide deleted.', 'info');
    setDeleteId(null);
  };

  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= beforeAfterItems.length) return;

    const nextList = [...beforeAfterItems];
    const [moved] = nextList.splice(index, 1);
    nextList.splice(targetIndex, 0, moved);

    setAllBeforeAfterItems(nextList);
    showToast('Slide display order updated.', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[var(--brand-gold)] text-xs font-bold uppercase tracking-wider block mb-1 font-sans">
            Visual Proof & Transformations
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-slate-100">
            Before & After Slider Manager
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-1">
            Manage interactive image comparison sliders shown on the Homepage and Product pages.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-5 py-2.5 rounded-xl font-bold hover:bg-white transition-all shadow-lg text-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Comparison</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400 block">Total Comparisons</span>
          <span className="text-2xl font-bold font-serif-luxury text-slate-100">{beforeAfterItems.length}</span>
        </div>
        <div className="bg-[var(--brand-primary-deep)] border border-emerald-500/20 rounded-xl p-4 space-y-1">
          <span className="text-xs text-emerald-400 block">Active Live</span>
          <span className="text-2xl font-bold font-serif-luxury text-emerald-300">
            {beforeAfterItems.filter((i) => i.active ?? true).length}
          </span>
        </div>
        <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/30 rounded-xl p-4 space-y-1">
          <span className="text-xs text-[var(--brand-gold)] block">Visible on Homepage</span>
          <span className="text-2xl font-bold font-serif-luxury text-[var(--brand-gold)]">
            {beforeAfterItems.filter((i) => i.showOnHomepage ?? true).length}
          </span>
        </div>
      </div>

      {/* Comparisons Grid */}
      {beforeAfterItems.length === 0 ? (
        <div className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-2xl p-12 text-center space-y-3">
          <Sliders className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-serif-luxury text-slate-200">No Comparisons Added</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Add New Comparison" above to upload high-resolution before and after photos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beforeAfterItems.map((item, index) => {
            const isActive = item.active ?? true;
            const isHomepage = item.showOnHomepage ?? true;

            return (
              <div
                key={item.id}
                className="bg-[var(--brand-primary-deep)] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:border-[var(--brand-gold)]/50 transition-all shadow-lg"
              >
                {/* Images Split Preview Header */}
                <div className="relative h-48 bg-black/40 overflow-hidden group">
                  <div className="grid grid-cols-2 h-full w-full relative">
                    <div className="relative h-full overflow-hidden border-r border-white/20">
                      <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        BEFORE
                      </span>
                    </div>
                    <div className="relative h-full overflow-hidden">
                      <img src={item.afterImage} alt="After" className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[9px] font-bold px-2 py-0.5 rounded-full">
                        AFTER
                      </span>
                    </div>
                  </div>

                  {/* Hover Overlay Button to Test Live Interactive Slider */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-4">
                    <button
                      onClick={() => {
                        setPreviewItem(item);
                        setSliderPos(50);
                      }}
                      className="bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-1.5 hover:bg-white"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Test Live Interactive Slider</span>
                    </button>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wide">
                      {item.concern || 'Hair Revival'}
                    </span>
                    <span className="bg-[var(--brand-primary-dark)] border border-[var(--brand-gold)]/40 text-slate-200 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[var(--brand-gold)]" />
                      <span>{item.treatmentDuration || `${item.days || 30} Days`}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold font-serif-luxury text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-300 font-sans line-clamp-2 font-light">
                    "{item.testimonial || item.description}"
                  </p>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-xs text-slate-400">
                    <User className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                    <span className="font-bold text-slate-200">{item.author || item.customerName}</span>
                    <span>• {item.location || 'India'}</span>
                  </div>
                </div>

                {/* Controls Footer */}
                <div className="p-3 bg-[#052018] border-t border-white/10 flex items-center justify-between text-xs">
                  {/* Reorder Arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(index, 'UP')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'DOWN')}
                      disabled={index === beforeAfterItems.length - 1}
                      className="p-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Active & Homepage Toggles */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateBeforeAfterItem(item.id, {
                          active: !isActive,
                        })
                      }
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                        isActive
                          ? 'border-emerald-500/40 bg-emerald-950 text-emerald-400'
                          : 'border-white/15 text-slate-400'
                      }`}
                    >
                      {isActive ? 'Active' : 'Hidden'}
                    </button>

                    <button
                      onClick={() =>
                        updateBeforeAfterItem(item.id, {
                          showOnHomepage: !isHomepage,
                        })
                      }
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                        isHomepage
                          ? 'border-[var(--brand-gold)] bg-[var(--brand-gold)]/20 text-[var(--brand-gold)]'
                          : 'border-white/15 text-slate-400'
                      }`}
                    >
                      {isHomepage ? 'Homepage: ON' : 'Homepage: OFF'}
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg border border-white/15 text-slate-300 hover:bg-white/10"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-950"
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
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[var(--brand-primary-dark)]">
              <h3 className="text-lg font-bold font-serif-luxury text-slate-100">
                {editingItem ? 'Edit Transformation Comparison' : 'Add Before & After Comparison'}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Title / Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 60 Days Scalp Density Revival"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                {/* Customer Author */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Nair"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Treatment Duration */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Duration Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 Weeks / 90 Days"
                    value={treatmentDuration}
                    onChange={(e) => setTreatmentDuration(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                {/* Concern */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Hair Concern</label>
                  <input
                    type="text"
                    placeholder="e.g. Postpartum Thinning"
                    value={concern}
                    onChange={(e) => setConcern(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Kerala, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              </div>

              {/* Images Upload Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Before Image */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">Before Image *</label>
                  <div className="relative border-2 border-dashed border-white/20 rounded-xl p-3 text-center bg-[var(--brand-primary-dark)] hover:border-[var(--brand-gold)] transition-all">
                    {beforeImage ? (
                      <div className="relative h-36 rounded-lg overflow-hidden group">
                        <img src={beforeImage} alt="Before preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setBeforeImage('')}
                          className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center py-6">
                        <Upload className="w-6 h-6 text-[var(--brand-gold)] mb-1" />
                        <span className="text-xs font-bold text-slate-200">Upload Before Photo</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBM</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageRead(e.target.files[0], setBeforeImage)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* After Image */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">After Image *</label>
                  <div className="relative border-2 border-dashed border-white/20 rounded-xl p-3 text-center bg-[var(--brand-primary-dark)] hover:border-[var(--brand-gold)] transition-all">
                    {afterImage ? (
                      <div className="relative h-36 rounded-lg overflow-hidden group">
                        <img src={afterImage} alt="After preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setAfterImage('')}
                          className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center py-6">
                        <Upload className="w-6 h-6 text-[var(--brand-gold)] mb-1" />
                        <span className="text-xs font-bold text-slate-200">Upload After Photo</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBM</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageRead(e.target.files[0], setAfterImage)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Testimonial Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Customer Testimonial</label>
                <textarea
                  rows={3}
                  placeholder="Describe the customer's ritual routine and results..."
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  className="w-full bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              {/* Visibility Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="accent-[var(--brand-gold)] w-4 h-4 rounded"
                  />
                  <span>Active Live</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnHomepage}
                    onChange={(e) => setShowOnHomepage(e.target.checked)}
                    className="accent-[var(--brand-gold)] w-4 h-4 rounded"
                  />
                  <span>Show on Homepage Section</span>
                </label>
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
                  <span>{editingItem ? 'Save Changes' : 'Publish Comparison'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Interactive Split Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/50 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-4 p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[var(--brand-gold)] text-[10px] font-bold uppercase tracking-wider block">
                  Interactive Simulator
                </span>
                <h3 className="text-xl font-bold font-serif-luxury text-slate-100">{previewItem.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Device Selector */}
                <div className="bg-[var(--brand-primary-dark)] border border-white/15 rounded-xl p-1 flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setPreviewDevice('DESKTOP')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                      previewDevice === 'DESKTOP' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-300'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('MOBILE')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                      previewDevice === 'MOBILE' ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]' : 'text-slate-300'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>

                <button
                  onClick={() => setPreviewItem(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Interactive Split Frame */}
            <div className={`mx-auto transition-all ${previewDevice === 'MOBILE' ? 'max-w-sm' : 'w-full'}`}>
              <div className="relative h-80 rounded-xl overflow-hidden border-2 border-[var(--brand-gold)]/40 shadow-2xl select-none">
                {/* After Image Base */}
                <img src={previewItem.afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg z-10">
                  AFTER
                </span>

                {/* Before Image Overlay with Clip Path */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                >
                  <img src={previewItem.beforeImage} alt="Before" className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg z-10">
                    BEFORE
                  </span>
                </div>

                {/* Vertical Divider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-[var(--brand-gold)] shadow-[0_0_12px_var(--brand-gold)] z-20 pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] flex items-center justify-center font-bold text-xs shadow-xl">
                    ↔
                  </div>
                </div>

                {/* Interactive Drag Input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />
              </div>

              <p className="text-center text-xs text-slate-400 mt-3 font-sans">
                Drag the divider left or right to compare the transformation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--brand-primary-deep)] border border-rose-500/30 rounded-2xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold font-serif-luxury text-slate-100">Delete Comparison?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete this before/after slider?
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
