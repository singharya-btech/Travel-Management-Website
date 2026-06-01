import { useState, useEffect } from "react";
import PackageCard from "../components/PackageCard";
import Footer      from "../components/Footer";
import { API }     from "../api";
import "../assets/css/packages.css";

const CATEGORIES = ["All", "Beach", "Heritage", "Spiritual", "Nature"];

export default function Packages() {
  const [packages, setPackages]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    const url = activeCategory === "All"
      ? `${API}/packages`
      : `${API}/packages?category=${activeCategory}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const mapped = data.map((p) => ({
          id:         p._id,
          title:      p.title,
          duration:   p.duration,
          price:      p.price,
          badge:      p.badge  || "New",
          category:   p.category,
          image:      p.image  || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
          highlights: p.highlights || [],
        }));
        setPackages(mapped);
      })
      .catch(() => setError("Could not load packages. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <>
      <div className="page-hero">
        <img
          className="page-hero__bg"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Shore_Temple_2.jpg/1200px-Shore_Temple_2.jpg"
          alt="Chennai packages"
        />
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <span className="page-hero__eyebrow">Travel Packages</span>
          <h1 className="page-hero__title">Find Your Journey</h1>
        </div>
      </div>

      <div className="filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? "filter-btn--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <section className="section" style={{ paddingTop: "52px" }}>
        <div className="section-inner">
          {loading && <p style={{ color: "var(--gray)" }}>Loading packages…</p>}
          {error   && <p style={{ color: "#e24b4a" }}>{error}</p>}
          {!loading && !error && packages.length === 0 && (
            <p style={{ color: "var(--gray)" }}>
              No packages found for this category. Add packages via Admin Dashboard.
            </p>
          )}
          {!loading && packages.length > 0 && (
            <div className="pkg-grid">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
