import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  GlobalClientCountry,
  GlobalClientStory,
  GlobalClientType,
  GlobalClientRelationshipType,
  GlobalClientStoryVideo,
} from '../../types/store';
import { WORLD_COUNTRIES } from '../../data/countriesData';
import { uploadFileToServer } from '../../utils/upload';
import { RichStoryRenderer } from '../common/RichStoryRenderer';
import { GlobalClientVideoPlayer } from '../common/GlobalClientVideoPlayer';
import {
  Globe,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Search,
  Upload,
  X,
  Calendar,
  Sparkles,
  Building2,
  MapPin,
  Award,
  Video,
  Image as ImageIcon,
  Bold,
  Italic,
  Heading,
  Quote,
  List,
  ExternalLink,
  Check,
  Star,
  Layers,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface AdminGlobalClientsManagerProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const CLIENT_TYPES: GlobalClientType[] = [
  'Distributor',
  'Retailer',
  'Wholesale Buyer',
  'Exhibition Client',
  'Business Partner',
  'Other',
];

const RELATIONSHIP_TYPES: GlobalClientRelationshipType[] = [
  'Client visited HAKKIVEDA',
  'HAKKIVEDA visited client',
  'Exhibition meeting',
  'Distributor meeting',
  'Wholesale order',
  'Retail partnership',
  'Other',
];

export const AdminGlobalClientsManager: React.FC<AdminGlobalClientsManagerProps> = ({ showToast }) => {
  const {
    globalClientCountries,
    globalClientStories,
    addGlobalClientCountry,
    updateGlobalClientCountry,
    deleteGlobalClientCountry,
    addGlobalClientStory,
    updateGlobalClientStory,
    deleteGlobalClientStory,
    products,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'COUNTRIES' | 'STORIES'>('COUNTRIES');
  const [searchTerm, setSearchTerm] = useState('');

  // ----------------------------------------------------
  // COUNTRY MODAL & FORM STATE
  // ----------------------------------------------------
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<GlobalClientCountry | null>(null);
  const [deleteCountryId, setDeleteCountryId] = useState<string | null>(null);

  const [countryName, setCountryName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [flag, setFlag] = useState('');
  const [countrySlug, setCountrySlug] = useState('');
  const [countryCoverImage, setCountryCoverImage] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [countrySeoTitle, setCountrySeoTitle] = useState('');
  const [countrySeoMetaDescription, setCountrySeoMetaDescription] = useState('');
  const [countryPublished, setCountryPublished] = useState(true);
  const [countryDisplayOrder, setCountryDisplayOrder] = useState(1);
  const [isUploadingCountryCover, setIsUploadingCountryCover] = useState(false);

  // ----------------------------------------------------
  // STORY MODAL & FORM STATE
  // ----------------------------------------------------
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<GlobalClientStory | null>(null);
  const [deleteStoryId, setDeleteStoryId] = useState<string | null>(null);
  const [previewStory, setPreviewStory] = useState<GlobalClientStory | null>(null);

  const [storyTitle, setStoryTitle] = useState('');
  const [storySlug, setStorySlug] = useState('');
  const [storyCountryId, setStoryCountryId] = useState('');
  const [clientName, setClientName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [clientType, setClientType] = useState<GlobalClientType>('Distributor');
  const [relationshipType, setRelationshipType] = useState<GlobalClientRelationshipType>('Distributor meeting');
  const [meetingDate, setMeetingDate] = useState('');
  const [storyShortDescription, setStoryShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [contentEditorTab, setContentEditorTab] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  const [productsPurchased, setProductsPurchased] = useState('');
  const [linkedProductIds, setLinkedProductIds] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<GlobalClientStoryVideo[]>([]);
  const [testimonialQuote, setTestimonialQuote] = useState('');
  const [testimonialAuthor, setTestimonialAuthor] = useState('');
  const [testimonialDesignation, setTestimonialDesignation] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [socialUrl, setSocialUrl] = useState('');
  const [storyFeatured, setStoryFeatured] = useState(false);
  const [storyPublished, setStoryPublished] = useState(true);
  const [storyDisplayOrder, setStoryDisplayOrder] = useState(1);
  const [storySeoTitle, setStorySeoTitle] = useState('');
  const [storySeoMetaDescription, setStorySeoMetaDescription] = useState('');

  // Media upload states
  const [isUploadingStoryCover, setIsUploadingStoryCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoType, setNewVideoType] = useState<'youtube' | 'vimeo' | 'mp4'>('youtube');

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // ----------------------------------------------------
  // COUNTRY HANDLERS
  // ----------------------------------------------------
  const openNewCountryModal = () => {
    setEditingCountry(null);
    setCountryName('');
    setCountryCode('');
    setFlag('🌐');
    setCountrySlug('');
    setCountryCoverImage('/images/hero_tribal_elders.jpg');
    setShortDescription('');
    setCountrySeoTitle('');
    setCountrySeoMetaDescription('');
    setCountryPublished(true);
    setCountryDisplayOrder((globalClientCountries?.length || 0) + 1);
    setIsCountryModalOpen(true);
  };

  const openEditCountryModal = (country: GlobalClientCountry) => {
    setEditingCountry(country);
    setCountryName(country.countryName);
    setCountryCode(country.countryCode);
    setFlag(country.flag);
    setCountrySlug(country.slug);
    setCountryCoverImage(country.countryCoverImage);
    setShortDescription(country.shortDescription);
    setCountrySeoTitle(country.seoTitle || '');
    setCountrySeoMetaDescription(country.seoMetaDescription || '');
    setCountryPublished(country.published);
    setCountryDisplayOrder(country.displayOrder || 1);
    setIsCountryModalOpen(true);
  };

  const handleCountryNameChange = (name: string) => {
    setCountryName(name);
    if (!editingCountry) {
      setCountrySlug(slugify(name));
      setCountrySeoTitle(`HAKKIVEDA Clients in ${name} | International Stories`);
    }
  };

  const handleSelectPredefinedCountry = (iso: string) => {
    const found = WORLD_COUNTRIES.find((c) => c.iso2.toUpperCase() === iso.toUpperCase());
    if (found) {
      handleCountryNameChange(found.name);
      setCountryCode(found.iso2);
      setFlag(found.flag);
    }
  };

  const handleCountryCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingCountryCover(true);
      const url = await uploadFileToServer(file);
      setCountryCoverImage(url);
      showToast('Country cover image uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload cover image', 'error');
    } finally {
      setIsUploadingCountryCover(false);
    }
  };

  const handleSaveCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!countryName.trim()) {
      showToast('Country name is required', 'error');
      return;
    }
    const slug = countrySlug.trim() || slugify(countryName);

    const countryPayload = {
      countryName: countryName.trim(),
      countryCode: countryCode.trim().toUpperCase() || 'GL',
      flag: flag.trim() || '🌐',
      slug,
      countryCoverImage: countryCoverImage.trim() || '/images/hero_tribal_elders.jpg',
      shortDescription: shortDescription.trim(),
      seoTitle: countrySeoTitle.trim(),
      seoMetaDescription: countrySeoMetaDescription.trim(),
      published: countryPublished,
      displayOrder: Number(countryDisplayOrder) || 1,
    };

    if (editingCountry) {
      await updateGlobalClientCountry(editingCountry.id, countryPayload);
      showToast(`Updated country: ${countryName}`, 'success');
    } else {
      await addGlobalClientCountry(countryPayload);
      showToast(`Added new country: ${countryName}`, 'success');
    }
    setIsCountryModalOpen(false);
  };

  const handleDeleteCountry = async () => {
    if (!deleteCountryId) return;
    await deleteGlobalClientCountry(deleteCountryId);
    showToast('Country deleted successfully', 'info');
    setDeleteCountryId(null);
  };

  // ----------------------------------------------------
  // STORY HANDLERS
  // ----------------------------------------------------
  const openNewStoryModal = () => {
    setEditingStory(null);
    setStoryTitle('');
    setStorySlug('');
    setStoryCountryId(globalClientCountries[0]?.id || '');
    setClientName('');
    setBusinessName('');
    setCity('');
    setClientType('Distributor');
    setRelationshipType('Distributor meeting');
    setMeetingDate('');
    setStoryShortDescription('');
    setContent('');
    setContentEditorTab('EDIT');
    setProductsPurchased('');
    setLinkedProductIds([]);
    setCoverImage('/images/hero_tribal_elders.jpg');
    setGalleryImages([]);
    setVideos([]);
    setTestimonialQuote('');
    setTestimonialAuthor('');
    setTestimonialDesignation('');
    setWebsiteUrl('');
    setSocialUrl('');
    setStoryFeatured(false);
    setStoryPublished(true);
    setStoryDisplayOrder((globalClientStories?.length || 0) + 1);
    setStorySeoTitle('');
    setStorySeoMetaDescription('');
    setIsStoryModalOpen(true);
  };

  const openEditStoryModal = (story: GlobalClientStory) => {
    setEditingStory(story);
    setStoryTitle(story.title);
    setStorySlug(story.slug);
    setStoryCountryId(story.countryId);
    setClientName(story.clientName || '');
    setBusinessName(story.businessName || '');
    setCity(story.city || '');
    setClientType(story.clientType || 'Distributor');
    setRelationshipType(story.relationshipType || 'Distributor meeting');
    setMeetingDate(story.meetingDate || '');
    setStoryShortDescription(story.shortDescription || '');
    setContent(story.content || '');
    setContentEditorTab('EDIT');
    setProductsPurchased(story.productsPurchased || '');
    setLinkedProductIds(story.linkedProductIds || []);
    setCoverImage(story.coverImage || '');
    setGalleryImages(story.galleryImages || []);
    setVideos(story.videos || []);
    setTestimonialQuote(story.testimonial?.quote || '');
    setTestimonialAuthor(story.testimonial?.authorName || '');
    setTestimonialDesignation(story.testimonial?.designation || '');
    setWebsiteUrl(story.websiteUrl || '');
    setSocialUrl(story.socialUrl || '');
    setStoryFeatured(Boolean(story.featured));
    setStoryPublished(Boolean(story.published));
    setStoryDisplayOrder(story.displayOrder || 1);
    setStorySeoTitle(story.seoTitle || '');
    setStorySeoMetaDescription(story.seoMetaDescription || '');
    setIsStoryModalOpen(true);
  };

  const handleStoryTitleChange = (t: string) => {
    setStoryTitle(t);
    if (!editingStory) {
      setStorySlug(slugify(t));
      setStorySeoTitle(`${t} | HAKKIVEDA Client Story`);
    }
  };

  const handleStoryCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingStoryCover(true);
      const url = await uploadFileToServer(file);
      setCoverImage(url);
      showToast('Story cover image uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload cover image', 'error');
    } finally {
      setIsUploadingStoryCover(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setIsUploadingGallery(true);
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFileToServer(files[i]);
        uploadedUrls.push(url);
      }
      setGalleryImages((prev) => [...prev, ...uploadedUrls]);
      showToast(`Uploaded ${uploadedUrls.length} gallery photo(s)`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload gallery images', 'error');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingVideo(true);
      const url = await uploadFileToServer(file);
      const newVid: GlobalClientStoryVideo = {
        id: `vid-${Date.now()}`,
        type: 'mp4',
        url,
        title: file.name.replace(/\.[^/.]+$/, ''),
      };
      setVideos((prev) => [...prev, newVid]);
      showToast('MP4 video uploaded and added to story!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload video file', 'error');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleAddExternalVideo = () => {
    if (!newVideoUrl.trim()) return;
    const newVid: GlobalClientStoryVideo = {
      id: `vid-${Date.now()}`,
      type: newVideoType,
      url: newVideoUrl.trim(),
      title: newVideoTitle.trim() || undefined,
    };
    setVideos((prev) => [...prev, newVid]);
    setNewVideoUrl('');
    setNewVideoTitle('');
    showToast('Video added to gallery!', 'success');
  };

  const handleRemoveVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  // Helper to insert markdown formatting in story editor
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 50);
  };

  const toggleLinkedProduct = (productId: string) => {
    setLinkedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim()) {
      showToast('Story title is required', 'error');
      return;
    }
    if (!storyCountryId) {
      showToast('Please select a country for this client story', 'error');
      return;
    }

    const slug = storySlug.trim() || slugify(storyTitle);

    const storyPayload = {
      title: storyTitle.trim(),
      slug,
      countryId: storyCountryId,
      clientName: clientName.trim(),
      businessName: businessName.trim(),
      city: city.trim(),
      clientType,
      relationshipType,
      meetingDate: meetingDate.trim(),
      shortDescription: storyShortDescription.trim(),
      content: content.trim(),
      productsPurchased: productsPurchased.trim(),
      linkedProductIds,
      coverImage: coverImage.trim() || '/images/hero_tribal_elders.jpg',
      galleryImages,
      videos,
      testimonial: testimonialQuote.trim()
        ? {
            quote: testimonialQuote.trim(),
            authorName: testimonialAuthor.trim() || undefined,
            designation: testimonialDesignation.trim() || undefined,
          }
        : undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      socialUrl: socialUrl.trim() || undefined,
      featured: storyFeatured,
      published: storyPublished,
      displayOrder: Number(storyDisplayOrder) || 1,
      seoTitle: storySeoTitle.trim(),
      seoMetaDescription: storySeoMetaDescription.trim(),
    };

    if (editingStory) {
      await updateGlobalClientStory(editingStory.id, storyPayload);
      showToast(`Updated client story: ${storyTitle}`, 'success');
    } else {
      await addGlobalClientStory(storyPayload);
      showToast(`Added new client story: ${storyTitle}`, 'success');
    }
    setIsStoryModalOpen(false);
  };

  const handleDeleteStory = async () => {
    if (!deleteStoryId) return;
    await deleteGlobalClientStory(deleteStoryId);
    showToast('Client story deleted successfully', 'info');
    setDeleteStoryId(null);
  };

  // ----------------------------------------------------
  // FILTERED DATA
  // ----------------------------------------------------
  const filteredCountries = (globalClientCountries || []).filter((c) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.countryName.toLowerCase().includes(term) ||
      c.countryCode.toLowerCase().includes(term) ||
      c.slug.toLowerCase().includes(term)
    );
  });

  const filteredStories = (globalClientStories || []).filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.title.toLowerCase().includes(term) ||
      s.clientName.toLowerCase().includes(term) ||
      s.businessName.toLowerCase().includes(term) ||
      s.city.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[var(--brand-gold)]" />
            <h2 className="font-serif text-2xl font-bold text-[var(--color-heading)]">
              Global Clients & International Stories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Manage international market showcases, country pages, and editorial client case studies.
          </p>
        </div>

        {/* Tab Switcher & Primary Action */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl bg-[var(--color-bg)] p-1 border border-[var(--color-border)]">
            <button
              onClick={() => setActiveTab('COUNTRIES')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'COUNTRIES'
                  ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-heading)]'
              }`}
            >
              Countries ({globalClientCountries?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('STORIES')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'STORIES'
                  ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] shadow'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-heading)]'
              }`}
            >
              Client Stories ({globalClientStories?.length || 0})
            </button>
          </div>

          {activeTab === 'COUNTRIES' ? (
            <button
              onClick={openNewCountryModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow"
            >
              <Plus className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>ADD COUNTRY</span>
            </button>
          ) : (
            <button
              onClick={openNewStoryModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-dark)] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow"
            >
              <Plus className="w-4 h-4 text-[var(--brand-gold)]" />
              <span>ADD CLIENT STORY</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${activeTab.toLowerCase()} by name, title, region...`}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-heading)]"
          >
            Clear
          </button>
        )}
      </div>

      {/* ========================================================== */}
      {/* TAB 1: COUNTRIES MANAGER                                    */}
      {/* ========================================================== */}
      {activeTab === 'COUNTRIES' && (
        <div className="space-y-4">
          {filteredCountries.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <Globe className="w-10 h-10 text-[var(--brand-gold)] mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-sm text-[var(--color-heading)]">No countries found</p>
              <button
                onClick={openNewCountryModal}
                className="mt-3 px-4 py-2 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold uppercase"
              >
                Add Your First Country
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
              <table className="w-full text-left text-xs text-[var(--color-text)]">
                <thead className="bg-[var(--color-bg)] uppercase text-[10px] tracking-wider text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Stories</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {filteredCountries.map((country) => {
                    const storiesCount = (globalClientStories || []).filter(
                      (s) => s.countryId === country.id || s.countryId === country.slug
                    ).length;

                    return (
                      <tr key={country.id} className="hover:bg-[var(--color-bg)]/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[var(--brand-gold)]">
                          #{country.displayOrder || 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={country.countryCoverImage || '/images/hero_tribal_elders.jpg'}
                              alt={country.countryName}
                              className="w-12 h-9 rounded-lg object-cover border border-[var(--color-border)] shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-[var(--color-heading)]">
                                <span>{country.flag}</span>
                                <span>{country.countryName}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                                  {country.countryCode}
                                </span>
                              </div>
                              <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1 max-w-xs">
                                {country.shortDescription || 'No description'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-[var(--color-text-secondary)]">
                          /global-clients/{country.slug}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-[var(--brand-gold)]/15 border border-[var(--brand-gold)]/30 text-[var(--brand-gold)] font-bold text-[11px]">
                            {storiesCount} {storiesCount === 1 ? 'story' : 'stories'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() =>
                              updateGlobalClientCountry(country.id, { published: !country.published })
                            }
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              country.published
                                ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                                : 'bg-stone-500/15 text-stone-500 border border-stone-500/30'
                            }`}
                          >
                            {country.published ? 'Published' : 'Hidden'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <a
                              href={`/global-clients/${country.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-[var(--color-text-secondary)] hover:text-[var(--brand-gold)]"
                              title="View Country Page"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => openEditCountryModal(country)}
                              className="p-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-[var(--color-text-secondary)] hover:text-[var(--brand-gold)]"
                              title="Edit Country"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteCountryId(country.id)}
                              className="p-1.5 rounded-lg border border-[var(--color-border)] hover:border-red-500 text-[var(--color-text-secondary)] hover:text-red-500"
                              title="Delete Country"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 2: CLIENT STORIES MANAGER                               */}
      {/* ========================================================== */}
      {activeTab === 'STORIES' && (
        <div className="space-y-4">
          {filteredStories.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <Building2 className="w-10 h-10 text-[var(--brand-gold)] mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-sm text-[var(--color-heading)]">No client stories found</p>
              <button
                onClick={openNewStoryModal}
                className="mt-3 px-4 py-2 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold uppercase"
              >
                Create Your First Story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => {
                const country = (globalClientCountries || []).find(
                  (c) => c.id === story.countryId || c.slug === story.countryId
                );

                return (
                  <div
                    key={story.id}
                    className="flex flex-col rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] bg-[var(--brand-primary-dark)] overflow-hidden">
                      <img
                        src={story.coverImage || '/images/hero_tribal_elders.jpg'}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        {country && (
                          <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold">
                            {country.flag} {country.countryName}
                          </span>
                        )}
                        {story.clientType && (
                          <span className="px-2 py-0.5 rounded-full bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-[10px] font-bold uppercase">
                            {story.clientType}
                          </span>
                        )}
                      </div>

                      {/* Featured Star toggle */}
                      <button
                        onClick={() => updateGlobalClientStory(story.id, { featured: !story.featured })}
                        className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                          story.featured
                            ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                            : 'bg-black/50 text-white/70 hover:text-white'
                        }`}
                        title={story.featured ? 'Featured on homepage' : 'Mark as featured'}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <div className="absolute bottom-2 left-2 text-white text-xs font-semibold drop-shadow">
                        {story.businessName || story.clientName}
                        {story.city && <span className="font-normal opacity-80"> • {story.city}</span>}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-serif text-base font-bold text-[var(--color-heading)] line-clamp-2">
                          {story.title}
                        </h3>
                        <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2">
                          {story.shortDescription}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                        <button
                          onClick={() => updateGlobalClientStory(story.id, { published: !story.published })}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            story.published
                              ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                              : 'bg-stone-500/15 text-stone-500 border border-stone-500/30'
                          }`}
                        >
                          {story.published ? 'Published' : 'Draft'}
                        </button>

                        <div className="flex items-center gap-2">
                          <a
                            href={`/global-clients/${country ? country.slug : story.countryId}/${story.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-[var(--color-text-secondary)] hover:text-[var(--brand-gold)]"
                            title="Preview Story Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => openEditStoryModal(story)}
                            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-[var(--color-text-secondary)] hover:text-[var(--brand-gold)]"
                            title="Edit Story"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteStoryId(story.id)}
                            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:border-red-500 text-[var(--color-text-secondary)] hover:text-red-500"
                            title="Delete Story"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* COUNTRY MODAL (ADD / EDIT)                                 */}
      {/* ========================================================== */}
      {isCountryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setIsCountryModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--color-bg)] text-[var(--color-text-secondary)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                COUNTRY SETTINGS
              </span>
              <h3 className="font-serif text-2xl font-bold text-[var(--color-heading)]">
                {editingCountry ? `Edit Country: ${editingCountry.countryName}` : 'Add International Country Directory'}
              </h3>
            </div>

            <form onSubmit={handleSaveCountry} className="space-y-5">
              {/* Quick Select from WORLD_COUNTRIES */}
              {!editingCountry && (
                <div className="p-3.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-2">
                  <label className="block text-xs font-bold text-[var(--color-heading)]">
                    Quick-Fill from World Countries
                  </label>
                  <select
                    onChange={(e) => handleSelectPredefinedCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  >
                    <option value="">-- Choose Country to Auto-Fill --</option>
                    {WORLD_COUNTRIES.map((wc) => (
                      <option key={wc.code} value={wc.iso2}>
                        {wc.flag} {wc.name} ({wc.iso2})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">Country Name *</label>
                  <input
                    type="text"
                    required
                    value={countryName}
                    onChange={(e) => handleCountryNameChange(e.target.value)}
                    placeholder="e.g. Nepal, Mauritius, Singapore"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">Flag Emoji</label>
                  <input
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="e.g. 🇳🇵"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">ISO Code</label>
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                    placeholder="e.g. NP, MU, SG"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs uppercase font-mono text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={countrySlug}
                    onChange={(e) => setCountrySlug(slugify(e.target.value))}
                    placeholder="e.g. nepal"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--color-heading)]">
                  Country Cover Image (Shown on cards & hero)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={countryCoverImage}
                    onChange={(e) => setCountryCoverImage(e.target.value)}
                    placeholder="Image URL or upload file"
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-xs font-bold text-[var(--color-heading)] cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                    <span>{isUploadingCountryCover ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCountryCoverUpload}
                      disabled={isUploadingCountryCover}
                      className="hidden"
                    />
                  </label>
                </div>
                {countryCoverImage && (
                  <div className="w-32 h-20 rounded-xl overflow-hidden border border-[var(--color-border)]">
                    <img src={countryCoverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--color-heading)]">Short Description</label>
                <textarea
                  rows={3}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Summary of partner networks, clinics, and stockists in this country..."
                  className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              {/* SEO Title & Meta */}
              <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                  SEO & Social Sharing
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={countrySeoTitle}
                    onChange={(e) => setCountrySeoTitle(e.target.value)}
                    placeholder="SEO Page Title"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                  <textarea
                    rows={2}
                    value={countrySeoMetaDescription}
                    onChange={(e) => setCountrySeoMetaDescription(e.target.value)}
                    placeholder="SEO Meta Description"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              </div>

              {/* Publish & Order */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[var(--color-heading)]">
                  <input
                    type="checkbox"
                    checked={countryPublished}
                    onChange={(e) => setCountryPublished(e.target.checked)}
                    className="rounded border-[var(--color-border)] text-[var(--brand-gold)] focus:ring-[var(--brand-gold)]"
                  />
                  <span>Published & Visible on Website</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-text-secondary)]">Display Order:</span>
                  <input
                    type="number"
                    min={1}
                    value={countryDisplayOrder}
                    onChange={(e) => setCountryDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-center font-bold text-[var(--color-heading)]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCountryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold uppercase tracking-wider hover:bg-amber-400 shadow-md"
                >
                  {editingCountry ? 'Save Changes' : 'Create Country'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* STORY MODAL (ADD / EDIT)                                   */}
      {/* ========================================================== */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsStoryModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[var(--color-bg)] text-[var(--color-text-secondary)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                CLIENT CASE STUDY & BLOG
              </span>
              <h3 className="font-serif text-2xl font-bold text-[var(--color-heading)]">
                {editingStory ? `Edit Story: ${editingStory.title}` : 'Add International Client Story'}
              </h3>
            </div>

            <form onSubmit={handleSaveStory} className="space-y-6">
              {/* Country & Client Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">Country *</label>
                  <select
                    required
                    value={storyCountryId}
                    onChange={(e) => setStoryCountryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  >
                    <option value="">-- Select Country --</option>
                    {globalClientCountries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.countryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">Business / Store Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Sanjeevani Naturals"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">Contact Person Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">Story Title *</label>
                  <input
                    type="text"
                    required
                    value={storyTitle}
                    onChange={(e) => handleStoryTitleChange(e.target.value)}
                    placeholder="e.g. HAKKIVEDA × Sanjeevani Naturals Nepal"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">Story URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={storySlug}
                    onChange={(e) => setStorySlug(slugify(e.target.value))}
                    placeholder="e.g. sanjeevani-naturals"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              </div>

              {/* City, Client Type, Relationship Type, Meeting Date */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">City / Region</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kathmandu"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">Client Type</label>
                  <select
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value as GlobalClientType)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  >
                    {CLIENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">Relationship Type</label>
                  <select
                    value={relationshipType}
                    onChange={(e) => setRelationshipType(e.target.value as GlobalClientRelationshipType)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  >
                    {RELATIONSHIP_TYPES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">Meeting / Order Date</label>
                  <input
                    type="text"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                    placeholder="e.g. October 2024"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--color-heading)]">
                  Short Description / Excerpt (Displayed on Cards & Summary)
                </label>
                <textarea
                  rows={2}
                  value={storyShortDescription}
                  onChange={(e) => setStoryShortDescription(e.target.value)}
                  placeholder="How this international client discovered HAKKIVEDA and the results they achieved..."
                  className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                />
              </div>

              {/* Rich Story Content Editor with Toolbar & Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">
                    Full Case Study / Story Content (Rich Formatting Supported)
                  </label>
                  <div className="inline-flex rounded-lg bg-[var(--color-bg)] p-0.5 border border-[var(--color-border)] text-xs">
                    <button
                      type="button"
                      onClick={() => setContentEditorTab('EDIT')}
                      className={`px-3 py-1 rounded-md font-bold ${
                        contentEditorTab === 'EDIT'
                          ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                          : 'text-[var(--color-text-secondary)]'
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentEditorTab('PREVIEW')}
                      className={`px-3 py-1 rounded-md font-bold ${
                        contentEditorTab === 'PREVIEW'
                          ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                          : 'text-[var(--color-text-secondary)]'
                      }`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>

                {contentEditorTab === 'EDIT' ? (
                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden">
                    {/* Formatting Toolbar */}
                    <div className="p-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex flex-wrap items-center gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => insertFormatting('## ')}
                        className="px-2 py-1 rounded hover:bg-[var(--color-bg)] font-bold text-[var(--color-heading)]"
                        title="Add Section Heading"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('### ')}
                        className="px-2 py-1 rounded hover:bg-[var(--color-bg)] font-semibold text-[var(--color-heading)]"
                        title="Add Sub-heading"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('**', '**')}
                        className="p-1 rounded hover:bg-[var(--color-bg)] text-[var(--color-heading)]"
                        title="Bold"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('*', '*')}
                        className="p-1 rounded hover:bg-[var(--color-bg)] text-[var(--color-heading)]"
                        title="Italic"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('> ')}
                        className="p-1 rounded hover:bg-[var(--color-bg)] text-[var(--color-heading)]"
                        title="Blockquote"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('- ')}
                        className="p-1 rounded hover:bg-[var(--color-bg)] text-[var(--color-heading)]"
                        title="Bullet List"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      ref={contentTextareaRef}
                      rows={10}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={`## Section Title\n\nWrite the comprehensive client story here. You can use markdown headings, paragraphs, bullet points, and quotes.\n\n> "Client quote here"`}
                      className="w-full p-4 bg-transparent text-xs sm:text-sm text-[var(--color-heading)] focus:outline-none font-sans leading-relaxed"
                    />
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] max-h-96 overflow-y-auto">
                    <RichStoryRenderer content={content} />
                  </div>
                )}
              </div>

              {/* Products Purchased Text & Linked Products */}
              <div className="space-y-3 p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                  Products Supplied & Catalog Association
                </span>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">
                    Products Purchased Summary Text
                  </label>
                  <input
                    type="text"
                    value={productsPurchased}
                    onChange={(e) => setProductsPurchased(e.target.value)}
                    placeholder="e.g. HAKKIVEDA 108 Herbs Hair Oil (500ml), Root Density Scalp Serum"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">
                    Link Existing Store Formulations (Shown under "PRODUCTS SUPPLIED")
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                    {products.map((prod) => {
                      const isLinked = linkedProductIds.includes(prod.id);
                      return (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => toggleLinkedProduct(prod.id)}
                          className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-colors border ${
                            isLinked
                              ? 'bg-[var(--brand-gold)]/15 border-[var(--brand-gold)] text-[var(--color-heading)] font-semibold'
                              : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 ${
                              isLinked
                                ? 'bg-[var(--brand-gold)] border-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                                : 'border-[var(--color-border)]'
                            }`}
                          >
                            {isLinked && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className="truncate">{prod.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--color-heading)]">Story Cover Image *</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="Cover Image URL or upload file"
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-xs font-bold text-[var(--color-heading)] cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                    <span>{isUploadingStoryCover ? 'Uploading...' : 'Upload Cover'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleStoryCoverUpload}
                      disabled={isUploadingStoryCover}
                      className="hidden"
                    />
                  </label>
                </div>
                {coverImage && (
                  <div className="w-40 h-24 rounded-xl overflow-hidden border border-[var(--color-border)]">
                    <img src={coverImage} alt="Story cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Gallery Photos Upload */}
              <div className="space-y-3 p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                    Photo Gallery ({galleryImages.length})
                  </span>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-xs font-bold text-[var(--color-heading)] cursor-pointer">
                    <Upload className="w-3 h-3 text-[var(--brand-gold)]" />
                    <span>{isUploadingGallery ? 'Uploading...' : 'Upload Photos'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      disabled={isUploadingGallery}
                      className="hidden"
                    />
                  </label>
                </div>

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-[var(--color-border)]"
                      >
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos Section */}
              <div className="space-y-3 p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                  Video Archive (MP4 File Upload, YouTube, Vimeo)
                </span>

                {/* Add External Video Form */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={newVideoType}
                    onChange={(e) => setNewVideoType(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-heading)]"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="mp4">MP4 URL</option>
                  </select>

                  <input
                    type="text"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-heading)]"
                  />

                  <input
                    type="text"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    placeholder="Video Title (Optional)"
                    className="w-44 px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-heading)]"
                  />

                  <button
                    type="button"
                    onClick={handleAddExternalVideo}
                    className="px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-xs font-bold text-[var(--color-heading)]"
                  >
                    Add URL
                  </button>

                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--brand-gold)] text-xs font-bold text-[var(--color-heading)] cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[var(--brand-gold)]" />
                    <span>{isUploadingVideo ? 'Uploading MP4...' : 'Upload MP4 File'}</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={handleVideoFileUpload}
                      disabled={isUploadingVideo}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Videos list */}
                {videos.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {videos.map((vid) => (
                      <div
                        key={vid.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Video className="w-3.5 h-3.5 text-[var(--brand-gold)] shrink-0" />
                          <span className="font-semibold uppercase text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg)]">
                            {vid.type}
                          </span>
                          <span className="font-medium truncate">{vid.title || vid.url}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(vid.id)}
                          className="p-1 rounded text-red-500 hover:bg-red-50"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Client Testimonial */}
              <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                  Client Quote / Testimonial (Optional)
                </span>
                <textarea
                  rows={2}
                  value={testimonialQuote}
                  onChange={(e) => setTestimonialQuote(e.target.value)}
                  placeholder="Direct client quotation endorsing HAKKIVEDA..."
                  className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-heading)] focus:outline-none focus:border-[var(--brand-gold)]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={testimonialAuthor}
                    onChange={(e) => setTestimonialAuthor(e.target.value)}
                    placeholder="Author Name (e.g. Aarav Sharma)"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-heading)]"
                  />
                  <input
                    type="text"
                    value={testimonialDesignation}
                    onChange={(e) => setTestimonialDesignation(e.target.value)}
                    placeholder="Designation (e.g. Managing Director)"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-heading)]"
                  />
                </div>
              </div>

              {/* Verified Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">Client Website URL</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-heading)]">Client Social Profile</label>
                  <input
                    type="url"
                    value={socialUrl}
                    onChange={(e) => setSocialUrl(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-heading)]"
                  />
                </div>
              </div>

              {/* SEO Title & Meta */}
              <div className="p-4 rounded-2xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-gold)]">
                  SEO & Meta Data
                </span>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={storySeoTitle}
                    onChange={(e) => setStorySeoTitle(e.target.value)}
                    placeholder="SEO Page Title"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-heading)]"
                  />
                  <textarea
                    rows={2}
                    value={storySeoMetaDescription}
                    onChange={(e) => setStorySeoMetaDescription(e.target.value)}
                    placeholder="SEO Meta Description"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-heading)]"
                  />
                </div>
              </div>

              {/* Featured, Publish & Display Order */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[var(--color-heading)]">
                    <input
                      type="checkbox"
                      checked={storyFeatured}
                      onChange={(e) => setStoryFeatured(e.target.checked)}
                      className="rounded border-[var(--color-border)] text-[var(--brand-gold)] focus:ring-[var(--brand-gold)]"
                    />
                    <span>Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[var(--color-heading)]">
                    <input
                      type="checkbox"
                      checked={storyPublished}
                      onChange={(e) => setStoryPublished(e.target.checked)}
                      className="rounded border-[var(--color-border)] text-[var(--brand-gold)] focus:ring-[var(--brand-gold)]"
                    />
                    <span>Published</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--color-text-secondary)]">Display Order:</span>
                  <input
                    type="number"
                    min={1}
                    value={storyDisplayOrder}
                    onChange={(e) => setStoryDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-center font-bold text-[var(--color-heading)]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] text-xs font-bold uppercase tracking-wider hover:bg-amber-400 shadow-md"
                >
                  {editingStory ? 'Save Changes' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Country Confirmation Modal */}
      {deleteCountryId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 text-center space-y-4">
            <Trash2 className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[var(--color-heading)]">Delete this Country?</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              This action cannot be undone. Any stories associated with this country will remain in the database.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteCountryId(null)}
                className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCountry}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold uppercase"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Story Confirmation Modal */}
      {deleteStoryId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 text-center space-y-4">
            <Trash2 className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[var(--color-heading)]">Delete this Story?</h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Are you sure you want to permanently delete this client story and its media links?
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteStoryId(null)}
                className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStory}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold uppercase"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
