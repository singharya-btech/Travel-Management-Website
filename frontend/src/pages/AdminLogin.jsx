import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/css/login.css";

/* ── Admin credentials stored here ──────────────────────────────
   Change ADMIN_EMAIL and ADMIN_PASSWORD to whatever you want.
   These are frontend-only credentials — no backend call needed.
   ─────────────────────────────────────────────────────────────── */
const ADMIN_EMAIL    = "admin@travelbuddy.com";
const ADMIN_PASSWORD = "Admin@123";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in both fields."); return; }
    setLoading(true);
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        sessionStorage.setItem("tb_admin", "true");
        navigate("/admin");
      } else {
        setError("Invalid admin credentials.");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-page__bg" />
      <div className="login-card">
        <div className="login-card__logo">Travel<span>Buddy</span></div>
        <p className="login-card__sub">Admin Panel — authorised access only</p>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, marginBottom: 28
        }}>
          <span style={{
            background: "rgba(201,168,76,0.15)", color: "var(--gold)",
            fontSize: 11, fontWeight: 700, letterSpacing: "1.5px",
            textTransform: "uppercase", padding: "4px 12px", borderRadius: 20,
            border: "1px solid rgba(201,168,76,0.25)"
          }}>🔒 Admin Access</span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              className="form-input"
              placeholder="admin@travelbuddy.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Verifying…" : "Enter Admin Panel →"}
          </button>
        </form>

        <div style={{
          marginTop: 16, padding: "12px 16px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)"
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: 1.7 }}>
            Default credentials:<br />
            Email: <span style={{ color: "rgba(255,255,255,0.6)" }}>admin@travelbuddy.com</span><br />
            Password: <span style={{ color: "rgba(255,255,255,0.6)" }}>Admin@123</span>
          </p>
        </div>

        <div className="login-card__footer-text" style={{ marginTop: 16 }}>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
