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
  if (rootEl && (!rootEl.childNodes || rootEl.childNodes.length === 0 || rootEl.querySelector('#fallback-error-container'))) {
    // Construct fallback UI safely using DOM nodes to prevent any XSS in error messages
    const fallbackContainer = document.createElement('div');
    fallbackContainer.id = 'fallback-error-container';
    fallbackContainer.style.cssText = 'min-height:100vh;background:#082214;color:#fff;display:flex;align-items:center;justify-content:center;padding:24px;font-family:sans-serif;text-align:center;';

    const card = document.createElement('div');
    card.style.cssText = 'max-width:480px;background:#0a2e1b;border:1px solid #d4af37;padding:32px;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,0.5);';

    const brand = document.createElement('div');
    brand.style.cssText = 'font-size:32px;color:#d4af37;margin-bottom:12px;font-weight:bold;font-family:serif;';
    brand.textContent = 'HAKKIVEDA';

    const title = document.createElement('h2');
    title.style.cssText = 'font-size:18px;margin:0 0 8px 0;color:#ff6b6b;';
    title.textContent = 'Application Startup Notice';

    const desc = document.createElement('p');
    desc.style.cssText = 'font-size:13px;color:#cbd5e1;margin-bottom:16px;line-height:1.5;';
    desc.textContent = 'HAKKIVEDA encountered an issue during startup. Diagnostic logs have been recorded in the console.';

    const errorBox = document.createElement('div');
    errorBox.style.cssText = 'background:#05170d;border:1px solid rgba(212,175,55,0.2);padding:12px;border-radius:8px;font-size:11px;color:#94a3b8;word-break:break-all;text-align:left;max-height:120px;overflow-y:auto;margin-bottom:20px;';
    errorBox.textContent = String(message || 'Unknown error');

    const btn = document.createElement('button');
    btn.style.cssText = 'background:#d4af37;color:#082214;border:none;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:12px;letter-spacing:1px;cursor:pointer;text-transform:uppercase;';
    btn.textContent = 'Reset Cache & Reload';
    btn.onclick = () => {
      localStorage.clear();
      window.location.reload();
    };

    card.appendChild(brand);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(errorBox);
    card.appendChild(btn);
    fallbackContainer.appendChild(card);

    rootEl.replaceChildren(fallbackContainer);
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
