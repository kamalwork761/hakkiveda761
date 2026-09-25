import React, { useState } from 'react';
import { Package, Search, Truck, Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AppOrdersScreen: React.FC = () => {
  const { currentCustomer } = useStore();
  const [orderQuery, setOrderQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [searchError, setSearchError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setIsSearching(true);
    setSearchError('');
    setTrackedOrder(null);

    try {
      const q = encodeURIComponent(orderQuery.trim());
      const res = await fetch(`/api/orders/track?query=${q}`);
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
          Real-time updates via Shiprocket, Bluedart, and Delhivery express
        </p>
      </div>

      {/* Track Form Card */}
      <div className="bg-white rounded-3xl p-4 border border-emerald-950/10 shadow-sm mb-4">
        <form onSubmit={handleTrackOrder}>
          <label className="text-xs font-bold text-slate-800 block mb-1.5">
            Enter Order ID or Mobile Number
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="e.g. HV-88219 or 9876543210"
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
        <div className="bg-white rounded-3xl p-4 border border-emerald-950/10 shadow-sm space-y-4">
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
              {trackedOrder.status || 'CONFIRMED'}
            </span>
          </div>

          {/* Stepper */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#0E382C] text-[#C5A059] flex items-center justify-center flex-shrink-0 text-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Order Confirmed & Sacred Oil Bottled</h4>
                <p className="text-[10px] text-slate-500">Pakshirajapura Forest Depot</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 text-xs">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">In Transit with Express Courier</h4>
                <p className="text-[10px] text-slate-500">
                  {trackedOrder.awbCode ? `AWB: ${trackedOrder.awbCode}` : 'Dispatched via Express Courier'}
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="pt-3 border-t border-slate-100 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Customer:</span>
              <span className="font-semibold text-slate-900">{trackedOrder.customer?.name || 'Customer'}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Amount:</span>
              <span className="font-bold text-[#0E382C]">₹{trackedOrder.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
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
