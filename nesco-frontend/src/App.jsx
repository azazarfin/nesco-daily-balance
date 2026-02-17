import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';

function App() {
  // State for Low Balance Threshold (persisted in localStorage)
  const [threshold, setThreshold] = useState(() => {
    const saved = localStorage.getItem('nescoThreshold');
    return saved ? Number(saved) : 200;
  });

  // Save threshold to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nescoThreshold', threshold);
  }, [threshold]);

  // Data State
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/balance`);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the server. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    setScraping(true);
    try {
      const response = await axios.get(`${API_URL}/api/scrape-now`);
      if (response.data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('Scrape request failed.');
    } finally {
      setScraping(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <Header onRefresh={handleScrape} isScraping={scraping} />

      <main className="container mx-auto max-w-screen-xl px-4">
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                data={data}
                loading={loading}
                error={error}
                onRetry={fetchData}
                isScraping={scraping}
                threshold={threshold}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <Settings
                threshold={threshold}
                setThreshold={setThreshold}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
