import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

const Waitlist = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const successRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (formRef.current) {
        gsap.to(formRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.3,
          onComplete: () => {
            setSubmitted(true);
            if (successRef.current) {
              gsap.fromTo(
                successRef.current,
                { opacity: 0, scale: 0.9 },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.4,
                  ease: 'back.out(1.2)',
                }
              );
            }
          },
        });
      }
    }, 1000);
  };

  return (
    <section ref={sectionRef} id="waitlist" className="waitlist-section">
      <div className="waitlist-container">
        <h2 className="waitlist-title">Contact Us</h2>
        <p className="waitlist-subtitle">Have a project in mind? We'd love to hear from you.</p>

        <div className="contact-info">
          <a href="tel:+447553201795" className="contact-info-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.58 4.87 2 2 0 0 1 3.54 2.7h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            +44 7553 201795
          </a>

          <span style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.1)", display: "none" }} className="sm:block" />

          <a href="mailto:swiftsolveai9@gmail.com" className="contact-info-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            swiftsolveai9@gmail.com
          </a>

          <span style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.1)", display: "none" }} className="sm:block" />

          <div className="contact-info-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>107 Senwick Drive, NN8 1RX<br />Wellingborough, Northamptonshire</span>
          </div>
        </div>

        {!submitted ? (
          <form ref={formRef} onSubmit={handleSubmit} className="waitlist-form">
            <div className="input-group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="waitlist-input"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="waitlist-input"
                required
              />
            </div>
            <button type="submit" disabled={isLoading} className="waitlist-submit-btn">
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        ) : (
          <div ref={successRef} className="waitlist-success">
            <div className="success-checkmark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Message Sent!</h3>
            <p>Thanks for reaching out. We'll get back to you soon.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Waitlist;

