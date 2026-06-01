import { useNavigate } from "react-router-dom";
import "../assets/css/destinations.css";

export default function DestinationCard({ destination }) {
  const navigate = useNavigate();
  const { id, name, tag, description, image } = destination;

  const goToDetail = () => {
    if (id) navigate(`/destinations/${id}`);
  };

  return (
    <div
      className="dest-card"
      onClick={goToDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && goToDetail()}
    >
      <img className="dest-card__img" src={image} alt={name} loading="lazy" />

      <div className="dest-card__overlay">
        <span className="dest-card__tag">{tag}</span>
        <h3 className="dest-card__name">{name}</h3>
        <p className="dest-card__desc">{description}</p>
        <button
          className="dest-card__btn"
          onClick={(e) => { e.stopPropagation(); goToDetail(); }}
        >
          Explore →
        </button>
      </div>
    </div>
  );
}
