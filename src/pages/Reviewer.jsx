import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function JsonModal({ payload, onClose }) {
  if (!payload) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-11/12 max-w-3xl">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium">Audit JSON</div>
          <button onClick={onClose} className="px-2 py-1 bg-gray-200 rounded">Close</button>
        </div>
        <pre className="text-xs max-h-96 overflow-auto">{JSON.stringify(payload, null, 2)}</pre>
      </div>
    </div>
  );
}

export default function Reviewer() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  const [decisionFilter, setDecisionFilter] = useState('');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchLogs(); }, [page]);

  async function fetchLogs() {
    const limit = 20;
    const offset = page * limit;
    let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).range(offset, offset + limit - 1);
    const { data, error } = await query;
    if (!error) setLogs(data || []);
  }

  function filteredLogs() {
    return logs.filter(l => {
      const payload = l.payload || {};
      const text = JSON.stringify(payload).toLowerCase();
      if (filter && !text.includes(filter.toLowerCase())) return false;
      if (decisionFilter && payload.decision !== decisionFilter) return false;
      return true;
    });
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex gap-3 mb-3">
        <input placeholder="Search logs" value={filter} onChange={e => setFilter(e.target.value)} className="p-2 border rounded flex-1" />
        <select value={decisionFilter} onChange={e => setDecisionFilter(e.target.value)} className="p-2 border rounded">
          <option value="">All</option>
          <option value="approve">Approve</option>
          <option value="manual_review">Manual Review</option>
          <option value="decline">Decline</option>
        </select>
        <button onClick={() => { setPage(0); fetchLogs(); }} className="px-3 py-1 bg-blue-600 text-white rounded">Refresh</button>
      </div>

      <div className="space-y-3">
        {filteredLogs().length === 0 && <div>No audit logs yet</div>}
        {filteredLogs().map(log => (
          <div key={log.id} className="border p-3 rounded flex justify-between items-start">
            <div className="flex-1">
              <div className="text-sm text-gray-600">{new Date(log.created_at).toLocaleString()}</div>
              <div className="text-sm mt-1">{(log.payload?.decision || '—').toUpperCase()} — {log.payload?.reason || ''}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelected(log.payload)} className="px-2 py-1 bg-gray-200 rounded text-sm">View JSON</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">Page {page + 1}</div>
        <div className="flex gap-2">
          <button onClick={() => { if (page > 0) setPage(p => p - 1); }} className="px-2 py-1 bg-gray-200 rounded">Prev</button>
          <button onClick={() => { setPage(p => p + 1); }} className="px-2 py-1 bg-gray-200 rounded">Next</button>
        </div>
      </div>

      <JsonModal payload={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
