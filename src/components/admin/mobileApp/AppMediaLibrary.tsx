import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  RefreshCw,
  Eye,
  Filter,
  ExternalLink,
  X,
} from 'lucide-react';
import { MobileAppMediaItem } from '../../../types/mobileApp';
import { resolveAssetUrl } from '../../../app/utils/nativeUrl';

export const AppMediaLibrary: React.FC = () => {
  const [items, setItems] = useState<MobileAppMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MobileAppMediaItem | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/media/mobile-app', { credentials: 'include' });
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Failed to fetch mobile app media', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async (item: MobileAppMediaItem) => {
    if (!window.confirm(`Permanently delete "${item.name}" from the mobile app media library?`)) return;

    try {
      const res = await fetch('/api/media/mobile-app', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ filename: item.filename, folder: item.folder }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        alert(data.error || 'Failed to delete file');
      }
    } catch (err: any) {
      alert(err.message || 'Network error deleting file');
    }
  };

  const handleDirectUpload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const targetFolder = activeFolder === 'all' ? 'general' : activeFolder;

      const res = await fetch(`/api/upload/mobile-app?folder=${targetFolder}`, {
        method: 'POST',
        credentials: 'include',
        body: form,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      await fetchMedia();
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const folders = [
    { id: 'all', label: 'All App Media' },
    { id: 'heroes', label: 'Heroes (/heroes)' },
    { id: 'products', label: 'Products (/products)' },
    { id: 'banners', label: 'Banners (/banners)' },
    { id: 'categories', label: 'Categories (/categories)' },
    { id: 'concerns', label: 'Concerns (/concerns)' },
    { id: 'branding', label: 'Branding (/branding)' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesFolder = activeFolder === 'all' || item.folder === activeFolder;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#C5A059]" />
            <span>Dedicated Mobile App Media Library</span>
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Manages persistent assets isolated under <code>/uploads/mobile-app/</code>. Website assets are kept completely separate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <div className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[#d4af37] transition-all">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload Media to App'}</span>
            </div>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleDirectUpload(file);
              }}
            />
          </label>

          <button
            type="button"
            onClick={fetchMedia}
            className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {folders.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFolder(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFolder === f.id
                  ? 'bg-[#C5A059] text-[#0E382C]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filenames..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#C5A059]"
          />
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading mobile app media library...</div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-slate-400 space-y-2">
          <p>No media files found in this category.</p>
          <p className="text-[11px] text-slate-500">
            Upload heroes, products, banners, categories, concerns or branding assets using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {filteredItems.map((item) => {
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-black/30 border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-[#C5A059]/40 transition-all"
              >
                <div
                  onClick={() => setPreviewItem(item)}
                  className="relative aspect-square w-full bg-slate-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={resolveAssetUrl(item.url)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/hero_tribal_elders.jpg';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-[#C5A059] px-2 py-0.5 rounded text-[9px] font-mono">
                    {item.folder}
                  </div>
                </div>

                <div className="p-2.5 space-y-1.5">
                  <div className="text-[11px] font-bold text-white truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>{Math.round(item.size / 1024)} KB</span>
                    <span>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : ''}</span>
                  </div>

                  <div className="pt-1.5 border-t border-white/10 flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item.url)}
                      className="px-2 py-1 rounded-lg bg-white/10 text-slate-300 hover:text-white text-[10px] font-semibold flex items-center gap-1 flex-1 justify-center"
                      title="Copy URL"
                    >
                      {copiedUrl === item.url ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="p-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      title="Delete file"
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

      {/* Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-[#0c2920] border border-[#C5A059]/40 rounded-3xl max-w-xl w-full p-5 text-white shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="font-serif text-sm font-bold text-white truncate max-w-md">
                {previewItem.name}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="w-7 h-7 rounded-full bg-white/10 text-slate-300 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative max-h-[60vh] overflow-hidden rounded-2xl bg-black/50 flex items-center justify-center">
              <img
                src={resolveAssetUrl(previewItem.url)}
                alt={previewItem.name}
                className="max-h-[55vh] max-w-full object-contain"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs">
              <code className="text-[11px] text-emerald-200 font-mono truncate select-all">
                {previewItem.url}
              </code>
              <button
                type="button"
                onClick={() => handleCopyUrl(previewItem.url)}
                className="px-3 py-1.5 rounded-lg bg-[#C5A059] text-[#0E382C] font-bold text-xs flex items-center gap-1 flex-shrink-0"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Path</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
