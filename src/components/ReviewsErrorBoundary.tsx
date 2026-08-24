import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReturn?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ReviewsErrorBoundary extends (React.Component as new (props: Props) => any) {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ReviewsErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-[var(--brand-gold)] flex items-center justify-center mb-4 border border-amber-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif-luxury font-bold text-[#123F2A] dark:text-white mb-2">
            Reviews Section Temporary Pause
          </h2>
          <p className="text-xs text-[#5F6B63] dark:text-slate-400 mb-6 max-w-md leading-relaxed">
            We encountered an issue displaying these customer reviews. You can return to the product formulation or retry loading.
          </p>
          <div className="flex items-center gap-3">
            {this.props.onReturn && (
              <button
                type="button"
                onClick={this.props.onReturn}
                className="px-5 py-2.5 bg-[#123F2A] hover:bg-[#0B2F20] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 text-[var(--brand-gold)]" />
                <span>Return to Product</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2.5 border border-[#E7E1D5] dark:border-white/20 text-[#123F2A] dark:text-white rounded-xl text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
