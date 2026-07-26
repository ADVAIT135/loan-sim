import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function ApplicationForm({ onSubmit, onLiveChange }) {
  const [income, setIncome] = useState(50000);
  const [age, setAge] = useState(30);
  const [loanAmount, setLoanAmount] = useState(10000);
  const [debtRatio, setDebtRatio] = useState(0.2);
  const [blacklisted, setBlacklisted] = useState(false);
  const [region, setRegion] = useState('RegionA');

  useEffect(() => {
    const applicant = { id: uuidv4(), income: Number(income), age: Number(age), loan_amount: Number(loanAmount), debt_ratio: Number(debtRatio), blacklisted, region };
    if (onLiveChange) onLiveChange(applicant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [income, age, loanAmount, debtRatio, blacklisted, region]);

  function submit(e) {
    e.preventDefault();
    const applicant = { id: uuidv4(), income: Number(income), age: Number(age), loan_amount: Number(loanAmount), debt_ratio: Number(debtRatio), blacklisted, region };
    onSubmit(applicant);
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col">
          <span className="text-xs text-gray-600 dark:text-gray-300">Income</span>
          <input type="number" value={income} onChange={e => setIncome(e.target.value)} className="w-full p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span className="text-xs text-gray-600 dark:text-gray-300">Age</span>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full p-2 border rounded" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col">
          <span className="text-xs text-gray-600 dark:text-gray-300">Loan Amount</span>
          <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)} className="w-full p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          <span className="text-xs text-gray-600 dark:text-gray-300">Debt Ratio</span>
          <input type="range" min="0" max="1" step="0.01" value={debtRatio} onChange={e => setDebtRatio(e.target.value)} className="w-full" />
          <div className="text-xs text-gray-500 dark:text-gray-300">{Number(debtRatio).toFixed(2)}</div>
        </label>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={blacklisted} onChange={e => setBlacklisted(e.target.checked)} />
          <span className="text-sm">Blacklisted</span>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-sm">Region</span>
          <select value={region} onChange={e => setRegion(e.target.value)} className="ml-2 p-1 border rounded">
            <option>RegionA</option>
            <option>RegionB</option>
            <option>RegionX</option>
          </select>
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" className="px-4 py-2 bg-green-600 text-white dark:bg-green-500 rounded">Submit Application</button>
        <button type="button" onClick={() => {
          setIncome(50000); setAge(30); setLoanAmount(10000); setDebtRatio(0.2); setBlacklisted(false); setRegion('RegionA');
        }} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded">Reset</button>
      </div>
    </form>
  );
}
