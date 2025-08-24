import React, { useState } from 'react';
import { healthCheck } from '@/lib/api';

const ApiTest: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const testConnection = async () => {
    setLoading(true);
    setError('');
    setStatus('');
    
    try {
      const result = await healthCheck();
      setStatus(`✅ ${result.message}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-4">Backend Connection Test</h3>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      {status && (
        <div className="mt-3 p-2 bg-green-100 text-green-800 rounded">
          {status}
        </div>
      )}
      
      {error && (
        <div className="mt-3 p-2 bg-red-100 text-red-800 rounded">
          ❌ {error}
        </div>
      )}
      
      <div className="mt-3 text-sm text-gray-600">
        <p>Backend URL: {import.meta.env.DEV ? '/api (proxy to localhost:4000)' : 'http://localhost:4000/api'}</p>
      </div>
    </div>
  );
};

export default ApiTest;
