import React, { useEffect, useRef, useState } from 'react';
import { Package, Search, Truck, Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatSafeINR } from '../utils/formatMoney';
import { resolveApiUrl, resolveAssetUrl } from '../utils/nativeUrl';

export const AppOrdersScreen: React.FC = () => {
  const { currentUser, orders, loadCustomerOrders, addToCart, setIsCartOpen } = useStore();
  const [orderQuery, setOrderQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [searchError, setSearchError] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [trackingPhone, setTrackingPhone] = useState('');
  const filteredOrders = orders.filter((order) => {
    const status = String(order.trackingStatus || 'ORDER_PLACED').toUpperCase();
    const group = statusFilter === 'ALL' ||
      (statusFilter === 'PROCESSING' && ['ORDER_PLACED', 'NEW', 'CONFIRMED', 'PROCESSING', 'PACKED', 'AWB_GENERATED', 'PICKUP_SCHEDULED'].includes(status)) ||
      (statusFilter === 'SHIPPED' && ['DISPATCHED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(status)) ||
      (statusFilter === 'DELIVERED' && status === 'DELIVERED') ||
      (statusFilter === 'CANCELLED' && ['CANCELLED', 'CANCELED'].includes(status));
    return group && (order.orderNumber || order.id || '').toLowerCase().includes(historySearch.trim().toLowerCase());
  });
  const statusLabel = (status?: string) => String(status || 'ORDER_PLACED').replace(/_/g, ' ');

  useEffect(() => {
    if (currentUser) {
      loadCustomerOrders();
    }
  }, [currentUser?.id]);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setIsSearching(true);
    setSearchError('');
    setTrackedOrder(null);

    try {
      const q = encodeURIComponent(orderQuery.trim());
      const token = localStorage.getItem('hakkiveda_customer_token');
      const phone = !currentUser ? trackingPhone.trim() : '';
      if (!currentUser && !phone) {
        setSearchError('Enter the mobile number used for this order.');
        return;
      }
      const url = resolveApiUrl(`/api/orders/track?query=${q}${phone ? `&phone=${encodeURIComponent(phone)}` : ''}`);
      const res = await fetch(url, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && data.order) {
        setTrackedOrder(data.order);
      } else {
        setSearchError(data.error || 'No order found with this Order ID or Phone number.');
      }
    } catch {
      setSearchError('Unable to connect to order tracking server. Please check your internet connection.');
    } finally {
      setIsSearching(false);
    }
  };

  const openCancellationWhatsApp = (order: any) => {
    const dispatchedStatuses = ['DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const isAfterDispatch = dispatchedStatuses.includes(
      String(order?.trackingStatus || '').toUpperCase()
    );

    const phone = '917619536831';

    const message = isAfterDispatch
      ? `Namaste HAKKIVEDA, I want to request cancellation for Order ${order?.orderNumber || order?.id}. I understand the order has already been dispatched and courier/return charges may apply. Please assist me.`
      : `Namaste HAKKIVEDA, I want to request cancellation for Order ${order?.orderNumber || order?.id}. The order has not been dispatched yet. Please cancel it and confirm.`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      '_system'
    );
  };

  return (
    <div className="w-full pb-24 px-4 pt-3">
      {/* Title */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#0E382C]" />
          <span className="text-[10px] font-bold text-[#0E382C] uppercase tracking-wider">
            Live Dispatch
          </span>
        </div>
        <h1 className="font-serif text-xl font-bold text-slate-900 leading-tight">
          Track Your Order
        </h1>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          View your purchases, payment details and recorded delivery updates
        </p>
      </div>

      {currentUser && (
        <div className="bg-white rounded-3xl p-4 border border-emerald-950/10 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">My Orders</h2>
              <p className="text-[10px] text-slate-500">{currentUser.email}</p>
            </div>
            <Package className="w-5 h-5 text-[#0E382C]" />
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl bg-[#FAF7F2] p-5 text-center">
              <Package className="w-8 h-8 mx-auto text-[#0E382C] mb-2" />
              <p className="text-xs font-bold text-slate-800">No orders yet</p>
              <p className="text-[11px] text-slate-500 mt-1">Your purchases will appear here after checkout.</p>
            </div>
          ) : (
            <div>
              <input type="search" value={historySearch} onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search by Order ID" aria-label="Search your orders"
                className="w-full mb-3 px-3.5 py-3 rounded-xl border border-slate-200 bg-[#FAF7F2] text-xs focus:ring-1 focus:ring-[#0E382C] focus:outline-none" />
              <div className="flex gap-2 overflow-x-auto pb-3">
                {['ALL', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                  <button type="button" key={status} onClick={() => setStatusFilter(status)}
                    className={`shrink-0 px-3 py-2 rounded-full text-[11px] font-bold border ${statusFilter === status ? 'bg-[#0E382C] text-[#C5A059] border-[#0E382C]' : 'bg-white text-slate-600 border-slate-200'}`}>
                    {status === 'ALL' ? 'All Orders' : status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
              {filteredOrders.length === 0 && <p className="text-xs text-slate-500 py-5 text-center">No matching orders.</p>}
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-slate-200 bg-[#FAF7F2] p-3">
                    <button type="button" onClick={() => {
                      setTrackedOrder(order);
                      setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                    }} className="w-full text-left">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{order.orderNumber || order.id}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{order.date}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-900">{statusLabel(order.trackingStatus)}</span>
                      </div>
                      <div className="space-y-3 mt-3 border-t border-slate-200 pt-3">
                        {(order.items || []).map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                              {(item.selectedVariant?.image || item.product?.image || item.product?.images?.[0]) ?
                                <img src={resolveAssetUrl(item.selectedVariant?.image || item.product?.image || item.product?.images?.[0])} alt={item.product?.name || 'Product'} className="w-full h-full object-contain" loading="lazy" /> :
                                <Package className="w-6 h-6 text-slate-300" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-slate-900 line-clamp-2">{item.product?.name || 'HAKKIVEDA Product'}</p>
                              {item.selectedVariant?.name && <p className="text-[10px] text-slate-500 mt-1">{item.selectedVariant.name}</p>}
                              <p className="text-[10px] text-slate-600 mt-1">Qty: {item.quantity} · {formatSafeINR(item.selectedVariant?.priceINR ?? item.product?.priceINR ?? 0, '₹0')} each</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 mt-3 pt-3">
                        <span className="text-xs font-bold text-[#0E382C]">{formatSafeINR(order.totalAmountINR, '₹0')}</span>
                        <span className="text-xs font-bold text-[#0E382C] flex items-center gap-1">View details <ChevronRight className="w-4 h-4" /></span>
                      </div>
                    </button>
                    <button type="button" onClick={() => {
                      (order.items || []).forEach(item => {
                        if (item.product) addToCart(item.product, item.quantity, item.selectedVariant);
                      });
                      setIsCartOpen(true);
                    }} className="mt-3 w-full rounded-xl border border-[#0E382C] py-2.5 text-xs font-bold text-[#0E382C]">
                      Buy Again
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Track Form Card */}
      <div className="bg-white rounded-3xl p-4 border border-emerald-950/10 shadow-sm mb-4">
        <form onSubmit={handleTrackOrder}>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Enter Order ID
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="e.g. HV-ORD-123456-789"
                className="w-full pl-3.5 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-[#0E382C] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2.5 rounded-xl bg-[#0E382C] text-[#C5A059] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isSearching ? (
                <span>Tracking...</span>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Track</span>
                </>
              )}
            </button>
          </div>
          {!currentUser && (
            <input type="tel" value={trackingPhone} onChange={(e) => setTrackingPhone(e.target.value)}
              placeholder="Registered mobile number" aria-label="Registered mobile number"
              className="w-full mt-2 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs" />
          )}
        </form>

        {searchError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Tracked Order Details */}
      {trackedOrder && (
        <div
          ref={detailsRef}
          className="bg-white rounded-3xl p-4 border border-emerald-950/10 shadow-sm space-y-4 scroll-mt-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Order Number
              </span>
              <span className="font-mono text-sm font-bold text-slate-900">
                {trackedOrder.orderNumber || trackedOrder.id}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {String(trackedOrder.trackingStatus || 'ORDER_PLACED').replace(/_/g, ' ')}
            </span>
          </div>

          {/* Real Order Status */}
          <div className="rounded-2xl bg-[#FAF7F2] p-3 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#0E382C] text-[#C5A059] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {trackedOrder.paymentMethod === 'COD'
                    ? 'Cash on Delivery Order Received'
                    : trackedOrder.paymentStatus === 'PAID' || trackedOrder.paymentStatus === 'Paid'
                      ? 'Online Payment Successful'
                      : 'Payment Status Pending'}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {trackedOrder.paymentMethod === 'COD'
                    ? 'Your COD order is awaiting processing by HAKKIVEDA.'
                    : `Payment: ${trackedOrder.paymentStatus || 'Pending'}`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {String(trackedOrder.trackingStatus || 'ORDER_PLACED').replace(/_/g, ' ')}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {trackedOrder.awbCode
                    ? `AWB: ${trackedOrder.awbCode}${trackedOrder.courierName ? ` • ${trackedOrder.courierName}` : ''}`
                    : trackedOrder.trackingStatus === 'DISPATCHED' ||
                      trackedOrder.trackingStatus === 'IN_TRANSIT' ||
                      trackedOrder.trackingStatus === 'OUT_FOR_DELIVERY'
                      ? 'Courier details will appear here when available.'
                      : 'Your order has not been dispatched yet.'}
                </p>
              </div>
            </div>
          </div>

          {/* Recorded shipping timeline: do not manufacture events */}
          <div className="border-t border-slate-100 pt-3">
            <h3 className="text-xs font-bold text-[#0E382C] mb-3">Delivery updates</h3>
            {Array.isArray(trackedOrder.timeline) && trackedOrder.timeline.length > 0 ? (
              <div className="space-y-3">
                {trackedOrder.timeline.map((event: any, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 mt-1 rounded-full shrink-0 ${event.completed ? 'bg-[#0E382C]' : 'bg-slate-300'}`} />
                    <div>
                      <p className="text-xs font-semibold">{event.label || statusLabel(event.status)}</p>
                      {event.timestamp && <p className="text-[10px] text-slate-500">{event.timestamp}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-slate-500">Latest recorded status: {statusLabel(trackedOrder.trackingStatus)}. Detailed events are not yet available.</p>}
            {trackedOrder.courierName && <p className="text-xs mt-3">Courier: {trackedOrder.courierName}</p>}
            {(trackedOrder.awbCode || trackedOrder.trackingNumber) && <p className="text-xs mt-1">Tracking number: {trackedOrder.awbCode || trackedOrder.trackingNumber}</p>}
            {trackedOrder.estimatedDeliveryDate && <p className="text-xs mt-1">Estimated delivery: {trackedOrder.estimatedDeliveryDate}</p>}
          </div>
          {trackedOrder.customer?.address && (
            <div className="border-t border-slate-100 pt-3">
              <h3 className="text-xs font-bold text-[#0E382C] mb-1">Delivery address</h3>
              <p className="text-xs text-slate-600">{trackedOrder.customer.address}, {trackedOrder.customer.city}, {trackedOrder.customer.state} {trackedOrder.customer.pincode}</p>
            </div>
          )}

          {/* Summary */}
          <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Customer:</span>
              <span className="font-semibold text-slate-900">{trackedOrder.customer?.name || 'Customer'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment:</span>
              <span className="font-semibold text-slate-900">
                {trackedOrder.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid • Razorpay'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Payment Status:</span>
              <span className="font-semibold text-slate-900">
                {String(trackedOrder.paymentStatus || 'Pending').replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Amount:</span>
              <span className="font-bold text-[#0E382C]">{formatSafeINR(trackedOrder.totalAmountINR, '₹0')}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            {['DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(
              String(trackedOrder.trackingStatus || '').toUpperCase()
            ) ? (
              <div className="space-y-2">
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[10px] text-amber-800 leading-relaxed">
                  This order has already been dispatched. Standard cancellation is no longer available.
                  If you still want to cancel, courier/return charges may apply and the request must be handled through WhatsApp support.
                </div>

                <button
                  type="button"
                  onClick={() => openCancellationWhatsApp(trackedOrder)}
                  className="w-full h-10 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs font-bold"
                >
                  Request Cancellation on WhatsApp
                </button>
              </div>
            ) : trackedOrder.trackingStatus === 'CANCELLED' ? (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-[11px] font-bold text-rose-700">
                This order has been cancelled.
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Cancellation is available before dispatch. Send a cancellation request to HAKKIVEDA support on WhatsApp.
                </p>

                <button
                  type="button"
                  onClick={() => openCancellationWhatsApp(trackedOrder)}
                  className="w-full h-10 rounded-xl bg-[#0E382C] text-white text-xs font-bold"
                >
                  Request Cancellation on WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helpful Guarantee Card */}
      <div className="mt-4 p-4 rounded-3xl bg-[#FAF7F2] border border-emerald-950/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#0E382C] text-[#C5A059] flex items-center justify-center flex-shrink-0">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">Free Express Delivery Across India</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Orders placed before 2:00 PM are hand-packed and dispatched the same day.
          </p>
        </div>
      </div>
    </div>
  );
};
