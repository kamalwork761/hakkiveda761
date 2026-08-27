import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('[HAKKIVEDA STARTUP] main loaded');

// Global Error Diagnostics
window.onerror = function (message, source, lineno, colno, error) {
  console.error('[HAKKIVEDA GLOBAL ERROR]', {
    message,
    source,
    lineno,
    colno,
    stack: error?.stack,
    error,
  });

  const rootEl = document.getElementById('root');
  if (rootEl && (!rootEl.childNodes || rootEl.childNodes.length === 0 || rootEl.innerHTML.includes('fallback-error-container'))) {
    rootEl.innerHTML = `
      <div id="fallback-error-container" style="min-height:100vh;background:#082214;color:#fff;display:flex;align-items:center;justify-content:center;padding:24px;font-family:sans-serif;text-align:center;">
        <div style="max-width:480px;background:#0a2e1b;border:1px solid #d4af37;padding:32px;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.5);">
          <div style="font-size:32px;color:#d4af37;margin-bottom:12px;font-weight:bold;font-family:serif;">HAKKIVEDA</div>
          <h2 style="font-size:18px;margin:0 0 8px 0;color:#ff6b6b;">Application Startup Notice</h2>
          <p style="font-size:13px;color:#cbd5e1;margin-bottom:16px;line-height:1.5;">HAKKIVEDA encountered an issue during startup. Diagnostic logs have been recorded in the console.</p>
          <div style="background:#05170d;border:1px solid rgba(212,175,55,0.2);padding:12px;border-radius:8px;font-size:11px;color:#94a3b8;word-break:break-all;text-align:left;max-height:120px;overflow-y:auto;margin-bottom:20px;">
            ${String(message || 'Unknown error')}
          </div>
          <button onclick="localStorage.clear();window.location.reload();" style="background:#d4af37;color:#082214;border:none;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:12px;letter-spacing:1px;cursor:pointer;text-transform:uppercase;">
            Reset Cache & Reload
          </button>
        </div>
      </div>
    `;
  }
};

window.onunhandledrejection = function (event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }
};

const container = document.getElementById('root');
if (!container) {
  console.error('[HAKKIVEDA STARTUP] Fatal: Root element #root not found in document');
} else {
  console.log('[HAKKIVEDA STARTUP] React root found');
  try {
    const root = createRoot(container);
    console.log('[HAKKIVEDA STARTUP] createRoot called');
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (err) {
    console.error('[HAKKIVEDA STARTUP] Fatal error during createRoot.render:', err);
    if (window.onerror) {
      window.onerror(
        err instanceof Error ? err.message : String(err),
        'src/main.tsx',
        0,
        0,
        err instanceof Error ? err : undefined
      );
    }
  }
}
