// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    industry: '',
    size: '',
    goals: '',
    struggleArea: '',
    details: '',
  });

  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAdvice('');
    setError('');

    try {
      const res = await fetch('/api/getAdvice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setAdvice(data.advice);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Error connecting to the server.');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Business Consulting Assistant</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        {['industry', 'size', 'goals', 'struggleArea', 'details'].map((field) => (
          <div key={field} style={{ marginBottom: '1rem' }}>
            <label>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
              />
            </label>
          </div>
        ))}
        <button type="submit" disabled={loading} style={{ padding: '0.7rem 1.5rem' }}>
          {loading ? 'Getting advice...' : 'Submit'}
        </button>
      </form>

      {advice && (
        <div style={{ marginTop: '2rem', background: '#f0f0f0', padding: '1rem' }}>
          <h2>AI Advice:</h2>
          <p>{advice}</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '2rem', color: 'red' }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
