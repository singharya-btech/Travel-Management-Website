import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/hero.css";

// Chennai travel video sources
const VIDEOS = [
  {
    src: "Mumbai.mp4",
    poster:
      "Image link",
    label: "Mumbai",
    sublabel: "Mumbai is the financial capital of India",
  },
  {
    src: "ToyTrain.mp4",
    poster:
      "Image link",
    label: "Darjeeling Toy Train",
    sublabel: "A famous UNESCO World Heritage site built in 1881",
  },
  {
    src: "VaranasiGhat.mp4",
    poster:
      "Image link",
    label: "Varanasi Ghats",
    sublabel: "Tranquil scene of birds flying over the Ganges at Varanasi Ghats during sunrise.",
  },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const currentRef    = useRef(0);
  const mainVideosRef = useRef([]);
  const glowVideosRef = useRef([]);
  const labelTitleRef = useRef(null);
  const labelSubRef   = useRef(null);
  const dotsRef       = useRef([]);

  useEffect(() => {
    const switchVideo = () => {
      const prev = currentRef.current;
      const next = (prev + 1) % VIDEOS.length;
      currentRef.current = next;

      mainVideosRef.current[prev]?.classList.remove("hv-active");
      glowVideosRef.current[prev]?.classList.remove("hv-glow-active");
      dotsRef.current[prev]?.classList.remove("hero__dot--active");

      mainVideosRef.current[next]?.classList.add("hv-active");
      glowVideosRef.current[next]?.classList.add("hv-glow-active");
      dotsRef.current[next]?.classList.add("hero__dot--active");

      if (labelTitleRef.current)
        labelTitleRef.current.textContent = VIDEOS[next].label;
      if (labelSubRef.current)
        labelSubRef.current.textContent = VIDEOS[next].sublabel;
    };

    const id = setInterval(switchVideo, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero">
      {/* Symmetrical ambient glows */}
      <div className="hero__ambient hero__ambient--top"    />
      <div className="hero__ambient hero__ambient--right"  />
      <div className="hero__ambient hero__ambient--left"   />
      <div className="hero__ambient hero__ambient--bottom" />

      <div className="hero__container">

        {/* LEFT — text */}
        <div className="hero__left">
          <div className="hero__brand fade-up">
            <div className="hero__brand-dot" />
            Travel<span>Buddy</span>
          </div>

          <h1 className="hero__title fade-up fade-up--d1">
            We make the trip.<br />
            You make it <em>Unreal.</em>
          </h1>

          <p className="hero__subtitle fade-up fade-up--d2">
            TravelBuddy is crafted by explorers, for explorers — blending curated itineraries, hidden gems, and cinematic experiences that bring the soul of India to life. From the Himalayas to coastal escapes, every journey is designed to feel immersive, unforgettable, and deeply personal.
          </p>

          <div className="hero__btns fade-up fade-up--d3">
            <button
              className="hero__btn-primary"
              onClick={() => navigate("/packages")}
            >
              Explore Packages
            </button>
            <button
              className="hero__btn-secondary"
              onClick={() => navigate("/destinations")}
            >
              View Destinations
            </button>
          </div>
        </div>

        {/* RIGHT — video card */}
        <div className="hero__right">
          <div className="hero__video-wrapper">

            {/* Blurred glow blobs */}
            {VIDEOS.map((v, i) => (
              <video
                key={"glow" + i}
                ref={(el) => (glowVideosRef.current[i] = el)}
                className={"hv-glow" + (i === 0 ? " hv-glow-active" : "")}
                autoPlay muted loop playsInline
                poster={v.poster}
                src={v.src}
              />
            ))}

            {/* Main card */}
            <div className="hero__video-card">
              {VIDEOS.map((v, i) => (
                <video
                  key={"main" + i}
                  ref={(el) => (mainVideosRef.current[i] = el)}
                  className={"hv-main" + (i === 0 ? " hv-active" : "")}
                  autoPlay muted loop playsInline
                  poster={v.poster}
                  src={v.src}
                />
              ))}

              <div className="hero__video-overlay"    />
              <div className="hero__video-noise"      />
              <div className="hero__video-inner-glow" />

              <div className="hero__video-label">
                <h3 ref={labelTitleRef}>{VIDEOS[0].label}</h3>
                <p  ref={labelSubRef}>{VIDEOS[0].sublabel}</p>
              </div>

              <div className="hero__video-dots">
                {VIDEOS.map((_, i) => (
                  <span
                    key={i}
                    ref={(el) => (dotsRef.current[i] = el)}
                    className={"hero__dot" + (i === 0 ? " hero__dot--active" : "")}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
