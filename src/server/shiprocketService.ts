import dotenv from 'dotenv';
import { isIndiaCountry, normalizeCountryCode, getDestinationCourierInfo } from '../utils/shipping';

dotenv.config();

interface CachedToken {
  token: string;
  expiresAt: number; // Unix timestamp ms
}

let tokenCache: CachedToken | null = null;

/**
 * Shiprocket API Credentials & Config
 */
function getCredentials() {
  const email = process.env.SHIPROCKET_EMAIL || '';
  const password = process.env.SHIPROCKET_PASSWORD || '';
  return { email, password };
}

export function isShiprocketConfigured(): boolean {
  const { email, password } = getCredentials();
  return Boolean(email && password);
}

/**
 * Authenticates with Shiprocket API and caches the bearer token.
 */
export async function getShiprocketToken(): Promise<string> {
  if (!isShiprocketConfigured()) {
    throw new Error('Shiprocket not configured');
  }

  // Reuse cached token if valid (valid for 9 days, token lifetime is 10 days)
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const { email, password } = getCredentials();
  console.log('[Shiprocket] Authenticating with email:', email);

  try {
    const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Shiprocket Auth Error]:', res.status, errText);
      throw new Error(`Shiprocket Auth failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    if (!data.token) {
      throw new Error(data.message || 'No token returned from Shiprocket API');
    }

    // Cache token for 9 days (in ms)
    tokenCache = {
      token: data.token,
      expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000,
    };

    console.log('[Shiprocket] Authentication successful. Token cached.');
    return data.token;
  } catch (err: any) {
    console.error('[Shiprocket Auth Exception]:', err.message);
    throw err;
  }
}

export interface ShiprocketFetchOptions extends RequestInit {
  suppressErrorLog?: boolean;
}

/**
 * Helper to make authenticated requests to Shiprocket REST API.
 */
async function shiprocketFetch(endpoint: string, options: ShiprocketFetchOptions = {}): Promise<any> {
  const token = await getShiprocketToken();

  if (typeof endpoint !== 'string') {
    throw new Error('Invalid Shiprocket endpoint: string required.');
  }

  const cleanEndpoint = endpoint.trim();
  if (
    cleanEndpoint.startsWith('http:') ||
    cleanEndpoint.startsWith('https:') ||
    cleanEndpoint.startsWith('//') ||
    cleanEndpoint.startsWith('file:') ||
    cleanEndpoint.startsWith('ftp:') ||
    !cleanEndpoint.startsWith('/')
  ) {
    throw new Error(`Invalid Shiprocket endpoint '${cleanEndpoint}': relative path starting with '/' required.`);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers as Record<string, string> || {}),
  };

  const url = `https://apiv2.shiprocket.in/v1/external${cleanEndpoint}`;

  let res = await fetch(url, { ...options, headers });

  // If unauthorized / token expired, invalidate cache and retry once
  if (res.status === 401 || res.status === 403) {
    console.warn('[Shiprocket] Received 401/403. Refreshing token and retrying...');
    tokenCache = null;
    const newToken = await getShiprocketToken();
    headers['Authorization'] = `Bearer ${newToken}`;
    res = await fetch(url, { ...options, headers });
  }

  const responseText = await res.text();
  let json: any;
  try {
    json = JSON.parse(responseText);
  } catch (e) {
    throw new Error(`Invalid JSON response from Shiprocket (${res.status}): ${responseText}`);
  }

  if (!res.ok) {
    const isServiceabilityQuery = cleanEndpoint.includes('serviceability');
    const isClientOrServiceabilityNotice = res.status === 400 || res.status === 404 || res.status === 422;

    if (options.suppressErrorLog || (isServiceabilityQuery && isClientOrServiceabilityNotice)) {
      const err: any = new Error(
        json?.message ||
        (typeof json?.errors === 'string' ? json.errors : JSON.stringify(json?.errors)) ||
        `Shiprocket response HTTP ${res.status}`
      );
      err.status = res.status;
      err.data = json;
      throw err;
    }

    console.error(`[Shiprocket Error ${res.status}] ${url}:`, json);
    const err: any = new Error(
      json?.message ||
      (typeof json?.errors === 'string' ? json.errors : JSON.stringify(json?.errors)) ||
      `Shiprocket API error HTTP ${res.status}`
    );
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json;
}

/**
 * 1. Check Serviceability by PIN Code
 */
export async function checkServiceability(params: {
  pickupPincode?: string;
  deliveryPincode: string;
  weightInKg?: number;
  cod?: boolean;
}) {
  const pickupPincode = params.pickupPincode || '560001'; // Default Bangalore warehouse
  const deliveryPincode = params.deliveryPincode;
  const weight = params.weightInKg || 0.5;
  const cod = params.cod ? 1 : 0;

  console.log(`[Shiprocket] Checking serviceability from ${pickupPincode} to ${deliveryPincode}, weight: ${weight}kg, COD: ${cod}`);

  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        serviceable: false,
        pincode: deliveryPincode,
        availableCouriers: [],
        message: 'Shiprocket not configured',
      };
    }
    return {
      success: true,
      simulated: true,
      serviceable: true,
      pincode: deliveryPincode,
      availableCouriers: [
        { courier_name: 'Delhivery Surface', courier_company_id: 1, rate: 85, etd: '3-5 Days', cod_available: true },
        { courier_name: 'Bluedart Express', courier_company_id: 2, rate: 120, etd: '1-2 Days', cod_available: true },
        { courier_name: 'Ekart Logistics', courier_company_id: 3, rate: 75, etd: '4-6 Days', cod_available: true },
      ],
    };
  }

  try {
    const endpoint = `/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=${cod}`;
    const data = await shiprocketFetch(endpoint, { method: 'GET', suppressErrorLog: true });

    const available = data?.data?.available_courier_companies || [];
    return {
      success: true,
      simulated: false,
      serviceable: available.length > 0,
      pincode: deliveryPincode,
      availableCouriers: available.map((c: any) => ({
        courier_company_id: c.courier_company_id,
        courier_name: c.courier_name,
        rate: c.rate,
        etd: c.etd,
        cod_available: Boolean(c.cod),
      })),
    };
  } catch (err: any) {
    return {
      success: true,
      simulated: false,
      serviceable: false,
      pincode: deliveryPincode,
      message: err?.message || 'Pincode is not currently serviceable by courier partners.',
      availableCouriers: [],
    };
  }
}



/**
 * 2. Shipping Rate Estimation (Domestic & Real International Quotes)
 */
export async function estimateShippingRate(params: {
  deliveryPincode: string;
  pickupPincode?: string;
  weightInKg?: number;
  cod?: boolean;
  isInternational?: boolean;
  country?: string;
  countryCode?: string;
  siteSettings?: any;
}) {
  const isIntl = Boolean(
    params.isInternational ||
    (params.country && !isIndiaCountry(params.country)) ||
    (params.countryCode && !isIndiaCountry(params.countryCode))
  );

  if (isIntl) {
    const countryCode = normalizeCountryCode(params.countryCode || params.country);
    const info = getDestinationCourierInfo(countryCode);

    // If Shiprocket is live and configured, query real international serviceability endpoint
    if (isShiprocketConfigured()) {
      try {
        const pickupPincode = params.pickupPincode || '560001';
        const weight = Math.max(0.5, Number(params.weightInKg) || 0.5);
        const countryParam = encodeURIComponent(countryCode);
        const hasValidPostal =
          params.deliveryPincode &&
          params.deliveryPincode.trim() !== '' &&
          params.deliveryPincode.trim() !== '00000';
        const postalQuery = hasValidPostal
          ? `&delivery_postcode=${encodeURIComponent(params.deliveryPincode.trim())}`
          : '';

        const endpoint = `/courier/international/serviceability?pickup_postcode=${pickupPincode}&delivery_country=${countryParam}${postalQuery}&weight=${weight}&cod=0`;
        const data = await shiprocketFetch(endpoint, { method: 'GET', suppressErrorLog: true });

        const available = data?.data?.available_courier_companies || data?.available_couriers || [];
        if (Array.isArray(available) && available.length > 0) {
          const validCouriers = available.filter((c: any) => Number.isFinite(Number(c.rate)) && Number(c.rate) > 0);
          if (validCouriers.length > 0) {
            const sorted = [...validCouriers].sort((a, b) => Number(a.rate) - Number(b.rate));
            const best = sorted[0];
            const estimatedRate = Math.round(Number(best.rate));

            return {
              success: true,
              isInternational: true,
              serviceable: true,
              codAllowed: false,
              estimatedRateINR: estimatedRate,
              estimatedDays: best.etd || info.estimatedDays,
              courierName: best.courier_name || info.courierName,
              availableCouriers: validCouriers.map((c: any) => ({
                courier_company_id: c.courier_company_id,
                courier_name: c.courier_name,
                rate: Math.round(Number(c.rate)),
                etd: c.etd || info.estimatedDays,
                cod_available: false,
              })),
              source: 'LIVE_CARRIER',
            };
          }
        }
      } catch (_ignoredIntlErr) {
        // Shiprocket has no direct courier configured for this destination/weight; smoothly fallback to Admin Country Rates
      }
    }

    // Resolve via:
    // Admin Country Rate
    // → Admin Default Rate
    // → Unserviceable
    let rateINR: number;
    let source: string;

    if (
      params.siteSettings?.internationalCountryShippingRates &&
      typeof params.siteSettings.internationalCountryShippingRates[countryCode] === 'number' &&
      Number.isFinite(params.siteSettings.internationalCountryShippingRates[countryCode]) &&
      params.siteSettings.internationalCountryShippingRates[countryCode] > 0
    ) {
      rateINR = Math.round(params.siteSettings.internationalCountryShippingRates[countryCode]);
      source = 'ADMIN_COUNTRY_RATE';
    } else if (
      typeof params.siteSettings?.internationalDefaultShippingRateINR === 'number' &&
      Number.isFinite(params.siteSettings.internationalDefaultShippingRateINR) &&
      params.siteSettings.internationalDefaultShippingRateINR > 0
    ) {
      rateINR = Math.round(params.siteSettings.internationalDefaultShippingRateINR);
      source = 'ADMIN_DEFAULT_RATE';
    } else {
      return {
        success: false,
        isInternational: true,
        serviceable: false,
        codAllowed: false,
        estimatedRateINR: 0,
        estimatedDays: undefined,
        courierName: undefined,
        availableCouriers: [],
        source: 'UNSERVICEABLE',
        message: 'Shipping is currently unavailable to this destination. Please contact HAKKIVEDA support.',
      };
    }

    return {
      success: true,
      isInternational: true,
      serviceable: true,
      codAllowed: false,
      estimatedRateINR: rateINR,
      estimatedDays: info.estimatedDays,
      courierName: info.courierName,
      availableCouriers: [
        {
          courier_name: info.courierName,
          rate: rateINR,
          etd: info.estimatedDays,
          cod_available: false,
        },
      ],
      source,
    };
  }

  const result = await checkServiceability({
    pickupPincode: params.pickupPincode,
    deliveryPincode: params.deliveryPincode,
    weightInKg: params.weightInKg,
    cod: params.cod,
  });

  if (!result.serviceable || result.availableCouriers.length === 0) {
    return {
      success: false,
      serviceable: false,
      message: 'Pincode is not currently serviceable by courier partners.',
    };
  }

  // Sort by rate to give best estimation
  const lowestCostCourier = [...result.availableCouriers].sort((a, b) => a.rate - b.rate)[0];

  return {
    success: true,
    isInternational: false,
    serviceable: true,
    codAllowed: true,
    estimatedRateINR: lowestCostCourier.rate,
    estimatedDays: lowestCostCourier.etd,
    courierName: lowestCostCourier.courier_name,
    availableCouriers: result.availableCouriers,
    source: 'SHIPROCKET_DOMESTIC',
  };
}

/**
 * 3. Create Shipment / Order on Shiprocket
 */
export async function createShiprocketOrder(order: any) {
  const isIntl = order.customer?.country && !isIndiaCountry(order.customer.country);

  console.log(`[Shiprocket] Creating shipment for order ${order.orderNumber || order.id} (Intl: ${isIntl})`);

  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        error: 'Shiprocket not configured',
      };
    }
    const mockShiprocketId = Math.floor(10000000 + Math.random() * 90000000);
    const mockShipmentId = Math.floor(20000000 + Math.random() * 90000000);

    return {
      success: true,
      simulated: true,
      shiprocketOrderId: mockShiprocketId,
      shipmentId: mockShipmentId,
      awbCode: null,
      courierName: null,
      trackingUrl: null,
      shipmentStatus: 'NEW',
      message: 'Order shipment created successfully (Simulation Mode).',
    };
  }

  const orderDateStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const paymentMethod = (order.paymentMethod === 'COD' && !isIntl) ? 'COD' : 'Prepaid';

  // For international orders: authoritative item weight is strictly required
  const itemsList = order.items || [];
  if (isIntl) {
    if (!itemsList.length) {
      return {
        success: false,
        error: 'International shipment weight is missing for one or more products.',
      };
    }
    for (const item of itemsList) {
      const rawWeight = item.product?.weightInKg ?? item.weightInKg;
      if (
        rawWeight === undefined ||
        rawWeight === null ||
        typeof rawWeight !== 'number' ||
        !Number.isFinite(rawWeight) ||
        rawWeight <= 0
      ) {
        return {
          success: false,
          error: 'International shipment weight is missing for one or more products.',
        };
      }
    }
  }

  // Parcel dimensions: use valid order/package dimensions if present
  const rawLength =
    order.packageDimensions?.length ??
    order.dimensions?.length ??
    order.length ??
    order.packageDefaults?.defaultLengthCm;

  const rawBreadth =
    order.packageDimensions?.breadth ??
    order.packageDimensions?.width ??
    order.dimensions?.breadth ??
    order.dimensions?.width ??
    order.breadth ??
    order.width ??
    order.packageDefaults?.defaultWidthCm;

  const rawHeight =
    order.packageDimensions?.height ??
    order.dimensions?.height ??
    order.height ??
    order.packageDefaults?.defaultHeightCm;

  const hasValidDimensions =
    typeof rawLength === 'number' && Number.isFinite(rawLength) && rawLength > 0 &&
    typeof rawBreadth === 'number' && Number.isFinite(rawBreadth) && rawBreadth > 0 &&
    typeof rawHeight === 'number' && Number.isFinite(rawHeight) && rawHeight > 0;

  if (isIntl && !hasValidDimensions) {
    return {
      success: false,
      error: 'International shipment package dimensions (length, breadth, height) are required but missing.',
    };
  }

  const parcelLength = hasValidDimensions ? Number(rawLength) : 15;
  const parcelBreadth = hasValidDimensions ? Number(rawBreadth) : 12;
  const parcelHeight = hasValidDimensions ? Number(rawHeight) : 10;

  let calculatedSubtotal = 0;
  let totalShipmentWeight = 0;

  const orderItems = itemsList.map((item: any, index: number) => {
    const prod = item.product || {};
    const itemName = String(prod.name || item.name || item.title || `HakkiVeda Product ${index + 1}`).trim() || `HakkiVeda Product ${index + 1}`;
    const itemSku = String(prod.sku || prod.id || item.sku || item.productId || item.id || `HKV-SKU-${index + 1}`).trim();
    const itemUnits = Math.max(1, Number(item.quantity) || 1);
    const resolvedPrice = Number(item.unitPriceINR ?? prod.priceINR ?? item.priceINR ?? item.price ?? 0);
    const itemPrice = (Number.isFinite(resolvedPrice) && resolvedPrice > 0)
      ? resolvedPrice
      : (Number(item.totalPriceINR) > 0 ? Math.round(Number(item.totalPriceINR) / itemUnits) : 1);

    const rawWeight = prod.weightInKg ?? item.weightInKg;
    const itemWeight = isIntl ? Number(rawWeight) : Number(rawWeight ?? 0.5);

    calculatedSubtotal += itemPrice * itemUnits;
    totalShipmentWeight += itemWeight * itemUnits;

    return {
      name: itemName,
      sku: itemSku,
      units: itemUnits,
      selling_price: itemPrice,
      discount: 0,
      tax: 0,
    };
  });

  const finalWeight = isIntl
    ? Math.round(totalShipmentWeight * 100) / 100
    : Math.max(0.5, Math.round(totalShipmentWeight * 100) / 100);

  const merchandiseSubtotal = (typeof order.subtotalINR === 'number' && Number.isFinite(order.subtotalINR) && order.subtotalINR > 0)
    ? order.subtotalINR
    : (calculatedSubtotal > 0 ? calculatedSubtotal : (order.totalAmountINR || 0));

  const payload = {
    order_id: order.orderNumber || order.id,
    order_date: orderDateStr,
    pickup_location: 'Primary',
    comment: 'Hakkiveda Tribal Ayurvedic Order',
    billing_customer_name: order.customer?.name || 'Valued Customer',
    billing_last_name: '',
    billing_address: order.customer?.address || 'Main Road',
    billing_city: order.customer?.city || 'Bengaluru',
    billing_pincode: order.customer?.pincode || (isIntl ? '00000' : '560001'),
    billing_state: order.customer?.state || (isIntl ? 'International' : 'Karnataka'),
    billing_country: order.customer?.country || (isIntl ? 'International' : 'India'),
    billing_email: order.customer?.email || 'customer@hakkiveda.com',
    billing_phone: order.customer?.phone || '9999999999',
    shipping_is_billing: true,
    order_items: orderItems,
    payment_method: paymentMethod,
    shipping_charges: Math.max(0, Number(order.shippingFeeINR ?? order.shippingChargesINR ?? 0)),
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: Math.max(0, Number(order.discountAmountINR ?? order.discountINR ?? 0)),
    sub_total: merchandiseSubtotal,
    length: parcelLength,
    breadth: parcelBreadth,
    height: parcelHeight,
    weight: finalWeight,
  };

  const response = await shiprocketFetch('/orders/create/adhoc', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const awb = response.awb_code ? String(response.awb_code).trim() : null;
  const courier = response.courier_name ? String(response.courier_name).trim() : null;

  return {
    success: true,
    simulated: false,
    shiprocketOrderId: response.order_id,
    shipmentId: response.shipment_id,
    awbCode: awb,
    courierName: courier,
    trackingUrl: awb ? `https://shiprocket.co/tracking/${awb}` : null,
    shipmentStatus: response.status || 'NEW',
    raw: response,
  };
}

/**
 * 4. Generate AWB Code for a Shipment
 */
export async function generateAwb(shipmentId: string | number, courierId?: number) {
  console.log(`[Shiprocket] Generating AWB for shipmentId: ${shipmentId}, courierId: ${courierId || 'auto'}`);

  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        error: 'Shiprocket not configured',
      };
    }
    const mockAwb = `HKV${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    return {
      success: true,
      simulated: true,
      awbCode: mockAwb,
      courierName: 'Delhivery Surface',
      trackingUrl: `https://shiprocket.co/tracking/${mockAwb}`,
      status: 'AWB_GENERATED',
    };
  }

  const payload: any = { shipment_id: shipmentId };
  if (courierId) payload.courier_id = courierId;

  const response = await shiprocketFetch('/courier/assign/awb', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const awbData = response?.response?.data || response?.data || response;
  const awbCode = awbData?.awb_code || response?.awb_code || null;
  const awbAssignStatus = response?.awb_assign_status ?? (awbCode ? 1 : 0);

  if (!awbCode || awbAssignStatus === 0) {
    const errorMsg =
      awbData?.awb_assign_error ||
      response?.message ||
      response?.errors ||
      'Shiprocket could not assign an AWB. Please verify courier serviceability or recharge your Shiprocket wallet balance.';
    return {
      success: false,
      simulated: false,
      error: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg),
    };
  }

  const cleanAwb = String(awbCode).trim();
  const assignedCourier = awbData.courier_name ? String(awbData.courier_name).trim() : (response?.courier_name ? String(response.courier_name).trim() : null);

  return {
    success: true,
    simulated: false,
    awbCode: cleanAwb,
    courierName: assignedCourier,
    shipmentId: awbData.shipment_id || shipmentId,
    trackingUrl: `https://shiprocket.co/tracking/${cleanAwb}`,
    status: 'AWB_GENERATED',
  };
}

/**
 * 5. Schedule Pickup for a Shipment
 */
export async function schedulePickup(shipmentId: string | number) {
  console.log(`[Shiprocket] Scheduling pickup for shipmentId: ${shipmentId}`);

  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        error: 'Shiprocket not configured',
      };
    }
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    return {
      success: true,
      simulated: true,
      pickupScheduledDate: tomorrow,
      message: `Pickup scheduled successfully for ${tomorrow} (Simulation Mode)`,
    };
  }

  try {
    const payload = { shipment_id: [Number(shipmentId)] };
    const response = await shiprocketFetch('/courier/generate/pickup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const pickupScheduledDate =
      response?.response?.pickup_scheduled_date ||
      response?.pickup_scheduled_date ||
      new Date().toISOString().split('T')[0];

    const message =
      response?.response?.message ||
      response?.message ||
      'Pickup scheduled successfully with courier.';

    return {
      success: true,
      simulated: false,
      pickupStatus: response?.pickup_status || 1,
      pickupScheduledDate,
      message,
    };
  } catch (err: any) {
    // If Shiprocket indicates pickup is already scheduled or in progress, treat as idempotent success
    const errText = (err?.message || '').toLowerCase();
    if (
      errText.includes('already scheduled') ||
      errText.includes('already generated') ||
      errText.includes('pickup scheduled') ||
      errText.includes('in queue')
    ) {
      return {
        success: true,
        simulated: false,
        pickupStatus: 1,
        pickupScheduledDate: new Date().toISOString().split('T')[0],
        message: 'Pickup is already scheduled for this shipment.',
      };
    }
    throw err;
  }
}

/**
 * Synchronize real order and shipment status from Shiprocket API
 */
export async function syncShiprocketOrder(shiprocketOrderId: string | number) {
  const rawId = String(shiprocketOrderId || '').trim();
  if (!rawId || !/^\d+$/.test(rawId)) {
    throw new Error('Invalid shiprocketOrderId: numeric identifier required.');
  }

  console.log(`[Shiprocket] Syncing real order state for shiprocketOrderId: ${rawId}`);

  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        error: 'Shiprocket not configured',
      };
    }
    return {
      success: true,
      simulated: true,
      shiprocketOrderId: rawId,
      status: 'PROCESSING',
      message: 'Shiprocket simulation mode active.',
    };
  }

  try {
    const response = await shiprocketFetch(`/orders/show/${rawId}`, { method: 'GET' });
    const orderData = response?.data || response;
    const shipments = orderData?.shipments || (orderData?.shipment_id ? [orderData] : []);
    const primaryShipment = Array.isArray(shipments) && shipments.length > 0 ? shipments[0] : (orderData || {});

    const awbCode = primaryShipment.awb || primaryShipment.awb_code || null;
    const courierName = primaryShipment.courier_name || primaryShipment.courier || null;
    const shipmentId = primaryShipment.id || primaryShipment.shipment_id || null;
    const rawStatus = primaryShipment.status || orderData.status || 'NEW';
    const pickupScheduledDate = primaryShipment.pickup_scheduled_date || null;
    const pickupStatus = primaryShipment.pickup_status || null;
    const trackingUrl = awbCode ? `https://shiprocket.co/tracking/${awbCode}` : null;

    let normalizedStatus = 'NEW';
    if (rawStatus === 'CANCELED' || rawStatus === 'CANCELLED') normalizedStatus = 'CANCELLED';
    else if (rawStatus === 'DELIVERED') normalizedStatus = 'DELIVERED';
    else if (rawStatus === 'IN TRANSIT' || rawStatus === 'IN_TRANSIT' || rawStatus === 'OUT FOR DELIVERY') normalizedStatus = 'IN_TRANSIT';
    else if (pickupStatus === 1 || rawStatus === 'PICKED UP' || rawStatus === 'PICKUP SCHEDULED') normalizedStatus = 'PICKUP_SCHEDULED';
    else if (awbCode) normalizedStatus = 'AWB_GENERATED';
    else if (shipmentId) normalizedStatus = 'NEW';

    return {
      success: true,
      simulated: false,
      shiprocketOrderId: rawId,
      shipmentId,
      awbCode,
      courierName,
      shipmentStatus: normalizedStatus,
      rawStatus,
      pickupScheduledDate,
      pickupStatus,
      trackingUrl,
      raw: orderData,
    };
  } catch (err: any) {
    console.error(`[Shiprocket Sync Error for ${rawId}]:`, err?.message || err);
    throw err;
  }
}

/**
 * 6. Track Shipment
 */
export async function trackShipment(identifier: string | number) {
  if (identifier === null || identifier === undefined) {
    throw new Error('Tracking identifier is required');
  }

  const rawId = String(identifier).trim();
  if (!rawId || rawId.length > 100 || /[\x00-\x1F\x7F]/.test(rawId)) {
    throw new Error('Invalid tracking identifier format.');
  }

  // Reject directory traversal, protocol strings, or query parameter injection
  if (rawId.includes('/') || rawId.includes('\\') || rawId.includes('://') || rawId.includes('?') || rawId.includes('#')) {
    throw new Error('Invalid tracking identifier format.');
  }

  const encodedId = encodeURIComponent(rawId);
  console.log(`[Shiprocket] Tracking shipment/AWB: ${encodedId}`);

  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        error: 'Shiprocket not configured',
        scans: [],
      };
    }
    return {
      success: true,
      simulated: true,
      trackingNumber: rawId,
      shipmentStatus: 'IN_TRANSIT',
      currentLocation: 'Bengaluru Logistics Hub',
      expectedDelivery: 'In 2 Business Days',
      courierName: 'Delhivery Surface',
      trackingUrl: `https://shiprocket.co/tracking/${encodedId}`,
      scans: [
        { date: new Date().toISOString(), activity: 'Package Picked Up from HakkiPikki Herbal Facility', location: 'Bengaluru' },
        { date: new Date().toISOString(), activity: 'In Transit to Destination Hub', location: 'Bengaluru Hub' },
      ],
    };
  }

  // Try tracking by AWB or Shipment ID
  let endpoint = `/courier/track/awb/${encodedId}`;
  let response;
  try {
    response = await shiprocketFetch(endpoint, { method: 'GET' });
  } catch (err) {
    endpoint = `/courier/track/shipment/${encodedId}`;
    response = await shiprocketFetch(endpoint, { method: 'GET' });
  }

  const trackData = response?.tracking_data || response;
  const currentStatus = trackData?.shipment_track?.[0]?.current_status || trackData?.track_status || 'IN_TRANSIT';
  const trackCourier = trackData?.courier_name ? String(trackData.courier_name).trim() : null;

  return {
    success: true,
    simulated: false,
    trackingNumber: rawId,
    shipmentStatus: currentStatus,
    courierName: trackCourier,
    trackingUrl: trackData?.track_url || `https://shiprocket.co/tracking/${encodedId}`,
    scans: trackData?.shipment_track || [],
    raw: trackData,
  };
}

/**
 * 7. Download Shipping Label
 */
export async function downloadLabel(shipmentId: string | number) {
  const rawId = String(shipmentId || '').trim();
  if (!rawId || rawId.length > 50 || !/^\d+$/.test(rawId)) {
    throw new Error('Invalid shipmentId: numeric identifier required.');
  }

  console.log(`[Shiprocket] Generating label for shipmentId: ${rawId}`);

  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        error: 'Shiprocket not configured',
      };
    }
    return {
      success: true,
      simulated: true,
      labelUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      message: 'Label generated (Simulation Mode)',
    };
  }

  const payload = { shipment_id: [Number(rawId)] };
  const response = await shiprocketFetch('/courier/generate/label', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const labelUrl = response?.label_url || response?.response?.label_url;
  if (!labelUrl) {
    return {
      success: false,
      error: 'Shipping label URL not available from Shiprocket.',
    };
  }

  return {
    success: true,
    simulated: false,
    labelUrl,
  };
}

/**
 * 8. Download Invoice
 */
export async function downloadInvoice(shiprocketOrderId: string | number) {
  const rawId = String(shiprocketOrderId || '').trim();
  if (!rawId || rawId.length > 50 || !/^\d+$/.test(rawId)) {
    throw new Error('Invalid orderId: numeric identifier required.');
  }

  console.log(`[Shiprocket] Generating invoice for orderId: ${rawId}`);

  if (!isShiprocketConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        error: 'Shiprocket not configured',
      };
    }
    return {
      success: true,
      simulated: true,
      invoiceUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      message: 'Invoice generated (Simulation Mode)',
    };
  }

  const payload = { ids: [Number(rawId)] };
  const response = await shiprocketFetch('/orders/print/invoice', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const invoiceUrl = response?.invoice_url || response?.response?.invoice_url;
  if (!invoiceUrl) {
    return {
      success: false,
      error: 'Invoice URL not available from Shiprocket.',
    };
  }

  return {
    success: true,
    simulated: false,
    invoiceUrl,
  };
}
