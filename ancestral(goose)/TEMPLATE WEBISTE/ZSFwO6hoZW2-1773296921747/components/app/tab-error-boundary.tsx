'use client';

import React from 'react';

interface Props {
  tabName: string;
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

export class TabErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
          <span className="text-3xl">⚠️</span>
          <div>
            <p className="text-foreground font-medium mb-1">
              Something went wrong in the {this.props.tabName} tab
            </p>
            <p className="text-sm text-muted-foreground max-w-sm">
              {this.state.error.message || 'An unexpected error occurred.'}
            </p>
          </div>
          <button
            onClick={() => this.setState({ error: null })}
            className="text-xs px-4 py-2 rounded-full border border-border text-muted-foreground hover:border-foreground/30 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
