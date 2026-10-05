import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('DandiyaMatch ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full bg-[#0D0208] flex flex-col items-center justify-center p-6 text-center select-none">
          <span className="text-4xl mb-3">🪔</span>
          <h2 className="text-xl font-heading font-bold text-gold mb-2">
            Kuch Gadbad Hui!
          </h2>
          <p className="text-xs text-text-muted mb-6 max-w-xs">
            Festive vibes ko restore karne ke liye niche click karein.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-marigold text-white font-bold text-sm shadow-glow-primary hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Chalo Garba Ghumiye 🎊
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
