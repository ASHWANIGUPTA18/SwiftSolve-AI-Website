const services = [
  { label: "Web Development", badge: "Full Stack" },
  { label: "AI Integration", badge: "GPT & Custom" },
  { label: "Chatbot Solutions", badge: "24/7 Automation" },
];

const CarLandingSection = () => {
  return (
    <section className="immersive-stage" id="drive">
      <div className="immersive-stage__grid">
        <div className="immersive-stage__copy">
          <h2>Elevating your business with intelligent web solutions.</h2>
          <p>
            We build high-performance websites, integrate powerful AI assistants,
            and deploy smart chatbots that automate your workflow — helping you
            convert visitors into customers around the clock.
          </p>

          <div className="immersive-stage__chips">
            {services.map(({ label, badge }) => (
              <span key={label}>
                {label}
                <small>{badge}</small>
              </span>
            ))}
          </div>

<div className="immersive-stage__actions">
            <button className="connect-wallet-btn" type="button">
              <span>Get Started</span>
            </button>
            <button className="ghost-button" type="button">
              View Our Work
            </button>
          </div>
        </div>

        <div className="immersive-stage__media">
          <div className="immersive-stage__glow" />
          <div className="immersive-stage__frame">
            <img
              src="/hero-illustration.png"
              alt="Web development and AI integration illustration"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "center",
                padding: "1.5rem",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarLandingSection;
