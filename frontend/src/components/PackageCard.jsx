import "../assets/css/packages.css";

export default function PackageCard({ pkg }) {
  const { title, duration, price, badge, image, highlights } = pkg;

  return (
    <div className="pkg-card">
      <img className="pkg-card__img" src={image} alt={title} loading="lazy" />

      <div className="pkg-card__body">
        <span className="pkg-card__badge">{badge}</span>

        <h3 className="pkg-card__title">{title}</h3>

        <div className="pkg-card__meta">
          <div className="pkg-card__meta-item">
            <span>📅</span>
            <span>{duration}</span>
          </div>
          <div className="pkg-card__meta-item">
            <span>🗺️</span>
            <span>Chennai &amp; Around</span>
          </div>
        </div>

        {highlights && highlights.length > 0 && (
          <div className="pkg-card__highlights">
            {highlights.map((h) => (
              <span key={h} className="pkg-card__highlight">
                {h}
              </span>
            ))}
          </div>
        )}

        <div className="pkg-card__footer">
          <div className="pkg-card__price">
            {price} <span>/ person</span>
          </div>
          {/* TODO: wire to booking API */}
          <button className="btn-navy">Book Now</button>
        </div>
      </div>
    </div>
  );
}
