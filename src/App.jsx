import React from 'react';
import Submit from './pages/Submit';
import Reviewer from './pages/Reviewer';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">Loan Decision Simulator</h1>
          <nav className="space-x-4">
            <a href="#submit" className="text-sm">Submit</a>
            <a href="#review" className="text-sm">Reviewer</a>
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
