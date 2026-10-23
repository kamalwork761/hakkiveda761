import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';

const directory = await mkdtemp(join(tmpdir(), 'hakkiveda-orders-'));
const port = 19000 + Math.floor(Math.random() * 1000);
const base = `http://127.0.0.1:${port}`;
const customer = { id: 'test-a', name: 'Test A', email: 'a@example.test', passwordBcrypt: await bcrypt.hash('test-password', 10), sessionVersion: 0, status: 'ACTIVE' };
const own = { id: 'order-a', orderNumber: 'HV-A', customerId: customer.id, customer: { email: customer.email }, paymentMethod: 'COD', paymentStatus: 'COD_DUE', trackingStatus: 'IN_TRANSIT', items: [] };
await writeFile(join(directory, 'store.json'), JSON.stringify({ seeded: true, customer_accounts: [customer], orders: [own, { ...own, id: 'order-b', orderNumber: 'HV-B', customerId: 'test-b', customer: { email: 'b@example.test' } }, { ...own, id: 'failed-payment', paymentMethod: 'RAZORPAY', paymentStatus: 'FAILED' }] }));
const child = spawn(process.execPath, ['dist/server.cjs'], { env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', NODE_ENV: 'production', DB_DIR: directory, DB_PATH: join(directory, 'store.json'), UPLOAD_DIR: join(directory, 'uploads'), ADMIN_SESSION_SECRET: randomBytes(32).toString('hex'), CUSTOMER_SESSION_SECRET: randomBytes(32).toString('hex') }, stdio: ['ignore', 'pipe', 'pipe'] });
let logs = '';
child.stdout.on('data', chunk => { logs += chunk; });
child.stderr.on('data', chunk => { logs += chunk; });
const request = (path, token, options = {}) => fetch(`${base}${path}`, { ...options, headers: { Origin: 'https://localhost', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { await fetch(`${base}/api/auth/me`); ready = true; break; } catch {}
    if (child.exitCode !== null) throw new Error(logs);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, logs);
  assert.equal((await request('/api/customer/orders')).status, 401);
  const wrong = await request('/api/auth/login', null, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: customer.email, password: 'wrong-password' }) });
  assert.equal(wrong.status, 401);
  assert.equal(wrong.headers.get('set-cookie'), null);
  const login = await request('/api/auth/login', null, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: customer.email, password: 'test-password' }) });
  assert.equal(login.status, 200);
  const { token } = await login.json();
  assert.ok(token);
  assert.equal((await request('/api/auth/me', token)).status, 200);
  const list = await request('/api/customer/orders', token, { headers: { Cookie: 'hakkiveda_customer_token=stale-cookie' } });
  assert.equal(list.status, 200, 'Bearer token must override stale WebView cookie');
  assert.equal(list.headers.get('access-control-allow-origin'), 'https://localhost');
  assert.match(list.headers.get('cache-control'), /no-store/);
  assert.deepEqual((await list.json()).orders.map(order => order.id), ['order-a']);
  assert.equal((await request('/api/customer/orders/HV-A', token)).status, 200);
  assert.equal((await request('/api/customer/orders/order-b', token)).status, 403);
  assert.equal((await request('/api/customer/orders/missing', token)).status, 404);
  const change = await request('/api/customer/change-password', token, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: 'test-password', newPassword: 'new-test-password' }) });
  assert.equal(change.status, 200);
  const fresh = (await change.json()).token;
  assert.ok(fresh);
  assert.equal((await request('/api/customer/orders', token)).status, 401);
  assert.equal((await request('/api/customer/orders', fresh)).status, 200);
  assert.equal((await request('/api/auth/logout', fresh, { method: 'POST' })).status, 200);
  assert.equal((await request('/api/customer/orders', fresh)).status, 401);
  console.log('PASS: password rejection, login, session restoration, Android CORS, stale-cookie precedence, private orders, failed-payment exclusion, IDOR, password rotation, logout revocation.');
} finally {
  child.kill();
  await new Promise(resolve => child.exitCode !== null ? resolve() : child.once('exit', resolve));
  await rm(directory, { recursive: true, force: true });
}
