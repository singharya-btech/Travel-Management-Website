import { Link } from "react-router-dom";

const SOCIAL_ICONS = ["📘", "📸", "🐦", "▶️"];

const EXPLORE_LINKS = [
  { label: "Destinations", path: "/destinations" },
  { label: "Packages",     path: "/packages" },
  { label: "Hotels",       path: "/hotels" },
];

const COMPANY_LINKS  = ["About Us", "Careers", "Blog", "Press"];
const SUPPORT_LINKS  = ["Help Center", "Contact Us", "Privacy Policy", "Terms"];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Brand column */}
          <div>
            <div className="footer__logo">
              Travel<span>Buddy</span>
            </div>
            <p className="footer__desc">
              Your gateway to the soul of South India. We craft unforgettable
              journeys through India's beaches, mountains, and living culture.
            </p>
            <div className="footer__socials">
              {SOCIAL_ICONS.map((icon, i) => (
                <button key={i} className="footer__social-btn" aria-label="social">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <div className="footer__col-title">Explore</div>
            {EXPLORE_LINKS.map(({ label, path }) => (
              <Link key={label} to={path} className="footer__link">
                {label}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <div className="footer__col-title">Company</div>
            {COMPANY_LINKS.map((l) => (
              <button key={l} className="footer__link">{l}</button>
            ))}
          </div>

          {/* Support */}
          <div>
            <div className="footer__col-title">Support</div>
            {SUPPORT_LINKS.map((l) => (
              <button key={l} className="footer__link">{l}</button>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} TravelBuddy. All rights reserved.</span>
          <span>Made with ♥ for Tamil Nadu Tourism</span>
        </div>
      </div>
    </footer>
  );
}
