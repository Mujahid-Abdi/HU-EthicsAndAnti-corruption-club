import React from 'react';

export default function SimpleVote() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-black mb-4">Simple Vote Test</h1>
      <p className="text-lg text-gray-700">
        This is a simple test page to verify React routing is working.
      </p>
      <div className="mt-4 p-4 bg-blue-100 rounded">
        <p>If you can see this, React is working fine.</p>
        <p>The issue is likely in the complex Vote component.</p>
      </div>
    </div>
  );
}