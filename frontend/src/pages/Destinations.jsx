import { useState, useEffect } from "react";
import DestinationCard from "../components/DestinationCard";
import Footer          from "../components/Footer";
import { API }         from "../api";
import "../assets/css/destinations.css";

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  useEffect(() => {
    fetch(`${API}/destinations`)
      .then((r) => r.json())
      .then((data) => {
        const mapped = data.map((d) => ({
          id:          d._id,
          name:        d.destinationName,
          tag:         d.country,
          description: d.description,
          image:       d.image,
          price:       d.price,
          days:        d.days,
        }));
        setDestinations(mapped);
      })
      .catch(() => setError("Could not load destinations. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-hero">
        <img
          className="page-hero__bg"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Marina_Beach_in_Chennai.jpg/1200px-Marina_Beach_in_Chennai.jpg"
          alt="Chennai destinations"
        />
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <span className="page-hero__eyebrow">Discover Chennai</span>
          <h1 className="page-hero__title">All Destinations</h1>
        </div>
      </div>

      <section className="section">
        <div className="section-inner">
          {loading && <p style={{ color: "var(--gray)" }}>Loading destinations…</p>}
          {error   && <p style={{ color: "#e24b4a" }}>{error}</p>}
          {!loading && !error && destinations.length === 0 && (
            <p style={{ color: "var(--gray)" }}>No destinations yet. Add some via Admin Dashboard.</p>
          )}
          {!loading && destinations.length > 0 && (
            <div className="dest-grid">
              {destinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
