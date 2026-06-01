import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API, authHeaders } from "../api";
import "../assets/css/profile.css";

export default function Profile() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile]         = useState(null);
  const [wishlist, setWishlist]        = useState([]);
  const [activeTab, setActiveTab]      = useState("info");
  const [editing, setEditing]          = useState(false);
  const [saving, setSaving]            = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [msg, setMsg]                  = useState({ type: "", text: "" });

  const [form, setForm] = useState({ bio: "", phone: "", location: "", dob: "" });

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  // Load profile
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(`${API}/profile`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setForm({
          bio:      data.bio      || "",
          phone:    data.phone    || "",
          location: data.location || "",
          dob:      data.dob      || "",
        });
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, [isLoggedIn]);

  // Load wishlist
  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(`${API}/wishlist`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((data) => setWishlist(Array.isArray(data) ? data : []))
      .catch(() => setWishlist([]))
      .finally(() => setWishlistLoading(false));
  }, [isLoggedIn]);

  const handleSave = async () => {
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await fetch(`${API}/profile`, {
        method:  "PUT",
        headers: authHeaders(),
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProfile(data);
      setEditing(false);
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMsg({ type: "error", text: err.message || "Failed to save." });
    } finally {
      setSaving(false);
    }
  };

  const removeWishlist = async (itemId) => {
    try {
      await fetch(`${API}/wishlist/${itemId}`, { method: "DELETE", headers: authHeaders() });
      setWishlist((w) => w.filter((i) => i._id !== itemId));
    } catch {}
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "TB";

  if (!isLoggedIn) return null;

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-hero">
        <div className="profile-hero__bg" />
        <div className="profile-hero__content">
          <div className="profile-avatar">{initials}</div>
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-meta">
            {profile?.location ? `📍 ${profile.location}` : "Explore India with TravelBuddy"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "info" ? "profile-tab--active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          My Info
        </button>
        <button
          className={`profile-tab ${activeTab === "wishlist" ? "profile-tab--active" : ""}`}
          onClick={() => setActiveTab("wishlist")}
        >
          ❤️ Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
        </button>
      </div>

      <div className="profile-body">
        {/* ── Info Tab ── */}
        {activeTab === "info" && (
          <div className="profile-section">
            {msg.text && (
              <p className={`profile-msg profile-msg--${msg.type}`}>{msg.text}</p>
            )}

            <div className="profile-info-card">
              <div className="profile-info-row">
                <span className="profile-info-label">Name</span>
                <span className="profile-info-value">{user?.name}</span>
              </div>

              {profileLoading ? (
                <p className="profile-loading">Loading profile…</p>
              ) : editing ? (
                <>
                  <div className="profile-info-row profile-info-row--edit">
                    <label className="profile-info-label">Bio</label>
                    <textarea
                      className="profile-input profile-textarea"
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Tell us about yourself…"
                    />
                  </div>
                  <div className="profile-info-row profile-info-row--edit">
                    <label className="profile-info-label">Phone</label>
                    <input
                      className="profile-input"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="profile-info-row profile-info-row--edit">
                    <label className="profile-info-label">Location</label>
                    <input
                      className="profile-input"
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="City, State"
                    />
                  </div>
                  <div className="profile-info-row profile-info-row--edit">
                    <label className="profile-info-label">Date of Birth</label>
                    <input
                      className="profile-input"
                      type="date"
                      value={form.dob}
                      onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    />
                  </div>
                  <div className="profile-actions">
                    <button className="profile-btn profile-btn--save" onClick={handleSave} disabled={saving}>
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                    <button className="profile-btn profile-btn--cancel" onClick={() => { setEditing(false); setMsg({ type: "", text: "" }); }}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {profile?.bio && (
                    <div className="profile-info-row">
                      <span className="profile-info-label">Bio</span>
                      <span className="profile-info-value">{profile.bio}</span>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="profile-info-row">
                      <span className="profile-info-label">Phone</span>
                      <span className="profile-info-value">{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="profile-info-row">
                      <span className="profile-info-label">Location</span>
                      <span className="profile-info-value">{profile.location}</span>
                    </div>
                  )}
                  {profile?.dob && (
                    <div className="profile-info-row">
                      <span className="profile-info-label">Date of Birth</span>
                      <span className="profile-info-value">{profile.dob}</span>
                    </div>
                  )}
                  <div className="profile-actions">
                    <button className="profile-btn profile-btn--edit" onClick={() => { setEditing(true); setMsg({ type: "", text: "" }); }}>
                      ✏️ Edit Profile
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Wishlist Tab ── */}
        {activeTab === "wishlist" && (
          <div className="profile-section">
            {wishlistLoading ? (
              <p className="profile-loading">Loading wishlist…</p>
            ) : wishlist.length === 0 ? (
              <div className="profile-empty">
                <p className="profile-empty__icon">❤️</p>
                <h3>Your wishlist is empty</h3>
                <p>Browse destinations, hotels, and packages and tap the heart icon to save them here.</p>
                <button className="profile-btn profile-btn--edit" onClick={() => navigate("/destinations")}>
                  Explore Destinations
                </button>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlist.map((item) => (
                  <div key={item._id} className="wishlist-card">
                    {item.image && (
                      <img src={Array.isArray(item.image) ? item.image[0] : item.image} alt={item.title || item.destinationName} className="wishlist-card__img" />
                    )}
                    <div className="wishlist-card__body">
                      <span className="wishlist-card__tag">{item.type}</span>
                      <h4 className="wishlist-card__title">{item.title || item.destinationName || item.name}</h4>
                      {item.location && <p className="wishlist-card__loc">📍 {item.location}</p>}
                      {item.price && <p className="wishlist-card__price">₹{item.price.toLocaleString()}</p>}
                      <button
                        className="wishlist-card__remove"
                        onClick={() => removeWishlist(item._id)}
                        aria-label="Remove from wishlist"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
