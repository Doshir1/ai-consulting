import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    industry: "",
    size: "",
    goals: "",
    struggleArea: "",
    details: "",
  });

  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setAdvice("");

    const response = await fetch("/api/getAdvice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setAdvice(data.advice);
    } else {
      setAdvice(data.error || "Error getting advice.");
    }

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1>AI Consulting Assistant</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <label>
          Industry:
          <input name="industry" value={formData.industry} onChange={handleChange} required />
        </label>

        <label>
          Size (employees):
          <input
            type="number"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
            min={1}
          />
        </label>

        <label>
          Goals:
          <textarea name="goals" value={formData.goals} onChange={handleChange} required />
        </label>

        <label>
          Struggling Area:
          <select name="struggleArea" value={formData.struggleArea} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="marketing">Marketing</option>
            <option value="operations">Operations</option>
            <option value="hiring">Hiring</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Details:
          <textarea name="details" value={formData.details} onChange={handleChange} required />
        </label>

        <button type="submit" disabled={loading}>{loading ? "Loading..." : "Get Advice"}</button>
      </form>

      {advice && (
        <section style={{ marginTop: "2rem", whiteSpace: "pre-wrap", background: "#f9f9f9", padding: "1rem", borderRadius: 6 }}>
          <h2>Your AI Advice:</h2>
          <p>{advice}</p>
        </section>
      )}
    </div>
  );
}

export default App;
