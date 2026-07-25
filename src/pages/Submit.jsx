import React, { useState } from 'react';
import ApplicationForm from '../components/ApplicationForm';
import DecisionCard from '../components/DecisionCard';

export default function Submit() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(applicant) {
    setLoading(true);
    const res = await fetch('/.netlify/functions/decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicant, applicantId: applicant.id })
    });
    const json = await res.json();
    setResult(json);
    setLoading(false);
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <ApplicationForm onSubmit={handleSubmit} />
      {loading && <div className="mt-4">Evaluating...</div>}
      {result && <DecisionCard result={result} />}
    </div>
  );
}
