import React, { useEffect, useState } from 'react';

function JsonModal({ payload, onClose }) {
  if (!payload) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-4 rounded w-11/12 max-w-3xl">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium">Audit JSON</div>
          <button onClick={onClose} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded">Close</button>
        </div>
        <pre className="text-xs max-h-96 overflow-auto text-gray-800 dark:text-gray-200">{JSON.stringify(payload, null, 2)}</pre>
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
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => { fetchLogs(); }, [page]);

  async function fetchLogs() {
    const limit = 20;
    const offset = page * limit;
    setFetchError(null);

    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      const res = await fetch(`/.netlify/functions/auditProxy?${params.toString()}`);
      const text = await res.text();
      let payload;
      try {
        payload = JSON.parse(text);
      } catch {
        payload = null;
      }

      if (!res.ok) {
        const message = payload?.error || text || 'Failed to load audit logs';
        setLogs([]);
        setFetchError(message);
        return;
      }

      setLogs(payload?.data || []);
    } catch (err) {
      setLogs([]);
      setFetchError(err.message || 'Failed to load audit logs');
    }
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
    <div className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input placeholder="Search logs" value={filter} onChange={e => setFilter(e.target.value)} className="p-3 border border-gray-300 rounded flex-1 bg-white text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-600" />
        <select value={decisionFilter} onChange={e => setDecisionFilter(e.target.value)} className="p-3 border border-gray-300 rounded w-full sm:w-auto bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600">
          <option value="">All</option>
          <option value="approve">Approve</option>
          <option value="manual_review">Manual Review</option>
          <option value="decline">Decline</option>
        </select>
        <button onClick={() => { setPage(0); fetchLogs(); }} className="px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg">Refresh</button>
      </div>

      <div className="space-y-3">
        {fetchError && <div className="text-sm text-red-600 dark:text-red-400">{fetchError}</div>}
        {!fetchError && filteredLogs().length === 0 && <div className="text-sm text-gray-600 dark:text-gray-300">No audit logs yet</div>}
        {filteredLogs().map(log => (
          <div key={log.id} className="border p-4 rounded-lg flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex-1">
              <div className="text-sm text-gray-600 dark:text-gray-300">{new Date(log.created_at).toLocaleString()}</div>
              <div className="text-sm mt-1">{(log.payload?.decision || '—').toUpperCase()} — {log.payload?.reason || ''}</div>
            </div>
            <button onClick={() => setSelected(log.payload)} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded text-sm">View JSON</button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mt-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">Page {page + 1}</div>
        <div className="flex gap-2">
          <button disabled={page === 0} onClick={() => { if (page > 0) setPage(p => p - 1); }} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded disabled:opacity-40">Prev</button>
          <button onClick={() => { setPage(p => p + 1); }} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded">Next</button>
        </div>
      </div>

      <JsonModal payload={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
