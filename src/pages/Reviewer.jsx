import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Reviewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error) setLogs(data || []);
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <button className="mb-4 px-3 py-1 bg-blue-600 text-white rounded" onClick={fetchLogs}>Refresh</button>
      <div className="space-y-3">
        {logs.length === 0 && <div>No audit logs yet</div>}
        {logs.map(log => (
          <div key={log.id} className="border p-3 rounded">
            <div className="text-sm text-gray-600">{new Date(log.created_at).toLocaleString()}</div>
            <pre className="text-xs mt-2 max-h-48 overflow-auto">{JSON.stringify(log.payload, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
