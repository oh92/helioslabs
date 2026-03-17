'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the full error for debugging
    console.error('Page error:', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    if (typeof error === 'object') {
      console.error('Error keys:', Object.keys(error));
      console.error('Error JSON:', JSON.stringify(error, null, 2));
    }
  }, [error]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
      <pre className="text-sm text-red-600 mb-4 whitespace-pre-wrap font-mono bg-card/30 border border-border rounded p-4">
        {error?.message || JSON.stringify(error, null, 2) || String(error)}
      </pre>
      {error?.stack && (
        <pre className="text-xs text-muted-foreground mb-4 whitespace-pre-wrap font-mono">
          {error.stack}
        </pre>
      )}
      <button
        onClick={reset}
        className="px-4 py-2 text-sm border border-border rounded hover:bg-muted transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
