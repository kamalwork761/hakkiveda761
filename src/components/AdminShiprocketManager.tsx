import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle, Settings, Box, MapPin, DollarSign, Activity } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShiprocketSettings } from '../types/store';

export const AdminShiprocketManager: React.FC = () => {
  const { shiprocketSettings, updateShiprocketSettings } = useStore();
  const [formData, setFormData] = useState<ShiprocketSettings>(shiprocketSettings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Health check & Connection state
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    authenticated: boolean;
    email: string;
    expiresAt?: string;
    cachedToken: boolean;
    message: string;
  }>({
    connected: false,
    authenticated: false,
    email: '',
    cachedToken: false,
    message: 'Checking Shiprocket server status...',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const res = await fetch('/api/shiprocket/status');
      const data = await res.json();
      setConnectionStatus({
        connected: data.connected || false,
        authenticated: data.authenticated || false,
        email: data.email || 'Configured in .env',
        expiresAt: data.expiresAt,
        cachedToken: data.cachedToken || false,
        message: data.message || 'Status retrieved successfully.',
      });
      if (data.authenticated) {
        showToast('Shiprocket API connected & authenticated successfully!');
      } else {
        showToast(`Shiprocket Auth Issue: ${data.message}`);
      }
    } catch (err: any) {
      setConnectionStatus((prev) => ({
        ...prev,
        connected: false,
        authenticated: false,
        message: `Failed to reach server backend: ${err.message}`,
      }));
      showToast('Error connecting to Shiprocket health endpoint.');
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const handleSave = () => {
    updateShiprocketSettings(formData);
    showToast('Shiprocket Settings & Automation Rules saved successfully!');
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--heading-primary,#0A4F1F)] text-white px-5 py-3 rounded-xl shadow-2xl border border-[var(--border-strong,#D4AF37)] font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40 p-6 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--brand-gold,#D4AF37)] uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>Shiprocket REST API Settings Manager</span>
          </div>
          <h2 className="text-2xl font-serif-luxury font-bold text-slate-100">
            Logistics & Courier Administration
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage automated shipment creation, AWB generation, India COD rules, and real-time serviceability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-[var(--button-primary-bg,#0A5A2A)] text-[var(--button-primary-text,#FFFFFF)] font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg flex items-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Save Shiprocket Settings</span>
        </button>
      </div>

      {/* Section 1: Connection & Authentication Status */}
      <div className="bg-black/30 p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs font-mono font-bold text-[var(--brand-gold,#D4AF37)] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>1. Authentication & API Health</span>
          </span>
          <button
            type="button"
            onClick={testConnection}
            disabled={isTesting}
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing Health...' : 'Test Shiprocket Status'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Connection Status</span>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${connectionStatus.authenticated ? 'bg-emerald-500 shadow-[0_0_10px_#10B981]' : 'bg-rose-500'}`}></span>
              <span className="font-bold text-sm text-slate-100">
                {connectionStatus.authenticated ? 'AUTHENTICATED' : 'DISCONNECTED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">{connectionStatus.message}</p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Server Credentials</span>
            <span className="font-mono text-xs font-bold text-amber-300 block">
              {connectionStatus.email || 'SHIPROCKET_EMAIL (.env)'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Password: •••••••••••• (Stored safely in server environment)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Bearer Token Caching</span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">
                {connectionStatus.cachedToken ? 'Active Token Cached' : 'No Cached Token'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Real Mode
              </span>
            </div>
            {connectionStatus.expiresAt && (
              <span className="text-[10px] text-slate-400 block">
                Expires: {new Date(connectionStatus.expiresAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Automation Rules */}
      <div className="bg-black/30 p-6 rounded-2xl border border-white/10 space-y-4">
        <span className="text-xs font-mono font-bold text-[var(--brand-gold,#D4AF37)] uppercase tracking-wider block border-b border-white/10 pb-3">
          2. Order Lifecycle Automation Rules
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoCreateOrder}
              onChange={(e) => setFormData({ ...formData, autoCreateOrder: e.target.checked })}
              className="mt-1 accent-[var(--brand-gold,#D4AF37)] w-4 h-4"
            />
            <div>
              <span className="font-bold text-xs text-slate-100 block">Auto-Create Shiprocket Order</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically push order details to Shiprocket REST API upon successful checkout placement.
              </p>
            </div>
          </label>

          <label className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoGenerateAwb}
              onChange={(e) => setFormData({ ...formData, autoGenerateAwb: e.target.checked })}
              className="mt-1 accent-[var(--brand-gold,#D4AF37)] w-4 h-4"
            />
            <div>
              <span className="font-bold text-xs text-slate-100 block">Auto-Generate AWB Number</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically assign courier Air Waybill (AWB) code immediately after order creation.
              </p>
            </div>
          </label>

          <label className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoSchedulePickup}
              onChange={(e) => setFormData({ ...formData, autoSchedulePickup: e.target.checked })}
              className="mt-1 accent-[var(--brand-gold,#D4AF37)] w-4 h-4"
            />
            <div>
              <span className="font-bold text-xs text-slate-100 block">Auto-Schedule Courier Pickup</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automatically request courier pickup dispatch once AWB generation succeeds.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Section 3: Package Defaults & Logistics Configuration */}
      <div className="bg-black/30 p-6 rounded-2xl border border-white/10 space-y-4">
        <span className="text-xs font-mono font-bold text-[var(--brand-gold,#D4AF37)] uppercase tracking-wider block border-b border-white/10 pb-3 flex items-center gap-2">
          <Box className="w-4 h-4" />
          <span>3. Package Defaults & Pickup Location</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Pickup Pincode</label>
            <input
              type="text"
              value={formData.pickupPincode}
              onChange={(e) => setFormData({ ...formData, pickupPincode: e.target.value })}
              className="w-full bg-black/50 border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold,#D4AF37)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Length (cm)</label>
            <input
              type="number"
              value={formData.defaultLengthCm}
              onChange={(e) => setFormData({ ...formData, defaultLengthCm: Number(e.target.value) })}
              className="w-full bg-black/50 border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold,#D4AF37)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Width (cm)</label>
            <input
              type="number"
              value={formData.defaultWidthCm}
              onChange={(e) => setFormData({ ...formData, defaultWidthCm: Number(e.target.value) })}
              className="w-full bg-black/50 border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold,#D4AF37)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Height (cm)</label>
            <input
              type="number"
              value={formData.defaultHeightCm}
              onChange={(e) => setFormData({ ...formData, defaultHeightCm: Number(e.target.value) })}
              className="w-full bg-black/50 border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold,#D4AF37)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.defaultWeightKg}
              onChange={(e) => setFormData({ ...formData, defaultWeightKg: Number(e.target.value) })}
              className="w-full bg-black/50 border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold,#D4AF37)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Courier Selection Priority</label>
          <select
            value={formData.courierPreference}
            onChange={(e) => setFormData({ ...formData, courierPreference: e.target.value as any })}
            className="w-full bg-black/50 border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold,#D4AF37)]"
          >
            <option value="SURFACE">Surface Transport (Delhivery / Bluedart / Xpressbees)</option>
            <option value="EXPRESS">Air Express (Fastest Delivery)</option>
            <option value="LOWEST_COST">Lowest Cost Priority (Best Rate)</option>
          </select>
        </div>
      </div>

      {/* Section 4: India Cash on Delivery (COD) Rules */}
      <div className="bg-black/30 p-6 rounded-2xl border border-white/10 space-y-4">
        <span className="text-xs font-mono font-bold text-[var(--brand-gold,#D4AF37)] uppercase tracking-wider block border-b border-white/10 pb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span>4. India Cash on Delivery (COD) Rules</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <label className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.codEnabled}
              onChange={(e) => setFormData({ ...formData, codEnabled: e.target.checked })}
              className="accent-[var(--brand-gold,#D4AF37)] w-4 h-4"
            />
            <div>
              <span className="font-bold text-xs text-slate-100 block">Enable India COD</span>
              <span className="text-[10px] text-slate-400">Available for Domestic PINs</span>
            </div>
          </label>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">COD Handling Fee (INR)</label>
            <input
              type="number"
              value={formData.codFeeINR}
              onChange={(e) => setFormData({ ...formData, codFeeINR: Number(e.target.value) })}
              className="w-full bg-black/50 border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold,#D4AF37)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Min Order Amount (INR)</label>
            <input
              type="number"
              value={formData.codMinAmountINR}
              onChange={(e) => setFormData({ ...formData, codMinAmountINR: Number(e.target.value) })}
              className="w-full bg-black/50 border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold,#D4AF37)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Max Order Amount (INR)</label>
            <input
              type="number"
              value={formData.codMaxAmountINR}
              onChange={(e) => setFormData({ ...formData, codMaxAmountINR: Number(e.target.value) })}
              className="w-full bg-black/50 border border-white/20 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-[var(--brand-gold,#D4AF37)]"
            />
          </div>
        </div>

        <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-200">
          <strong>Note:</strong> International orders are strictly forced to <strong>Prepaid Only</strong>. COD is automatically disabled for all non-India checkout destinations.
        </div>
      </div>
    </div>
  );
};
