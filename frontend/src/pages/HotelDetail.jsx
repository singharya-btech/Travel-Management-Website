import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, authHeaders } from "../api";
import { useAuth } from "../context/AuthContext";

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [hotel,   setHotel]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [wished,  setWished]  = useState(false);
  const [wishing, setWishing] = useState(false);
  const [wishMsg, setWishMsg] = useState("");

  /* Load hotel */
  useEffect(() => {
    fetch(`${API}/hotel-listings/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data._id) setHotel(data);
        else setError("Hotel not found.");
      })
      .catch(() => setError("Could not load hotel. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [id]);

  /* Check wishlist */
  useEffect(() => {
    if (!isLoggedIn || !id) return;
    fetch(`${API}/wishlist/check/${id}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setWished(d.inWishlist))
      .catch(() => {});
  }, [id, isLoggedIn]);

  const toggleWishlist = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    setWishing(true);
    setWishMsg("");
    try {
      if (wished) {
        await fetch(`${API}/wishlist/ref/${id}`, { method: "DELETE", headers: authHeaders() });
        setWished(false);
        setWishMsg("Removed from wishlist");
      } else {
        const imgArr = Array.isArray(hotel.image) ? hotel.image : [hotel.image].filter(Boolean);
        const res = await fetch(`${API}/wishlist`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            refId:    hotel._id,
            type:     "hotel",
            title:    hotel.title,
            image:    imgArr,
            location: hotel.location,
            price:    hotel.price,
          }),
        });
        if (res.status === 409) { setWished(true); setWishMsg("Already in wishlist"); }
        else { setWished(true); setWishMsg("Added to wishlist ❤️"); }
      }
    } catch { setWishMsg("Something went wrong"); }
    finally { setWishing(false); setTimeout(() => setWishMsg(""), 2500); }
  };

  if (loading) return <div style={styles.center}><p style={styles.loadText}>Loading…</p></div>;
  if (error)   return <div style={styles.center}><p style={styles.errText}>{error}</p><button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button></div>;
  if (!hotel)  return null;

  const heroImg = Array.isArray(hotel.image) ? hotel.image[0] : hotel.image;
  const allImgs = Array.isArray(hotel.image) ? hotel.image : [hotel.image].filter(Boolean);

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        {heroImg
          ? <img src={heroImg} alt={hotel.title} style={styles.heroImg} />
          : <div style={{ ...styles.heroImg, background: "#1a2d4a" }} />
        }
        <div style={styles.heroOverlay} />
        <button style={styles.backBtnOverlay} onClick={() => navigate(-1)}>← Back</button>
        <div style={styles.heroContent}>
          <span style={styles.tag}>Hotel</span>
          <h1 style={styles.heroTitle}>{hotel.title}</h1>
          {hotel.location && (
            <div style={styles.heroMeta}>
              <span>📍 {hotel.location}</span>
              <span style={styles.dot}>·</span>
              <span>💰 ₹{Number(hotel.price).toLocaleString("en-IN")} / night</span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {/* Extra images */}
        {allImgs.length > 1 && (
          <div style={styles.imgGallery}>
            {allImgs.slice(1).map((img, i) => (
              <img key={i} src={img} alt={hotel.title} style={styles.galleryImg} />
            ))}
          </div>
        )}

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>About this Hotel</h2>
          <p style={styles.desc}>{hotel.description || "A wonderful place to stay in " + hotel.location}</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Property Details</h2>
          <div style={styles.detailGrid}>
            <div style={styles.detailItem}><span style={styles.detailIcon}>📍</span><div><div style={styles.detailLabel}>Location</div><div style={styles.detailValue}>{hotel.location || "—"}</div></div></div>
            <div style={styles.detailItem}><span style={styles.detailIcon}>💰</span><div><div style={styles.detailLabel}>Price per Night</div><div style={styles.detailValue}>₹{Number(hotel.price).toLocaleString("en-IN")}</div></div></div>
            <div style={styles.detailItem}><span style={styles.detailIcon}>⭐</span><div><div style={styles.detailLabel}>Rating</div><div style={styles.detailValue}>4.5 / 5</div></div></div>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            style={{ ...styles.wishBtn, ...(wished ? styles.wishBtnActive : {}) }}
            onClick={toggleWishlist}
            disabled={wishing}
          >
            {wishing ? "…" : wished ? "❤️ In Wishlist" : "🤍 Add to Wishlist"}
          </button>
          {wishMsg && <span style={styles.wishMsg}>{wishMsg}</span>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:           { minHeight: "100vh", background: "#f7f8fc" },
  center:         { minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 },
  loadText:       { fontSize: 16, color: "#7a8499" },
  errText:        { fontSize: 15, color: "#e24b4a" },
  hero:           { position: "relative", height: "70vh", minHeight: 400, overflow: "hidden" },
  heroImg:        { width: "100%", height: "100%", objectFit: "cover" },
  heroOverlay:    { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.25) 60%)" },
  backBtnOverlay: { position: "absolute", top: 24, left: 24, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "8px 18px", borderRadius: 28, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  heroContent:    { position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 720, padding: "0 24px", textAlign: "center" },
  tag:            { display: "inline-block", background: "#c9a84c", color: "#0a1628", fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "4px 14px", borderRadius: 20, marginBottom: 12 },
  heroTitle:      { fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: "#fff", fontFamily: "Georgia, serif", marginBottom: 16, lineHeight: 1.2 },
  heroMeta:       { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 15, color: "rgba(255,255,255,0.8)" },
  dot:            { opacity: 0.4 },
  body:           { maxWidth: 720, margin: "0 auto", padding: "48px 24px" },
  imgGallery:     { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 20 },
  galleryImg:     { width: "100%", height: 160, objectFit: "cover", borderRadius: 12 },
  card:           { background: "#fff", borderRadius: 16, padding: "28px 32px", marginBottom: 20, boxShadow: "0 2px 16px rgba(10,22,40,0.07)" },
  sectionTitle:   { fontSize: 20, fontWeight: 700, color: "#0a1628", marginBottom: 14, fontFamily: "Georgia, serif" },
  desc:           { fontSize: 15, color: "#4a5568", lineHeight: 1.8 },
  detailGrid:     { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 },
  detailItem:     { display: "flex", alignItems: "flex-start", gap: 12 },
  detailIcon:     { fontSize: 22, marginTop: 2 },
  detailLabel:    { fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#9aa3b2", marginBottom: 3 },
  detailValue:    { fontSize: 15, fontWeight: 600, color: "#0a1628" },
  actions:        { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  wishBtn:        { padding: "13px 28px", borderRadius: 30, border: "1.5px solid #c9a84c", background: "transparent", color: "#0a1628", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" },
  wishBtnActive:  { background: "#fff0d6", borderColor: "#c9a84c" },
  wishMsg:        { fontSize: 13, color: "#1a7a42", fontWeight: 500 },
  backBtn:        { padding: "10px 22px", borderRadius: 28, border: "1.5px solid #0a1628", background: "transparent", color: "#0a1628", fontSize: 14, fontWeight: 600, cursor: "pointer" },
};
