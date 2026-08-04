import React, { useState, useMemo, useEffect } from 'react';
import { formatAdminINR, formatOriginalAmount } from '../utils/adminCurrency';
import {
  Search,
  Filter,
  Package,
  Truck,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  XCircle,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  Building2,
  Calendar
} from 'lucide-react';
import { Order } from '../types/store';

interface AdminOrderManagerProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['trackingStatus'], trackingNumber?: string, courier?: string) => void;
  setSelectedOrder: (order: Order) => void;
  formatPrice: (priceINR: number) => string;
  showToast: (msg: string) => void;
  presetFilter?: { filter?: string; paymentStatus?: string; paymentMethod?: string; market?: string } | null;
  onClearPresetFilter?: () => void;
}

const ALL_STATUSES = [
  'Pending Payment',
  'Paid',
  'COD Confirmed',
  'Preparing',
  'Packed',
  'AWB Generated',
  'Pickup Scheduled',
  'Shipped',
  'In Transit',
  'Out For Delivery',
  'Delivered',
  'Cancelled',
  'Refunded',
  'Returned',
  'ORDER_PLACED',
  'PROCESSING',
  'DISPATCHED',
];

export const AdminOrderManager: React.FC<AdminOrderManagerProps> = ({
  orders,
  updateOrderStatus,
  setSelectedOrder,
  formatPrice,
  showToast,
  presetFilter,
  onClearPresetFilter,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('ALL');
  const [filterPayment, setFilterPayment] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDate, setFilterDate] = useState('');
  const [filterCourier, setFilterCourier] = useState('ALL');

  // Preset Filter State (from Dashboard Cards or URL)
  const [activePreset, setActivePreset] = useState<{
    filter?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    market?: string;
  } | null>(() => {
    if (presetFilter) return presetFilter;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const filter = params.get('filter') || undefined;
      const paymentStatus = params.get('paymentStatus') || undefined;
      const paymentMethod = params.get('paymentMethod') || undefined;
      const market = params.get('market') || undefined;
      if (filter || paymentStatus || paymentMethod || market) {
        return { filter, paymentStatus, paymentMethod, market };
      }
    }
    return null;
  });

  // Sync state if parent presetFilter prop changes
  useEffect(() => {
    if (presetFilter !== undefined) {
      setActivePreset(presetFilter);
    }
  }, [presetFilter]);

  // Sync with browser navigation
  useEffect(() => {
    const handleUrlSync = () => {
      const params = new URLSearchParams(window.location.search);
      const filter = params.get('filter') || undefined;
      const paymentStatus = params.get('paymentStatus') || undefined;
      const paymentMethod = params.get('paymentMethod') || undefined;
      const market = params.get('market') || undefined;
      if (filter || paymentStatus || paymentMethod || market) {
        setActivePreset({ filter, paymentStatus, paymentMethod, market });
      } else {
        setActivePreset(null);
      }
    };

    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Extract unique countries and couriers for dropdown options
  const uniqueCountries = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.customer?.country) set.add(o.customer.country);
    });
    return Array.from(set).sort();
  }, [orders]);

  const uniqueCouriers = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.courierName) set.add(o.courierName);
    });
    return Array.from(set).sort();
  }, [orders]);

  // Helper for preset title badge
  const getPresetLabel = (preset: { filter?: string; paymentStatus?: string; paymentMethod?: string; market?: string }) => {
    if (preset.filter === 'today') return "Today's Orders";
    if (preset.filter === 'revenue_today') return "Revenue Today (Paid & Confirmed)";
    if (preset.filter === 'revenue_month') return "Revenue This Month";
    if (preset.filter === 'revenue_all') return "Total Revenue (All Time)";
    if (preset.paymentStatus === 'pending') return "Pending Payment & Fulfillment";
    if (preset.paymentStatus === 'paid') return "Paid Orders (Excluding Pending COD)";
    if (preset.paymentStatus === 'refunded') return "Refunded Orders";
    if (preset.paymentStatus === 'settled') return "Settled / Paid Sales";
    if (preset.paymentMethod === 'cod') return "COD Payment Method Orders";
    if (preset.market === 'international') return "International Market Orders";
    return "Custom Filter Preset";
  };

  // Search & Filter Logic with strict non-mixing boundary checks
  const filteredOrders = useMemo(() => {
    const todayDateStr = new Date().toISOString().split('T')[0];
    const currentMonthStr = todayDateStr.substring(0, 7);

    const checkToday = (o: Order) =>
      !!(o.date && (o.date === todayDateStr || o.date.startsWith(todayDateStr)));

    const checkThisMonth = (o: Order) =>
      !!(o.date && o.date.startsWith(currentMonthStr));

    const checkPaid = (o: Order) => {
      const pStatus = (o.paymentStatus || '').trim().toUpperCase();
      return pStatus === 'PAID' || pStatus === 'SUCCESSFUL' || pStatus === 'COMPLETED';
    };

    const checkPending = (o: Order) => {
      if (checkPaid(o)) return false;
      const pStatus = (o.paymentStatus || '').trim().toUpperCase();
      const tStatus = (o.trackingStatus || '').trim().toUpperCase();
      return (
        pStatus === 'PENDING' ||
        pStatus === 'PENDING PAYMENT' ||
        pStatus === 'AWAITING PAYMENT' ||
        pStatus === 'COD_DUE' ||
        pStatus === 'COD PENDING' ||
        pStatus === 'PENDING FULFILLMENT' ||
        pStatus === 'AWAITING FULFILLMENT' ||
        pStatus === 'PAYMENT FAILED' ||
        pStatus === 'FAILED' ||
        tStatus === 'ORDER_PLACED' ||
        tStatus === 'PENDING FULFILLMENT' ||
        tStatus === 'AWAITING_FULFILLMENT' ||
        tStatus === 'PENDING PAYMENT'
      );
    };

    const checkCod = (o: Order) => (o.paymentMethod || '').trim().toUpperCase() === 'COD';

    const checkInternational = (o: Order) => {
      const c = (o.customer?.country || '').trim().toLowerCase();
      const cc = (o.customer?.countryCode || o.currencyCode || '').trim().toUpperCase();
      const isDomestic = c === 'india' || c === 'in' || cc === 'IN';
      return c !== '' && !isDomestic;
    };

    return orders.filter((order) => {
      // Search: Order ID, Customer Name, Phone, Email, Tracking Number / AWB
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = (order.orderNumber || order.id).toLowerCase().includes(q);
        const matchesName = (order.customer?.name || '').toLowerCase().includes(q);
        const matchesPhone = (order.customer?.phone || '').toLowerCase().includes(q);
        const matchesEmail = (order.customer?.email || '').toLowerCase().includes(q);
        const matchesTracking =
          (order.trackingNumber || '').toLowerCase().includes(q) ||
          (order.awbCode || '').toLowerCase().includes(q);

        if (!matchesId && !matchesName && !matchesPhone && !matchesEmail && !matchesTracking) {
          return false;
        }
      }

      // Active Preset Filter (from Dashboard Cards or Query Parameters)
      if (activePreset) {
        const { filter, paymentStatus, paymentMethod, market } = activePreset;

        // Card 1: TODAY'S ORDERS
        if (filter === 'today') {
          if (!checkToday(order)) return false;
        }

        // Card 6: REVENUE TODAY
        if (filter === 'revenue_today') {
          if (!checkToday(order) || !(checkPaid(order) || checkCod(order))) return false;
        }

        // Card 7: REVENUE THIS MONTH
        if (filter === 'revenue_month') {
          if (!checkThisMonth(order) || !(checkPaid(order) || checkCod(order))) return false;
        }

        // Card 8: TOTAL REVENUE
        if (filter === 'revenue_all') {
          if (!(checkPaid(order) || checkCod(order))) return false;
        }

        // Card 2: PENDING ORDERS
        if (paymentStatus === 'pending') {
          if (!checkPending(order)) return false;
        }

        // Card 3: PAID ORDERS
        if (paymentStatus === 'paid') {
          if (!checkPaid(order)) return false;
        }

        // Card 9: REFUND TOTALS
        if (paymentStatus === 'refunded') {
          const pStatus = (order.paymentStatus || '').trim().toUpperCase();
          if (pStatus !== 'REFUNDED') return false;
        }

        // Card 10: SETTLEMENT TOTALS
        if (paymentStatus === 'settled') {
          if (!checkPaid(order)) return false;
        }

        // Card 4: COD ORDERS
        if (paymentMethod === 'cod') {
          if (!checkCod(order)) return false;
        }

        // Card 5: INTERNATIONAL ORDERS
        if (market === 'international') {
          if (!checkInternational(order)) return false;
        }
      }

      // Filter: Country
      if (filterCountry !== 'ALL') {
        if ((order.customer?.country || '').toLowerCase() !== filterCountry.toLowerCase()) {
          return false;
        }
      }

      // Filter: Payment
      if (filterPayment !== 'ALL') {
        const pStatus = (order.paymentStatus || '').toUpperCase();
        const pMethod = (order.paymentMethod || '').toUpperCase();
        if (filterPayment === 'COD') {
          if (pMethod !== 'COD') return false;
        } else if (filterPayment === 'PAID') {
          if (pStatus !== 'PAID' && pStatus !== 'SUCCESSFUL') return false;
        } else if (filterPayment === 'PENDING') {
          if (pStatus !== 'PENDING' && pStatus !== 'COD_DUE' && pStatus !== 'AWAITING FULFILLMENT') return false;
        } else if (filterPayment === 'REFUNDED') {
          if (pStatus !== 'REFUNDED') return false;
        } else if (filterPayment === 'FAILED') {
          if (pStatus !== 'FAILED') return false;
        }
      }

      // Filter: Status
      if (filterStatus !== 'ALL') {
        if (order.trackingStatus?.toUpperCase() !== filterStatus.toUpperCase()) {
          return false;
        }
      }

      // Filter: Date
      if (filterDate) {
        if (!order.date?.startsWith(filterDate)) {
          return false;
        }
      }

      // Filter: Courier
      if (filterCourier !== 'ALL') {
        if (!(order.courierName || '').toLowerCase().includes(filterCourier.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [orders, searchQuery, activePreset, filterCountry, filterPayment, filterStatus, filterDate, filterCourier]);

  // Reset pagination when filters change
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterCountry('ALL');
    setFilterPayment('ALL');
    setFilterStatus('ALL');
    setFilterDate('');
    setFilterCourier('ALL');
    setActivePreset(null);
    if (onClearPresetFilter) {
      onClearPresetFilter();
    } else if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/admin/orders');
    }
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif-luxury text-slate-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-[var(--brand-gold)]" />
            <span>Live Orders & Logistics Management</span>
          </h1>
          <p className="text-xs text-slate-300">
            Real-time customer orders, automated stock management, and multi-courier express dispatch.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--brand-gold)] bg-[var(--brand-primary-deep)] border border-[var(--brand-gold)]/30 px-3.5 py-2 rounded-xl">
          <span>Total Live Orders: {orders.length}</span>
        </div>
      </div>

      {/* Active Preset Filter Banner */}
      {activePreset && (
        <div className="bg-amber-950/80 border border-amber-500/40 p-3.5 px-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-amber-200 shadow-md">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>
              Active Filter: <strong className="text-white font-mono">{getPresetLabel(activePreset)}</strong> ({filteredOrders.length} matching order{filteredOrders.length === 1 ? '' : 's'})
            </span>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] uppercase font-bold flex items-center gap-1.5 transition-all"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Clear Active Filter</span>
          </button>
        </div>
      )}

      {/* Search & Filter Controls Toolbar */}
      <div className="bg-[var(--brand-primary-dark)] border border-white/10 p-4 rounded-2xl space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[var(--brand-gold)] uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Search & Advanced Filters</span>
          </span>
          {(searchQuery || filterCountry !== 'ALL' || filterPayment !== 'ALL' || filterStatus !== 'ALL' || filterDate || filterCourier !== 'ALL') && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Order ID, Customer Name, Phone, Email, or Tracking AWB..."
            className="w-full bg-[var(--brand-primary-deep)] border border-white/20 pl-10 pr-4 py-2.5 rounded-xl text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-[var(--brand-gold)] font-sans"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
          {/* Country Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Country</label>
            <select
              value={filterCountry}
              onChange={(e) => {
                setFilterCountry(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded-xl text-slate-200 text-xs font-medium cursor-pointer"
            >
              <option value="ALL">All Countries</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Payment</label>
            <select
              value={filterPayment}
              onChange={(e) => {
                setFilterPayment(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded-xl text-slate-200 text-xs font-medium cursor-pointer"
            >
              <option value="ALL">All Payments</option>
              <option value="PAID">Paid / Successful</option>
              <option value="COD">Cash on Delivery (COD)</option>
              <option value="PENDING">Pending Payment</option>
              <option value="REFUNDED">Refunded</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Order Status Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Order Status</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded-xl text-slate-200 text-xs font-medium cursor-pointer"
            >
              <option value="ALL">All Order Statuses</option>
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Order Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded-xl text-slate-200 text-xs font-medium"
            />
          </div>

          {/* Courier Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Courier Partner</label>
            <select
              value={filterCourier}
              onChange={(e) => {
                setFilterCourier(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[var(--brand-primary-deep)] border border-white/20 p-2 rounded-xl text-slate-200 text-xs font-medium cursor-pointer"
            >
              <option value="ALL">All Couriers</option>
              {uniqueCouriers.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List Table */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl bg-[var(--brand-primary-dark)] space-y-2">
          <p className="text-base font-bold text-slate-300">No orders found.</p>
          <p className="text-xs text-slate-400">
            {orders.length === 0
              ? 'No live customer orders placed yet. Start by testing checkout from front store.'
              : 'Try clearing your search query or filters to see all orders.'}
          </p>
          {orders.length > 0 && (
            <button
              onClick={handleResetFilters}
              className="mt-3 px-4 py-2 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-xs rounded-xl hover:bg-white"
            >
              Show All Orders
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} orders</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          <div className="space-y-3.5">
            {paginatedOrders.map((o) => (
              <div
                key={o.id}
                className="bg-[var(--brand-primary-dark)] border border-white/10 hover:border-[var(--brand-gold)]/50 p-5 rounded-2xl space-y-3.5 text-xs shadow-lg transition-all"
              >
                {/* Card Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-[var(--brand-gold)]">{o.orderNumber || o.id}</span>
                    <span className="text-slate-400 text-xs font-mono">Date: {o.date}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-500/30">
                      {o.customer.country || 'India'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono font-black text-sm text-emerald-400 block">
                        {formatAdminINR(o.totalAmountINR)}
                      </span>
                      {o.currencyCode && o.currencyCode !== 'INR' && (
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Original: {formatOriginalAmount(o)}
                        </span>
                      )}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      o.paymentStatus === 'PAID' || o.paymentStatus === 'Paid' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                      o.paymentStatus === 'REFUNDED' ? 'bg-purple-950 text-purple-300 border border-purple-500/30' :
                      'bg-amber-950 text-amber-300 border border-amber-500/30'
                    }`}>
                      {o.paymentMethod}: {o.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Customer & Address Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-slate-300 bg-[var(--brand-primary-deep)]/60 p-3 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[var(--brand-gold)] font-bold block mb-0.5">Customer Details:</span>
                    <span className="text-white font-bold block">{o.customer.name}</span>
                    <span className="text-[11px] text-slate-300 block">{o.customer.email}</span>
                    <span className="text-[11px] text-slate-300 block">{o.customer.phone}</span>
                  </div>

                  <div>
                    <span className="text-[var(--brand-gold)] font-bold block mb-0.5">Shipping Address:</span>
                    <span className="text-slate-200 block text-[11px]">
                      {o.customer.address}, {o.customer.city}, {o.customer.state} - {o.customer.pincode}
                    </span>
                  </div>

                  <div>
                    <span className="text-[var(--brand-gold)] font-bold block mb-0.5">Items Purchased ({o.items?.length || 0}):</span>
                    <span className="text-slate-200 block text-[11px]">
                      {o.items?.map((it) => `${it.product?.name || 'Item'} (x${it.quantity})`).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Tracking & Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-slate-200 text-xs">Order Status:</span>
                    <select
                      value={o.trackingStatus}
                      onChange={(e) => {
                        updateOrderStatus(o.id, e.target.value as any);
                        showToast(`Order status updated to ${e.target.value}`);
                      }}
                      className="bg-[var(--brand-primary-deep)] border border-white/20 px-3 py-1.5 rounded-xl text-slate-100 text-xs font-bold focus:outline-none focus:border-[var(--brand-gold)] cursor-pointer"
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>

                    {o.trackingNumber && (
                      <span className="text-[11px] font-mono text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                        AWB: <strong className="text-white">{o.trackingNumber}</strong> ({o.courierName || 'Courier'})
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="px-4 py-2 bg-[var(--brand-gold)] text-[var(--brand-primary-dark)] font-bold text-xs rounded-xl hover:bg-white transition-colors inline-flex items-center gap-1.5 shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View / Manage Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-[var(--brand-primary-deep)] border border-white/20 text-slate-200 rounded-xl disabled:opacity-40 hover:bg-white/10 flex items-center gap-1 font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-7 h-7 rounded-lg font-bold text-xs ${
                      currentPage === idx + 1
                        ? 'bg-[var(--brand-gold)] text-[var(--brand-primary-dark)]'
                        : 'bg-[var(--brand-primary-deep)] text-slate-300 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-[var(--brand-primary-deep)] border border-white/20 text-slate-200 rounded-xl disabled:opacity-40 hover:bg-white/10 flex items-center gap-1 font-bold"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
