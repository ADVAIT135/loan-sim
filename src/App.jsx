import React from 'react';
import Submit from './pages/Submit';
import Reviewer from './pages/Reviewer';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-4 shadow-md">
  <div className="container-md mx-auto px-4 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18M3 6h18M3 18h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div>
        <div className="text-lg font-semibold">Loan Decision Simulator</div>
        <div className="text-xs text-white/80">Hybrid rules + explainable ML</div>
      </div>
    </div>

    <nav className="flex gap-3">
      <a href="#submit" className="text-sm hover:underline">Submit</a>
      <a href="#review" className="text-sm hover:underline">Reviewer</a>
    </nav>
  </div>
</header>


      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <section id="submit">
          <h2 className="text-lg font-medium">Submit Application</h2>
          <Submit />
        </section>

        <section id="review">
          <h2 className="text-lg font-medium">Reviewer / Audit Logs</h2>
          <Reviewer />
        </section>
      </main>
    </div>
  );
}
