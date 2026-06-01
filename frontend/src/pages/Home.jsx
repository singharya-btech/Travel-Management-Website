import { useState, useEffect } from "react";
import { useNavigate }    from "react-router-dom";
import HeroSection        from "../components/HeroSection";
import DestinationCard    from "../components/DestinationCard";
import PackageCard        from "../components/PackageCard";
import HotelCard          from "../components/HotelCard";
import Footer             from "../components/Footer";
import { API }            from "../api";

import "../assets/css/home.css";
import "../assets/css/destinations.css";
import "../assets/css/packages.css";
import "../assets/css/hotels.css";

/* ── Static data that has no backend model yet ── */
const TRANSPORT = [
  { icon: "🚕", name: "Airport Transfers",    description: "Reliable, punctual taxi and cab services from Chennai International Airport to your hotel." },
  { icon: "🚌", name: "City Bus Tours",        description: "Hop-on hop-off buses covering all major landmarks across Chennai." },
  { icon: "🚂", name: "Train Connections",     description: "Easy rail links to nearby heritage towns like Kanchipuram and Mahabalipuram." },
  { icon: "🛺", name: "Auto Rickshaw Rides",   description: "The authentic Chennai way to get around neighbourhoods and explore local markets." },
];

const TESTIMONIALS = [
  { id: 1, stars: 5, text: "TravelBuddy made my Chennai trip absolutely unforgettable! The Heritage Explorer package was perfectly curated.", name: "Priya Sharma",    location: "Mumbai" },
  { id: 2, stars: 5, text: "Best travel experience I've ever had. The hotel recommendations were spot-on and the local guides were amazing.", name: "Rajesh Nair",     location: "Bangalore" },
  { id: 3, stars: 5, text: "I never thought Chennai could be so beautiful until TravelBuddy showed me its hidden gems.", name: "Ananya Krishnan", location: "Delhi" },
];

export default function Home() {
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [packages,     setPackages]     = useState([]);
  const [hotels,       setHotels]       = useState([]);

  useEffect(() => {
    /* Destinations */
    fetch(`${API}/destinations`)
      .then((r) => r.json())
      .then((data) =>
        setDestinations(
          data.slice(0, 4).map((d) => ({
            id: d._id, name: d.destinationName, tag: d.country,
            description: d.description, image: d.image,
          }))
        )
      )
      .catch(() => {});

    /* Packages */
    fetch(`${API}/packages`)
      .then((r) => r.json())
      .then((data) =>
        setPackages(
          data.slice(0, 3).map((p) => ({
            id: p._id, title: p.title, duration: p.duration,
            price: p.price, badge: p.badge || "New", category: p.category,
            image: p.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
            highlights: p.highlights || [],
          }))
        )
      )
      .catch(() => {});

    /* Hotels */
    fetch(`${API}/hotel-listings`)
      .then((r) => r.json())
      .then((data) =>
        setHotels(
          data.map((h) => ({
            id: h._id, name: h.title, tag: "Featured",
            location: h.location,
            pricePerNight: `₹${h.price?.toLocaleString("en-IN") ?? "—"}`,
            rating: 4.5, reviews: 0,
            image: Array.isArray(h.image) ? h.image[0] : h.image || "",
          }))
        )
      )
      .catch(() => {});
  }, []);

  return (
    <>
      <HeroSection />

      {/* Popular Destinations */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header-row">
            <div>
              <span className="section-label">Explore Chennai</span>
              <h2 className="section-title">Popular Destinations</h2>
              <p className="section-subtitle">
                From golden shores to ancient temples — Chennai's wonders await your discovery.
              </p>
            </div>
            <button className="btn-ghost" onClick={() => navigate("/destinations")}>View All →</button>
          </div>

          {destinations.length === 0 ? (
            <p style={{ color: "var(--gray)" }}>No destinations yet — add some via Admin Dashboard.</p>
          ) : (
            <div className="dest-grid">
              {destinations.map((dest) => <DestinationCard key={dest.id} destination={dest} />)}
            </div>
          )}
        </div>
      </section>

      {/* Featured Packages */}
      <section className="section" style={{ background: "var(--white)" }}>
        <div className="section-inner">
          <div className="section-header-row">
            <div>
              <span className="section-label">Curated For You</span>
              <h2 className="section-title">Featured Packages</h2>
              <p className="section-subtitle">
                Thoughtfully designed itineraries that combine the best of Chennai's experiences.
              </p>
            </div>
            <button className="btn-ghost" onClick={() => navigate("/packages")}>View All →</button>
          </div>

          {packages.length === 0 ? (
            <p style={{ color: "var(--gray)" }}>No packages yet — add some via Admin Dashboard.</p>
          ) : (
            <div className="pkg-grid">
              {packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          )}
        </div>
      </section>

      {/* Recommended Hotels */}
      <section className="section hotels-section">
        <div className="section-inner">
          <div className="section-header-row">
            <div>
              <span className="section-label">Stay in Style</span>
              <h2 className="section-title">Recommended Hotels</h2>
              <p className="section-subtitle">
                Hand-picked luxury stays that elevate your Chennai experience.
              </p>
            </div>
            <button className="btn-ghost" onClick={() => navigate("/hotels")}>View All →</button>
          </div>

          {hotels.length === 0 ? (
            <p style={{ color: "var(--gray)" }}>No hotel listings yet — add via the API.</p>
          ) : (
            <div className="hotel-grid">
              {hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
            </div>
          )}
        </div>
      </section>

      {/* Transport Services */}
      <section className="section transport-section">
        <div className="section-inner">
          <span className="section-label">Get Around</span>
          <h2 className="section-title">Transport Services</h2>
          <p className="section-subtitle" style={{ marginBottom: "48px" }}>
            Everything you need to navigate Chennai comfortably, from your first moment to last.
          </p>
          <div className="transport-grid">
            {TRANSPORT.map((t, i) => (
              <div key={i} className="transport-card">
                <div className="transport-card__icon">{t.icon}</div>
                <div className="transport-card__name">{t.name}</div>
                <div className="transport-card__desc">{t.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="section-inner">
          <span className="section-label">Traveller Stories</span>
          <h2 className="section-title">What People Say</h2>
          <p className="section-subtitle testimonials-section__sub">
            Real experiences from travellers who fell in love with Chennai.
          </p>
          <div className="testi-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="testi-card">
                <div className="testi-card__stars">{"★".repeat(t.stars)}</div>
                <p className="testi-card__text">"{t.text}"</p>
                <div className="testi-card__author">
                  <div className="testi-card__avatar">{t.name[0]}</div>
                  <div>
                    <div className="testi-card__name">{t.name}</div>
                    <div className="testi-card__loc">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
