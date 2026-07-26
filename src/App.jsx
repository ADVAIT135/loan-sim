import React, { useEffect, useState } from 'react';
import Submit from './pages/Submit';
import Reviewer from './pages/Reviewer';

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-4 shadow-md">
  <div className="container-md mx-auto px-4 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div>
        <div className="text-lg font-semibold">Loan Decision Simulator</div>
        <div className="text-xs text-white/80">Hybrid rules + explainable ML</div>
      </div>
    </div>

    <nav className="flex gap-3 items-center">
      <a href="#submit" className="text-sm hover:underline">Submit</a>
      <a href="#review" className="text-sm hover:underline">Reviewer</a>
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="ml-2 p-2 rounded-md bg-white/20 hover:bg-white/30 text-white flex items-center"
      >
        {theme === 'dark' ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </button>
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
      
      <footer className="bg-white dark:bg-transparent border-t dark:border-gray-700 mt-12">
        <div className="max-w-4xl mx-auto p-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <div>
            Built by <a href="https://github.com/ADVAIT135" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">ADVAIT135 (ADVAIT GURUNATH CHAVAN)</a>
          </div>
          <div className="mt-2 sm:mt-0">
            Connect: <a href="https://www.linkedin.com/in/advait-chavan-69928b129/" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
