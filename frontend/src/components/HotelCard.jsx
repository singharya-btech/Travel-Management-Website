import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API, authHeaders } from "../api";
import { useAuth } from "../context/AuthContext";
import "../assets/css/hotels.css";

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const { id, name, rating, reviews, pricePerNight, location, tag, image } = hotel;

  const [wished,  setWished]  = useState(false);
  const [wishing, setWishing] = useState(false);

  /* Check if already in wishlist */
  useEffect(() => {
    if (!isLoggedIn || !id) return;
    fetch(`${API}/wishlist/check/${id}`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setWished(d.inWishlist))
      .catch(() => {});
  }, [id, isLoggedIn]);

  const toggleWish = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) { navigate("/login"); return; }
    setWishing(true);
    try {
      if (wished) {
        await fetch(`${API}/wishlist/ref/${id}`, { method: "DELETE", headers: authHeaders() });
        setWished(false);
      } else {
        const res = await fetch(`${API}/wishlist`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            refId:    id,
            type:     "hotel",
            title:    name,
            image:    Array.isArray(image) ? image : [image].filter(Boolean),
            location: location,
            price:    Number(String(pricePerNight).replace(/[^\d]/g, "")),
          }),
        });
        if (res.ok || res.status === 409) setWished(true);
      }
    } catch { /* silent */ }
    finally { setWishing(false); }
  };

  return (
    <div className="hotel-card" onClick={() => id && navigate(`/hotels/${id}`)}>
      <div className="hotel-card__img-wrap">
        {image
          ? <img className="hotel-card__img" src={image} alt={name} loading="lazy" />
          : <div className="hotel-card__img" style={{ background: "#1a2d4a" }} />
        }
        <span className="hotel-card__tag">{tag}</span>
        <button
          className="hotel-card__wish"
          onClick={toggleWish}
          disabled={wishing}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wished ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="hotel-card__info">
        <div className="hotel-card__row1">
          <span className="hotel-card__name">{name}</span>
          <div className="hotel-card__rating">
            <span className="hotel-card__star">★</span>
            {rating}
          </div>
        </div>

        <div className="hotel-card__loc">
          📍 {location} &nbsp;·&nbsp; {Number(reviews).toLocaleString()} reviews
        </div>

        <div className="hotel-card__footer">
          <div className="hotel-card__price">
            {pricePerNight} <span>/ night</span>
          </div>
          <button
            className="hotel-card__btn"
            onClick={(e) => { e.stopPropagation(); if (id) navigate(`/hotels/${id}`); }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
