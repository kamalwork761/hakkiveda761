import dotenv from 'dotenv';

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
    console.warn('[Shiprocket] Credentials (SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD) not configured. Operating in simulation mode.');
    return 'SIMULATED_SHIPROCKET_TOKEN';
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

/**
 * Helper to make authenticated requests to Shiprocket REST API.
 */
async function shiprocketFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getShiprocketToken();

  if (token === 'SIMULATED_SHIPROCKET_TOKEN') {
    return null; // Signals caller to use simulated fallback data
  }

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
    console.error(`[Shiprocket Error ${res.status}] ${url}:`, json);
    throw new Error(json.message || json.errors || `Shiprocket API error HTTP ${res.status}`);
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

  const endpoint = `/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weight}&cod=${cod}`;
  const data = await shiprocketFetch(endpoint, { method: 'GET' });

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
}

/**
 * 2. Shipping Rate Estimation
 */
export async function estimateShippingRate(params: {
  deliveryPincode: string;
  pickupPincode?: string;
  weightInKg?: number;
  cod?: boolean;
  isInternational?: boolean;
}) {
  if (params.isInternational) {
    return {
      success: true,
      isInternational: true,
      codAllowed: false,
      estimatedRateINR: 1850,
      estimatedDays: '7-12 Days',
      courierName: 'DHL Express International',
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
  };
}

/**
 * 3. Create Shipment / Order on Shiprocket
 */
export async function createShiprocketOrder(order: any) {
  const isIntl = order.customer?.country && order.customer.country.trim().toUpperCase() !== 'INDIA';

  console.log(`[Shiprocket] Creating shipment for order ${order.orderNumber || order.id} (Intl: ${isIntl})`);

  if (!isShiprocketConfigured()) {
    const mockShiprocketId = Math.floor(10000000 + Math.random() * 90000000);
    const mockShipmentId = Math.floor(20000000 + Math.random() * 90000000);
    const mockAwb = `HKV${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const courier = isIntl ? 'DHL Express International' : 'Delhivery Surface';

    return {
      success: true,
      simulated: true,
      shiprocketOrderId: mockShiprocketId,
      shipmentId: mockShipmentId,
      awbCode: mockAwb,
      courierName: courier,
      trackingUrl: `https://shiprocket.co/tracking/${mockAwb}`,
      shipmentStatus: 'MANIFESTED',
      message: 'Order shipment created successfully (Simulation Mode).',
    };
  }

  const orderDateStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const paymentMethod = (order.paymentMethod === 'COD' && !isIntl) ? 'COD' : 'Prepaid';

  const orderItems = (order.items || []).map((item: any, index: number) => ({
    name: item.title || item.name || `Hakkiveda Product ${index + 1}`,
    sku: item.id || `HKV-SKU-${index + 1}`,
    units: item.quantity || 1,
    selling_price: item.priceINR || item.price || 0,
    discount: 0,
    tax: 0,
  }));

  const payload = {
    order_id: order.orderNumber || order.id,
    order_date: orderDateStr,
    pickup_location: 'Primary',
    comment: 'Hakkiveda Herbal Order',
    billing_customer_name: order.customer?.name || 'Valued Customer',
    billing_last_name: '',
    billing_address: order.customer?.address || 'Main Road',
    billing_city: order.customer?.city || 'Bengaluru',
    billing_pincode: order.customer?.pincode || '560001',
    billing_state: order.customer?.state || 'Karnataka',
    billing_country: order.customer?.country || 'India',
    billing_email: order.customer?.email || 'customer@hakkiveda.store',
    billing_phone: order.customer?.phone || '9999999999',
    shipping_is_billing: true,
    order_items: orderItems,
    payment_method: paymentMethod,
    shipping_charges: order.shippingChargesINR || 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: order.discountINR || 0,
    sub_total: order.totalAmountINR || 0,
    length: 15,
    breadth: 12,
    height: 10,
    weight: 0.5,
  };

  const response = await shiprocketFetch('/orders/create/adhoc', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    success: true,
    simulated: false,
    shiprocketOrderId: response.order_id,
    shipmentId: response.shipment_id,
    awbCode: response.awb_code || null,
    courierName: response.courier_name || (isIntl ? 'International Courier' : 'Shiprocket Partner'),
    trackingUrl: response.awb_code ? `https://shiprocket.co/tracking/${response.awb_code}` : null,
    shipmentStatus: response.status || 'NEW',
    raw: response,
  };
}

/**
 * 4. Generate AWB Code for a Shipment
 */
export async function generateAwb(shipmentId: string | number, courierId?: number) {
  console.log(`[Shiprocket] Generating AWB for shipmentId: ${shipmentId}`);

  if (!isShiprocketConfigured()) {
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

  return {
    success: true,
    simulated: false,
    awbCode: awbData.awb_code,
    courierName: awbData.courier_name,
    shipmentId: awbData.shipment_id || shipmentId,
    trackingUrl: awbData.awb_code ? `https://shiprocket.co/tracking/${awbData.awb_code}` : null,
    status: 'AWB_GENERATED',
  };
}

/**
 * 5. Schedule Pickup for a Shipment
 */
export async function schedulePickup(shipmentId: string | number) {
  console.log(`[Shiprocket] Scheduling pickup for shipmentId: ${shipmentId}`);

  if (!isShiprocketConfigured()) {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    return {
      success: true,
      simulated: true,
      pickupScheduledDate: tomorrow,
      message: `Pickup scheduled successfully for ${tomorrow} (Simulation Mode)`,
    };
  }

  const payload = { shipment_id: [Number(shipmentId)] };
  const response = await shiprocketFetch('/courier/generate/pickup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    success: true,
    simulated: false,
    pickupStatus: response?.pickup_status || 1,
    pickupScheduledDate: response?.response?.pickup_scheduled_date || new Date().toISOString().split('T')[0],
    message: response?.response?.message || 'Pickup scheduled successfully.',
  };
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

  return {
    success: true,
    simulated: false,
    trackingNumber: rawId,
    shipmentStatus: currentStatus,
    courierName: trackData?.courier_name || 'Shiprocket Courier',
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

  return {
    success: true,
    simulated: false,
    labelUrl: response?.label_url || response?.response?.label_url,
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

  return {
    success: true,
    simulated: false,
    invoiceUrl: response?.invoice_url || response?.response?.invoice_url,
  };
}
