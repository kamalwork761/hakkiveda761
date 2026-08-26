import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class AppErrorBoundary extends (React.Component as new (props: Props) => any) {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidMount() {
    console.log('[HAKKIVEDA STARTUP] AppErrorBoundary mounted');
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AppErrorBoundary] Uncaught application runtime error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public handleReload = () => {
    try {
      localStorage.removeItem('hakkiveda_site_settings');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#082214] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#0a2e1b] border border-[#d4af37]/30 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] text-2xl font-serif">
              HV
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif text-[#d4af37] tracking-wider mb-2">HAKKIVEDA</h1>
              <p className="text-sm text-slate-300">
                A temporary display hiccup occurred while loading the ancestral catalog.
              </p>
            </div>
            <button
              onClick={this.handleReload}
              className="w-full bg-[#d4af37] hover:bg-[#c59e2b] text-[#082214] font-bold py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer uppercase text-xs tracking-widest"
            >
              Refresh Store
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
