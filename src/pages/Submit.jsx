import React, { useState, useEffect } from 'react';
import ApplicationForm from '../components/ApplicationForm';
import DecisionCard from '../components/DecisionCard';
import { scoreApplicant } from '../lib/model';

export default function Submit() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveScore, setLiveScore] = useState(null);
  const [thresholds, setThresholds] = useState({ decline: 0.4, review: 0.6 });

  // Called by ApplicationForm on every change for live preview
  function handleLivePreview(applicant) {
    const { prob, contributions } = scoreApplicant({
      income: applicant.income,
      age: applicant.age,
      loan_amount: applicant.loan_amount,
      debt_ratio: applicant.debt_ratio
    });
    setLiveScore({ prob, contributions, applicant });
  }

  async function handleSubmit(applicant) {
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicant, applicantId: applicant.id })
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      setResult({ decision: 'error', reason: err.message, prob: 0, contributions: [], rulesTriggered: [] });
    } finally {
      setLoading(false);
    }
  }

  function applyPreset(preset) {
    handleLivePreview(preset);
    // also submit preset quickly if desired:
    // handleSubmit(preset);
  }

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button onClick={() => applyPreset({ id: 'preset-good', income: 120000, age: 40, loan_amount: 10000, debt_ratio: 0.1, blacklisted: false, region: 'RegionA' })}
            className="px-3 py-1 bg-green-500 text-white rounded">Preset Good</button>
          <button onClick={() => applyPreset({ id: 'preset-border', income: 50000, age: 30, loan_amount: 30000, debt_ratio: 0.4, blacklisted: false, region: 'RegionB' })}
            className="px-3 py-1 bg-yellow-500 text-white rounded">Preset Borderline</button>
          <button onClick={() => applyPreset({ id: 'preset-risk', income: 20000, age: 22, loan_amount: 250000, debt_ratio: 0.9, blacklisted: true, region: 'RegionX' })}
            className="px-3 py-1 bg-red-600 text-white rounded">Preset Risky</button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Decline threshold</div>
          <input type="range" min="0" max="0.5" step="0.01" value={thresholds.decline}
            onChange={e => setThresholds(t => ({ ...t, decline: Number(e.target.value) }))}
            className="w-36" />
          <div className="text-sm w-12 text-right">{thresholds.decline.toFixed(2)}</div>

          <div className="text-sm text-gray-600">Review threshold</div>
          <input type="range" min="0.5" max="1" step="0.01" value={thresholds.review}
            onChange={e => setThresholds(t => ({ ...t, review: Number(e.target.value) }))}
            className="w-36" />
          <div className="text-sm w-12 text-right">{thresholds.review.toFixed(2)}</div>
        </div>
      </div>

      <ApplicationForm onSubmit={handleSubmit} onLiveChange={handleLivePreview} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium">Live model preview</div>
          {liveScore ? (
            <DecisionCard result={{
              decision: liveScore.prob < thresholds.decline ? 'decline' : (liveScore.prob < thresholds.review ? 'manual_review' : 'approve'),
              reason: 'Live preview (client)',
              prob: liveScore.prob,
              contributions: liveScore.contributions,
              rulesTriggered: []
            }} />
          ) : <div className="text-sm text-gray-500">Adjust form to see live score</div>}
        </div>

        <div>
          <div className="text-sm font-medium">Last server decision</div>
          {loading && <div className="text-sm text-gray-600">Submitting…</div>}
          {result && <DecisionCard result={result} />}
          {!result && !loading && <div className="text-sm text-gray-500">No server decision yet</div>}
        </div>
      </div>
    </div>
  );
}
