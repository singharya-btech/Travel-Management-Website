import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API, authHeaders } from "../api";
import "../assets/css/admin.css";

/* ─── Admin auth guard ──────────────────────────────────────── */
function useAdminGuard() {
  const navigate = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("tb_admin") !== "true") {
      navigate("/admin-login");
    }
  }, [navigate]);
}

/* ─── Static display data ───────────────────────────────────── */
const BOOKINGS = [
  { name: "Rohan Kumar",  destination: "Heritage Explorer",     amount: "₹14,999", status: "confirmed" },
  { name: "Meera Pillai", destination: "Beach & Culture Trail", amount: "₹8,499",  status: "pending"   },
  { name: "Arun Thakur",  destination: "Temple Circuit",        amount: "₹11,299", status: "confirmed" },
  { name: "Divya Sharma", destination: "Weekend Getaway",       amount: "₹5,999",  status: "cancelled" },
];

const USERS = [
  { id: 1, name: "Rohan Kumar",  email: "rohan@email.com",  phone: "+91 98765 43210", bookings: 3, joined: "Jan 2024" },
  { id: 2, name: "Meera Pillai", email: "meera@email.com",  phone: "+91 87654 32109", bookings: 1, joined: "Feb 2024" },
  { id: 3, name: "Arun Thakur",  email: "arun@email.com",   phone: "+91 76543 21098", bookings: 2, joined: "Mar 2024" },
  { id: 4, name: "Divya Sharma", email: "divya@email.com",  phone: "+91 65432 10987", bookings: 1, joined: "Apr 2024" },
];

const SIDEBAR_LINKS = [
  { id: "overview",       label: "Overview",          icon: "📊" },
  { id: "bookings",       label: "Bookings",          icon: "🗓️" },
  { id: "packages",       label: "Packages",          icon: "🗺️" },
  { id: "addpackage",     label: "Add Package",       icon: "➕" },
  { id: "destinations",   label: "Destinations",      icon: "📍" },
  { id: "adddestination", label: "Add Destination",   icon: "➕" },
  { id: "hotels",         label: "Hotels",            icon: "🏨" },
  { id: "addhotel",       label: "Add Hotel",         icon: "➕" },
  { id: "users",          label: "Users",             icon: "👥" },
];

const CATEGORY_STATS = [
  { label: "Beach Packages",    value: "38%" },
  { label: "Heritage Packages", value: "29%" },
  { label: "Spiritual Tours",   value: "20%" },
  { label: "Nature Packages",   value: "13%" },
];

/* ─── Shared helpers ────────────────────────────────────────── */
function StatusBadge({ status }) {
  return <span className={`status-badge status-badge--${status}`}>{status}</span>;
}

function EmptyMsg({ children }) {
  return <p style={{ color: "var(--gray)", fontSize: 14, padding: "8px 0" }}>{children}</p>;
}

function ErrMsg({ children }) {
  return <p style={{ color: "#e24b4a", fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "rgba(226,75,74,0.07)", borderRadius: 8, borderLeft: "3px solid #e24b4a" }}>{children}</p>;
}

/* ─── Overview ──────────────────────────────────────────────── */
function Overview({ pkgList, destList, hotelList }) {
  const stats = [
    { label: "Total Bookings", value: "1,248",        change: "+12% this month",  icon: "🗓️" },
    { label: "Revenue",        value: "₹48L",          change: "+8.5% this month", icon: "💰" },
    { label: "Active Users",   value: "3,820",         change: "+340 this week",   icon: "👥" },
    { label: "Packages",       value: pkgList.length,  change: `${pkgList.length} active`, icon: "🗺️" },
    { label: "Destinations",   value: destList.length, change: `${destList.length} listed`, icon: "📍" },
    { label: "Hotels",         value: hotelList.length,change: `${hotelList.length} listed`, icon: "🏨" },
  ];
  return (
    <>
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <span className="stat-card__icon">{s.icon}</span>
            <div className="stat-card__label">{s.label}</div>
            <div className="stat-card__value">{s.value}</div>
            <div className="stat-card__change">{s.change}</div>
          </div>
        ))}
      </div>
      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card__header"><span className="admin-card__title">Recent Bookings</span></div>
          <div className="admin-card__body">
            {BOOKINGS.map((b, i) => (
              <div key={i} className="booking-row">
                <div className="booking-row__avatar">{b.name[0]}</div>
                <div>
                  <div className="booking-row__name">{b.name}</div>
                  <div className="booking-row__dest">{b.destination}</div>
                </div>
                <div className="booking-row__amount">{b.amount}</div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card__header"><span className="admin-card__title">Category Breakdown</span></div>
          <div className="admin-card__body">
            {CATEGORY_STATS.map((s) => (
              <div key={s.label} className="progress-row">
                <div className="progress-row__labels"><span>{s.label}</span><strong>{s.value}</strong></div>
                <div className="progress-track"><div className="progress-fill" style={{ width: s.value }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Bookings ──────────────────────────────────────────────── */
function BookingsSection() {
  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <span className="admin-card__title">All Bookings</span>
        <span style={{ fontSize: 13, color: "var(--gray)" }}>{BOOKINGS.length} total</span>
      </div>
      <div className="admin-card__body">
        {BOOKINGS.map((b, i) => (
          <div key={i} className="booking-row">
            <div className="booking-row__avatar">{b.name[0]}</div>
            <div>
              <div className="booking-row__name">{b.name}</div>
              <div className="booking-row__dest">{b.destination}</div>
            </div>
            <div className="booking-row__amount">{b.amount}</div>
            <StatusBadge status={b.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Packages list ─────────────────────────────────────────── */
function PackagesSection({ pkgList, loading, onAddClick, onDelete }) {
  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <span className="admin-card__title">Manage Packages</span>
        <button className="btn-navy" onClick={onAddClick}>+ Add New</button>
      </div>
      <div className="admin-card__body">
        {loading ? <EmptyMsg>Loading packages…</EmptyMsg>
          : pkgList.length === 0 ? <EmptyMsg>No packages yet. Click "+ Add New" to create one.</EmptyMsg>
          : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Package</th><th>Category</th><th>Duration</th><th>Price</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {pkgList.map((p) => (
                    <tr key={p._id}>
                      <td><strong>{p.title}</strong></td>
                      <td>{p.category}</td>
                      <td>{p.duration}</td>
                      <td><strong>{p.price}</strong></td>
                      <td><StatusBadge status="confirmed" /></td>
                      <td>
                        <button style={{ background: "#e24b4a", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}
                          onClick={() => onDelete(p._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}

/* ─── Add Package ───────────────────────────────────────────── */
function AddPackageSection({ onSuccess, onCancel }) {
  const EMPTY = { title: "", duration: "", price: "", badge: "New", category: "Beach", image: "", highlights: "" };
  const [form, setForm] = useState(EMPTY);
  const [msg,  setMsg]  = useState("");
  const [saving, setSaving] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.duration) { setMsg("Title, duration and price are required."); return; }
    setSaving(true);
    try {
      const payload = { ...form, highlights: form.highlights ? form.highlights.split(",").map(h => h.trim()).filter(Boolean) : [] };
      const res = await fetch(`${API}/packages/add`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || "Failed to save."); return; }
      onSuccess(data.package);
    } catch { setMsg("Network error. Is the backend running?"); }
    finally { setSaving(false); }
  };

  return (
    <div className="admin-card">
      <div className="admin-card__header"><span className="admin-card__title">Add New Package</span></div>
      <div className="admin-card__body">
        {msg && <ErrMsg>{msg}</ErrMsg>}
        <form className="add-pkg-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field"><label>Package Title *</label><input name="title" placeholder="e.g. Coastal Heritage Tour" value={form.title} onChange={onChange} /></div>
          <div className="form-field"><label>Duration *</label><input name="duration" placeholder="e.g. 3 Days / 2 Nights" value={form.duration} onChange={onChange} /></div>
          <div className="form-field"><label>Price (per person) *</label><input name="price" placeholder="e.g. ₹9,999" value={form.price} onChange={onChange} /></div>
          <div className="form-field"><label>Category</label>
            <select name="category" value={form.category} onChange={onChange}>
              {["Beach", "Heritage", "Spiritual", "Nature", "Adventure"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-field"><label>Badge Label</label><input name="badge" placeholder="e.g. Bestseller" value={form.badge} onChange={onChange} /></div>
          <div className="form-field"><label>Image URL</label><input name="image" placeholder="https://..." value={form.image} onChange={onChange} /></div>
          <div className="form-field full-row"><label>Highlights (comma-separated)</label><input name="highlights" placeholder="e.g. Marina Beach, Kapaleeshwarar Temple" value={form.highlights} onChange={onChange} /></div>
          <div className="form-field full-row" style={{ flexDirection: "row", gap: 12, alignItems: "flex-end" }}>
            <button type="submit" className="submit-btn" disabled={saving}>{saving ? "Saving…" : "Add Package →"}</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Destinations list ─────────────────────────────────────── */
function DestinationsSection({ destList, loading, onAddClick, onDelete }) {
  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <span className="admin-card__title">Manage Destinations</span>
        <button className="btn-navy" onClick={onAddClick}>+ Add New</button>
      </div>
      <div className="admin-card__body">
        {loading ? <EmptyMsg>Loading destinations…</EmptyMsg>
          : destList.length === 0 ? <EmptyMsg>No destinations yet. Click "+ Add New" to create one.</EmptyMsg>
          : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Name</th><th>Country/Tag</th><th>Days</th><th>Price</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {destList.map((d) => (
                    <tr key={d._id}>
                      <td><strong>{d.destinationName}</strong></td>
                      <td>{d.country}</td>
                      <td>{d.days} day{d.days !== 1 ? "s" : ""}</td>
                      <td><strong>₹{Number(d.price).toLocaleString("en-IN")}</strong></td>
                      <td>
                        <button style={{ background: "#e24b4a", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}
                          onClick={() => onDelete(d._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}

/* ─── Add Destination ───────────────────────────────────────── */
function AddDestinationSection({ onSuccess, onCancel }) {
  const EMPTY = { destinationName: "", country: "India", description: "", price: "", days: "", image: "" };
  const [form, setForm] = useState(EMPTY);
  const [msg,  setMsg]  = useState("");
  const [saving, setSaving] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.destinationName || !form.description || !form.price || !form.days || !form.image) {
      setMsg("All fields are required."); return;
    }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), days: Number(form.days) };
      const res = await fetch(`${API}/destinations/add`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || "Failed to save."); return; }
      onSuccess(data.destination);
    } catch { setMsg("Network error. Is the backend running?"); }
    finally { setSaving(false); }
  };

  return (
    <div className="admin-card">
      <div className="admin-card__header"><span className="admin-card__title">Add New Destination</span></div>
      <div className="admin-card__body">
        {msg && <ErrMsg>{msg}</ErrMsg>}
        <form className="add-pkg-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field"><label>Destination Name *</label><input name="destinationName" placeholder="e.g. Marina Beach" value={form.destinationName} onChange={onChange} /></div>
          <div className="form-field"><label>Country / Tag *</label><input name="country" placeholder="e.g. India" value={form.country} onChange={onChange} /></div>
          <div className="form-field"><label>Price (₹) *</label><input name="price" type="number" placeholder="e.g. 500" value={form.price} onChange={onChange} /></div>
          <div className="form-field"><label>Days *</label><input name="days" type="number" placeholder="e.g. 1" value={form.days} onChange={onChange} /></div>
          <div className="form-field full-row"><label>Description *</label><textarea name="description" rows={3} style={{ resize: "vertical" }} placeholder="Short description of this destination…" value={form.description} onChange={onChange} /></div>
          <div className="form-field full-row"><label>Image URL *</label><input name="image" placeholder="https://..." value={form.image} onChange={onChange} /></div>
          <div className="form-field full-row" style={{ flexDirection: "row", gap: 12, alignItems: "flex-end" }}>
            <button type="submit" className="submit-btn" disabled={saving}>{saving ? "Saving…" : "Add Destination →"}</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Hotels list ───────────────────────────────────────────── */
function HotelsSection({ hotelList, loading, onAddClick, onDelete }) {
  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <span className="admin-card__title">Manage Hotels</span>
        <button className="btn-navy" onClick={onAddClick}>+ Add New</button>
      </div>
      <div className="admin-card__body">
        {loading ? <EmptyMsg>Loading hotels…</EmptyMsg>
          : hotelList.length === 0 ? <EmptyMsg>No hotels yet. Click "+ Add New" to create one.</EmptyMsg>
          : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Hotel</th><th>Location</th><th>Price/Night</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {hotelList.map((h) => (
                    <tr key={h._id}>
                      <td><strong>{h.title}</strong></td>
                      <td>{h.location}</td>
                      <td><strong>₹{Number(h.price).toLocaleString("en-IN")}</strong></td>
                      <td>
                        <button style={{ background: "#e24b4a", color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}
                          onClick={() => onDelete(h._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}

/* ─── Add Hotel ─────────────────────────────────────────────── */
function AddHotelSection({ onSuccess, onCancel }) {
  const EMPTY = { title: "", description: "", price: "", location: "", image: "" };
  const [form, setForm] = useState(EMPTY);
  const [msg,  setMsg]  = useState("");
  const [saving, setSaving] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.price) { setMsg("Title, location and price are required."); return; }
    setSaving(true);
    try {
      // image stored as array per schema
      const payload = { ...form, price: Number(form.price), image: form.image ? [form.image] : [] };
      const res = await fetch(`${API}/hotel-listings/add`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || data.message || "Failed to save."); return; }
      onSuccess(data);
    } catch { setMsg("Network error. Is the backend running?"); }
    finally { setSaving(false); }
  };

  return (
    <div className="admin-card">
      <div className="admin-card__header"><span className="admin-card__title">Add New Hotel</span></div>
      <div className="admin-card__body">
        {msg && <ErrMsg>{msg}</ErrMsg>}
        <form className="add-pkg-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field"><label>Hotel Name *</label><input name="title" placeholder="e.g. The Leela Palace" value={form.title} onChange={onChange} /></div>
          <div className="form-field"><label>Location *</label><input name="location" placeholder="e.g. Chennai, Tamil Nadu" value={form.location} onChange={onChange} /></div>
          <div className="form-field"><label>Price per Night (₹) *</label><input name="price" type="number" placeholder="e.g. 5000" value={form.price} onChange={onChange} /></div>
          <div className="form-field"><label>Image URL</label><input name="image" placeholder="https://..." value={form.image} onChange={onChange} /></div>
          <div className="form-field full-row"><label>Description</label><textarea name="description" rows={3} style={{ resize: "vertical" }} placeholder="Short description of the hotel…" value={form.description} onChange={onChange} /></div>
          <div className="form-field full-row" style={{ flexDirection: "row", gap: 12, alignItems: "flex-end" }}>
            <button type="submit" className="submit-btn" disabled={saving}>{saving ? "Saving…" : "Add Hotel →"}</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Users ─────────────────────────────────────────────────── */
function UsersSection() {
  return (
    <div className="admin-card">
      <div className="admin-card__header">
        <span className="admin-card__title">User Management</span>
        <span style={{ fontSize: 13, color: "var(--gray)" }}>{USERS.length} registered users</span>
      </div>
      <div className="table-wrap">
        <table className="data-table user-table">
          <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Bookings</th><th>Joined</th></tr></thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td><td><strong>{u.name}</strong></td><td>{u.email}</td>
                <td>{u.phone}</td>
                <td><span className="status-badge status-badge--confirmed">{u.bookings} trips</span></td>
                <td>{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main AdminDashboard ───────────────────────────────────── */
export default function AdminDashboard() {
  useAdminGuard();
  const navigate = useNavigate();

  const [section, setSection] = useState("overview");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pkgList,   setPkgList]   = useState([]);
  const [destList,  setDestList]  = useState([]);
  const [hotelList, setHotelList] = useState([]);

  const [pkgLoading,   setPkgLoading]   = useState(true);
  const [destLoading,  setDestLoading]  = useState(true);
  const [hotelLoading, setHotelLoading] = useState(true);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    if (!dropdownOpen) return;
    const close = () => setDropdownOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [dropdownOpen]);

  useEffect(() => {
    fetch(`${API}/packages`).then(r => r.json()).then(d => setPkgList(d)).catch(() => {}).finally(() => setPkgLoading(false));
    fetch(`${API}/destinations`).then(r => r.json()).then(d => setDestList(d)).catch(() => {}).finally(() => setDestLoading(false));
    fetch(`${API}/hotel-listings`).then(r => r.json()).then(d => setHotelList(d)).catch(() => {}).finally(() => setHotelLoading(false));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("tb_admin");
    navigate("/admin-login");
  };

  /* Delete helpers */
  const deleteItem = async (url, list, setList, id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await fetch(url, { method: "DELETE" });
      setList(list.filter(i => i._id !== id));
    } catch { alert("Delete failed. Is the backend running?"); }
  };

  const sectionTitle = SIDEBAR_LINKS.find(l => l.id === section)?.label ?? "Dashboard";

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar" style={{ overflowY: "auto" }}>
        <div className="sidebar__logo-wrap">
          <div className="sidebar__logo">Travel<span>Buddy</span></div>
          <div className="sidebar__badge">Admin Panel</div>
        </div>

        <div className="sidebar__section-label">Content</div>
        {SIDEBAR_LINKS.slice(0, 2).map(link => (
          <button key={link.id} className={`sidebar__link ${section === link.id ? "sidebar__link--active" : ""}`} onClick={() => setSection(link.id)}>
            <span className="sidebar__icon">{link.icon}</span>{link.label}
          </button>
        ))}

        <div className="sidebar__section-label">Packages</div>
        {SIDEBAR_LINKS.slice(2, 4).map(link => (
          <button key={link.id} className={`sidebar__link ${section === link.id ? "sidebar__link--active" : ""}`} onClick={() => setSection(link.id)}>
            <span className="sidebar__icon">{link.icon}</span>{link.label}
          </button>
        ))}

        <div className="sidebar__section-label">Destinations</div>
        {SIDEBAR_LINKS.slice(4, 6).map(link => (
          <button key={link.id} className={`sidebar__link ${section === link.id ? "sidebar__link--active" : ""}`} onClick={() => setSection(link.id)}>
            <span className="sidebar__icon">{link.icon}</span>{link.label}
          </button>
        ))}

        <div className="sidebar__section-label">Hotels</div>
        {SIDEBAR_LINKS.slice(6, 8).map(link => (
          <button key={link.id} className={`sidebar__link ${section === link.id ? "sidebar__link--active" : ""}`} onClick={() => setSection(link.id)}>
            <span className="sidebar__icon">{link.icon}</span>{link.label}
          </button>
        ))}

        <div className="sidebar__section-label">Users</div>
        {SIDEBAR_LINKS.slice(8).map(link => (
          <button key={link.id} className={`sidebar__link ${section === link.id ? "sidebar__link--active" : ""}`} onClick={() => setSection(link.id)}>
            <span className="sidebar__icon">{link.icon}</span>{link.label}
          </button>
        ))}

        <div className="sidebar__exit">
          <button className="sidebar__link" style={{ color: "rgba(255,180,180,0.7)" }} onClick={handleLogout}>
            🚪 Logout Admin
          </button>
          <button className="sidebar__link" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }} onClick={() => navigate("/")}>
            🏠 Back to Site
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">
        <div className="admin-topbar">
          <span className="admin-topbar__title">{sectionTitle}</span>
          <div
            className="admin-topbar__user"
            onClick={() => setDropdownOpen(prev => !prev)}
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            <span style={{ fontSize: 14, color: "var(--text-mid)" }}>Admin</span>
            <div className="admin-topbar__avatar" style={{ cursor: "pointer" }}>AD</div>

            {dropdownOpen && (
              <div className="topbar-dropdown" onClick={e => e.stopPropagation()}>
                <button className="topbar-dropdown__item" onClick={() => { setDropdownOpen(false); navigate("/"); }}>
                  🏠 Back to Site
                </button>
                <div className="topbar-dropdown__divider" />
                <button className="topbar-dropdown__item topbar-dropdown__item--danger" onClick={() => { setDropdownOpen(false); handleLogout(); }}>
                  🚪 Logout Admin
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="admin-content">
          {section === "overview"       && <Overview pkgList={pkgList} destList={destList} hotelList={hotelList} />}
          {section === "bookings"       && <BookingsSection />}
          {section === "packages"       && <PackagesSection pkgList={pkgList} loading={pkgLoading} onAddClick={() => setSection("addpackage")} onDelete={(id) => deleteItem(`${API}/packages/delete/${id}`, pkgList, setPkgList, id)} />}
          {section === "addpackage"     && <AddPackageSection onSuccess={(p) => { setPkgList(prev => [p, ...prev]); setSection("packages"); }} onCancel={() => setSection("packages")} />}
          {section === "destinations"   && <DestinationsSection destList={destList} loading={destLoading} onAddClick={() => setSection("adddestination")} onDelete={(id) => deleteItem(`${API}/destinations/delete/${id}`, destList, setDestList, id)} />}
          {section === "adddestination" && <AddDestinationSection onSuccess={(d) => { setDestList(prev => [d, ...prev]); setSection("destinations"); }} onCancel={() => setSection("destinations")} />}
          {section === "hotels"         && <HotelsSection hotelList={hotelList} loading={hotelLoading} onAddClick={() => setSection("addhotel")} onDelete={(id) => deleteItem(`${API}/hotel-listings/delete/${id}`, hotelList, setHotelList, id)} />}
          {section === "addhotel"       && <AddHotelSection onSuccess={(h) => { setHotelList(prev => [h, ...prev]); setSection("hotels"); }} onCancel={() => setSection("hotels")} />}
          {section === "users"          && <UsersSection />}
        </div>
      </main>
    </div>
  );
}
