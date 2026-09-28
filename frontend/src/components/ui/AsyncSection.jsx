import React from 'react';
import Loader from './Loader';
import ErrorState from './ErrorState';

/**
 * Renders the right thing for a loading / error / empty / ready request.
 * Keeps the three-way branch out of every page body.
 */
export default function AsyncSection({
  loading,
  error,
  onRetry,
  isEmpty = false,
  empty = null,
  loadingText = 'Loading',
  children,
}) {
  if (loading) return <Loader text={loadingText} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (isEmpty && empty) return empty;
  return children;
}
