import React from 'react';

function ContributionBar({ name, contrib, maxAbs }) {
  const width = Math.min(100, Math.abs(contrib) / maxAbs * 100 || 0);
  const positive = contrib >= 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs text-gray-600">{name}</div>
      <div className="flex-1 bg-gray-200 h-3 rounded overflow-hidden">
        <div style={{ width: `${width}%` }} className={`h-3 ${positive ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
      <div className="w-20 text-xs text-right">{contrib.toFixed(3)}</div>
    </div>
  );
}

export default function DecisionCard({ result }) {
  if (!result) return null;
  const { decision, reason, prob = 0, contributions = [], rulesTriggered = [] } = result;
  const maxAbs = Math.max(...contributions.map(c => Math.abs(c.contrib)), 0.0001);

  return (
    <div className="mt-4 border p-4 rounded bg-gray-50 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div className="space-y-1">
          <div className="text-lg font-semibold">
            Decision:
            <span className={`ml-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${decision === 'approve' ? 'bg-green-50 text-green-700' : decision === 'manual_review' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
              {decision.toUpperCase()}
            </span>
          </div>
          <div className="text-sm text-gray-600">{reason}</div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500">Model score</div>
          <div className="text-2xl font-mono">{(prob * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div>
        <div className="h-3 bg-gray-200 rounded overflow-hidden">
          <div style={{ width: `${Math.min(100, prob * 100)}%` }} className={`h-3 ${prob > 0.6 ? 'bg-green-500' : (prob > 0.4 ? 'bg-yellow-500' : 'bg-red-500')}`} />
        </div>
      </div>

      <div>
        <div className="font-medium">Rules triggered</div>
        {rulesTriggered.length === 0 && <div className="text-sm text-gray-600">None</div>}
        {rulesTriggered.map(r => (
          <div key={r.id} className="text-sm">{r.name} — <span className="text-xs text-gray-500">{r.severity}</span></div>
        ))}
      </div>

      <div>
        <div className="font-medium">Model contributions</div>
        <div className="space-y-2 mt-2">
          {contributions.map(c => (
            <ContributionBar key={c.name} name={c.name} contrib={c.contrib} maxAbs={maxAbs} />
          ))}
        </div>
      </div>
    </div>
  );
}
