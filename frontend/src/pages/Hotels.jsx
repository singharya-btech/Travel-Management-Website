import { useState, useEffect } from "react";
import HotelCard from "../components/HotelCard";
import Footer    from "../components/Footer";
import { API }   from "../api";
import "../assets/css/hotels.css";

export default function Hotels() {
  const [hotels, setHotels]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    fetch(`${API}/hotel-listings`)
      .then((r) => r.json())
      .then((data) => {
        const mapped = data.map((h) => ({
          id:            h._id,
          name:          h.title,
          tag:           "Featured",
          description:   h.description,
          location:      h.location,
          pricePerNight: `₹${h.price?.toLocaleString("en-IN") ?? "—"}`,
          rating:        4.5,
          reviews:       0,
          image:         Array.isArray(h.image) ? h.image[0] : h.image || "",
        }));
        setHotels(mapped);
      })
      .catch(() => setError("Could not load hotels. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-hero">
        <img
          className="page-hero__bg"
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80"
          alt="Luxury hotels Chennai"
        />
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <span className="page-hero__eyebrow">Accommodation</span>
          <h1 className="page-hero__title">Luxury Hotels</h1>
        </div>
      </div>

      <section className="section hotels-section">
        <div className="section-inner">
          {loading && <p style={{ color: "var(--gray)" }}>Loading hotels…</p>}
          {error   && <p style={{ color: "#e24b4a" }}>{error}</p>}
          {!loading && !error && hotels.length === 0 && (
            <p style={{ color: "var(--gray)" }}>No hotels yet. Add listings via the API.</p>
          )}
          {!loading && hotels.length > 0 && (
            <div className="hotel-grid">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
