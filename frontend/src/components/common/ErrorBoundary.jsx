import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * Catches render errors so one broken component does not leave the visitor
 * looking at a blank white page — which is what happened previously, since the
 * app had no boundary at all.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Replace with a reporting service when one is available.
    console.error('Unhandled UI error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="container bw-section text-center">
        <div className="bw-empty__icon" aria-hidden="true">
          <FaExclamationTriangle />
        </div>
        <h1 className="h4 mb-3">This page stopped working</h1>
        <p className="bw-prose mx-auto mb-4">
          Reload the page to continue. If it keeps happening, call us on 0721 633 223 and we will
          help you finish what you were doing.
        </p>
        <button type="button" className="bw-btn bw-btn--primary" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    );
  }
}
