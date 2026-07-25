import React from 'react';

export default function DecisionCard({ result }) {
  const { decision, reason, prob, contributions, rulesTriggered } = result;

  return (
    <div className="mt-4 border p-4 rounded bg-gray-50">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-lg font-semibold">Decision: <span className="capitalize">{decision}</span></div>
          <div className="text-sm text-gray-600">{reason}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Model score</div>
          <div className="text-xl font-mono">{(prob * 100).toFixed(1)}%</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="font-medium">Rules triggered</div>
        {rulesTriggered.length === 0 && <div className="text-sm text-gray-600">None</div>}
        {rulesTriggered.map(r => (
          <div key={r.id} className="text-sm">{r.name} — <span className="text-xs text-gray-500">{r.severity}</span></div>
        ))}
      </div>

      <div className="mt-3">
        <div className="font-medium">Model contributions</div>
        <ul className="text-sm">
          {contributions.map(c => (
            <li key={c.name}>{c.name}: value {c.value} → contribution {c.contrib.toFixed(3)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
