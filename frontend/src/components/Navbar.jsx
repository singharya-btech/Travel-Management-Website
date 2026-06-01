import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/css/navbar.css";

const NAV_LINKS = [
  { label: "Home",         path: "/" },
  { label: "Destinations", path: "/destinations" },
  { label: "Packages",     path: "/packages" },
  { label: "Hotels",       path: "/hotels" },
];

/* Pages where the navbar starts transparent (over hero video) */
const HERO_PAGES = ["/", "/destinations", "/packages", "/hotels"];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [dropOpen, setDropOpen]     = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const dropRef   = useRef(null);

  const isHeroPage = HERO_PAGES.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    navigate("/");
  };

  const navClass = [
    "navbar",
    scrolled    ? "navbar--scrolled" : "",
    !isHeroPage ? "navbar--opaque"   : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Get initials for avatar
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "TB";

  return (
    <nav className={navClass}>
      {/* Logo */}
      <Link to="/" className="navbar__logo">
        Travel<span>Buddy</span>
      </Link>

      {/* Nav links */}
      <div className="navbar__links">
        {NAV_LINKS.map(({ label, path }) => (
          <Link
            key={path}
            to={path}
            className={`navbar__link ${location.pathname === path ? "navbar__link--active" : ""}`}
          >
            {label}
          </Link>
        ))}

        {/* Auth section */}
        {isLoggedIn ? (
          <div className="navbar__profile" ref={dropRef}>
            <button
              className="navbar__profile-btn"
              onClick={() => setDropOpen((p) => !p)}
              aria-label="Profile menu"
            >
              <span className="navbar__avatar">{initials}</span>
              <span className="navbar__profile-name">{user?.name?.split(" ")[0]}</span>
              <svg
                className={`navbar__chevron ${dropOpen ? "navbar__chevron--open" : ""}`}
                width="12" height="12" viewBox="0 0 12 12"
                fill="none" xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {dropOpen && (
              <div className="navbar__dropdown">
                <div className="navbar__dropdown-header">
                  <span className="navbar__dropdown-avatar">{initials}</span>
                  <div>
                    <p className="navbar__dropdown-name">{user?.name}</p>
                    <p className="navbar__dropdown-role">Traveller</p>
                  </div>
                </div>
                <div className="navbar__dropdown-divider" />
                <Link
                  to="/profile"
                  className="navbar__dropdown-item"
                  onClick={() => setDropOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Your Profile
                </Link>
                <div className="navbar__dropdown-divider" />
                <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="navbar__cta">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
