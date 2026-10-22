import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { unlink } from 'node:fs/promises';
const outfile = new URL('./.orders-render-bundle.mjs', import.meta.url).pathname;
await build({ entryPoints: ['src/app/screens/AppOrdersScreen.tsx'], outfile, bundle: true, platform: 'node', format: 'esm', packages: 'external', plugins: [{ name: 'test-store', setup(build) {
  build.onResolve({ filter: /context\/StoreContext$/ }, () => ({ path: 'store', namespace: 'test' }));
  build.onResolve({ filter: /utils\/nativeUrl$/ }, () => ({ path: 'urls', namespace: 'test' }));
  build.onLoad({ filter: /.*/, namespace: 'test' }, ({ path }) => ({ contents: path === 'store' ? 'export const useStore = () => globalThis.__ordersStore;' : 'export const resolveApiUrl = x => x; export const resolveAssetUrl = x => x;' }));
} }] });
try {
 const { AppOrdersScreen } = await import(outfile);
 const defaults = { currentUser: { id: 'a', email: 'a@example.test' }, orders: [], products: [], loadCustomerOrders: async () => {}, addToCart() {}, setIsCartOpen() {}, customerOrdersLoading: false, customerOrdersError: '' };
 const render = overrides => { globalThis.__ordersStore = { ...defaults, ...overrides }; return renderToStaticMarkup(React.createElement(AppOrdersScreen, { onSignIn() {} })); };
 const guest = render({ currentUser: null });
 assert.match(guest, /Sign in to see your orders/);
 assert.doesNotMatch(guest, /Enter Order ID/);
 assert.match(render({ customerOrdersLoading: true }), /Loading your orders/);
 const failure = render({ customerOrdersError: 'Session expired' });
 assert.match(failure, /Session expired/);
 assert.doesNotMatch(failure, /No orders yet/);
 assert.match(render({}), /No orders yet/);
 const product = { id: 'p', name: 'HAKKIVEDA Oil', priceINR: 800, image: '/oil.png' };
 const own = { id: 'order-a', orderNumber: 'HV-A', customer: { email: 'a@example.test' }, items: [{ product, quantity: 2 }], totalAmountINR: 1600, trackingStatus: 'IN_TRANSIT' };
 const cards = render({ orders: [own, { ...own, id: 'foreign', orderNumber: 'PRIVATE-B', customer: { email: 'b@example.test' } }] });
 assert.match(cards, /HAKKIVEDA Oil/);
 assert.match(cards, /HV-A/);
 assert.match(cards, /IN TRANSIT/);
 assert.match(cards, /Buy Again/);
 assert.match(cards, /Refresh orders/);
 assert.doesNotMatch(cards, /PRIVATE-B/);
 console.log('PASS: Orders guest, loading, error, empty, product cards, status, reorder controls and customer isolation render checks.');
} finally { await unlink(outfile); delete globalThis.__ordersStore; }
