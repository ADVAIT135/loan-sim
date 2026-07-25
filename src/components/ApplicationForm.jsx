import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function ApplicationForm({ onSubmit }) {
  const [income, setIncome] = useState(50000);
  const [age, setAge] = useState(30);
  const [loanAmount, setLoanAmount] = useState(10000);
  const [debtRatio, setDebtRatio] = useState(0.2);
  const [blacklisted, setBlacklisted] = useState(false);
  const [region, setRegion] = useState('RegionA');

  function submit(e) {
    e.preventDefault();
    const applicant = {
      id: uuidv4(),
      income: Number(income),
      age: Number(age),
      loan_amount: Number(loanAmount),
      debt_ratio: Number(debtRatio),
      blacklisted,
      region
    };
    onSubmit(applicant);
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-2 gap-3">
        <label>
          Income
          <input type="number" value={income} onChange={e=>setIncome(e.target.value)} className="w-full" />
        </label>
        <label>
          Age
          <input type="number" value={age} onChange={e=>setAge(e.target.value)} className="w-full" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label>
          Loan Amount
          <input type="number" value={loanAmount} onChange={e=>setLoanAmount(e.target.value)} className="w-full" />
        </label>
        <label>
          Debt Ratio
          <input type="number" step="0.01" value={debtRatio} onChange={e=>setDebtRatio(e.target.value)} className="w-full" />
        </label>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={blacklisted} onChange={e=>setBlacklisted(e.target.checked)} />
          Blacklisted
        </label>

        <label>
          Region
          <select value={region} onChange={e=>setRegion(e.target.value)} className="ml-2">
            <option>RegionA</option>
            <option>RegionB</option>
            <option>RegionX</option>
          </select>
        </label>
      </div>

      <div>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Submit Application</button>
      </div>
    </form>
  );
}
