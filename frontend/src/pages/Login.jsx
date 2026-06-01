import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../api";
import "../assets/css/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode]         = useState("login"); // "login" | "signup"
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const [loginData, setLoginData]   = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  /* ─── Login ─────────────────────────────────────────────── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!loginData.email || !loginData.password) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: loginData.email, password: loginData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      login(data.token, { id: data.user.id, name: data.user.name, isHost: data.user.isHost });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Signup ─────────────────────────────────────────────── */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:     signupData.name,
          email:    signupData.email,
          password: signupData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setSuccess("Account created! Redirecting…");
      // Auto-login after register
      const loginRes = await fetch(`${API}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: signupData.email, password: signupData.password }),
      });
      const loginData2 = await loginRes.json();
      if (loginRes.ok) {
        login(loginData2.token, { id: loginData2.user.id, name: loginData2.user.name, isHost: loginData2.user.isHost });
        setTimeout(() => navigate("/"), 800);
      } else {
        setTimeout(() => { setMode("login"); setSuccess(""); }, 1200);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__bg" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-card__logo">
          Travel<span>Buddy</span>
        </div>
        <p className="login-card__sub">
          {mode === "login" ? "Sign in to continue your journey" : "Create your free account"}
        </p>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${mode === "login" ? "login-tab--active" : ""}`}
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
          >
            Login
          </button>
          <button
            className={`login-tab ${mode === "signup" ? "login-tab--active" : ""}`}
            onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
          >
            Sign Up
          </button>
        </div>

        {/* ── Login Form ── */}
        {mode === "login" && (
          <form onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                autoComplete="current-password"
              />
            </div>
            {error   && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        )}

        {/* ── Signup Form ── */}
        {mode === "signup" && (
          <form onSubmit={handleSignup} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                className="form-input"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                className="form-input"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                className="form-input"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                autoComplete="new-password"
              />
            </div>
            {error   && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>
        )}

        <div className="login-card__footer-text" style={{ marginTop: 16 }}>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
