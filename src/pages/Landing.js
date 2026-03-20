import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Landing({ session }) {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [counter, setCounter] = useState({ interviews: 0, users: 0, hired: 0 });
  const [openFaq, setOpenFaq] = useState(null);

  const roles = ["Frontend Developer", "Backend Developer", "Data Scientist", "Product Manager", "Full Stack Developer", "ML Engineer"];

  const features = [
    { icon: "🎤", title: "Voice Interview", desc: "Speak naturally. Our AI listens, understands and responds just like a real interviewer in real time." },
    { icon: "🤖", title: "3 AI Personalities", desc: "Choose Alex (friendly), Sarah (strict) or Raj (technical). Each brings a unique interview style." },
    { icon: "📊", title: "6-Skill Evaluation", desc: "Get scored on Technical, Communication, Problem Solving, Confidence, Clarity and Depth." },
    { icon: "🏢", title: "Company Specific", desc: "Practice for TCS, Infosys, Wipro, Amazon, Google with questions from real past interviews." },
    { icon: "📋", title: "30-Day Study Plan", desc: "After every interview get a personalized 4-week roadmap to fix your weak areas." },
    { icon: "🔥", title: "Streak & Badges", desc: "Build daily habits. Earn badges. Climb the leaderboard. Stay motivated every day." },
  ];

  const steps = [
    { number: "01", title: "Pick Your Role", desc: "Choose from 15+ job roles and set your difficulty level — Fresher, Mid or Senior.", icon: "🎯" },
    { number: "02", title: "Interview Live", desc: "AI interviewer speaks questions aloud. You respond by voice or text. Feels 100% real.", icon: "🎤" },
    { number: "03", title: "Get Your Report", desc: "Detailed scores, per-question feedback, strengths, weaknesses and personalized study plan.", icon: "📊" },
  ];

  const jobRoles = [
    { icon: "💻", name: "Frontend Dev", tag: "Popular" },
    { icon: "⚙️", name: "Backend Dev", tag: "" },
    { icon: "🔄", name: "Full Stack", tag: "Hot" },
    { icon: "📊", name: "Data Scientist", tag: "" },
    { icon: "🤖", name: "ML Engineer", tag: "New" },
    { icon: "📱", name: "Android Dev", tag: "" },
    { icon: "📦", name: "DevOps", tag: "" },
    { icon: "💼", name: "Product Manager", tag: "Popular" },
    { icon: "📈", name: "Business Analyst", tag: "" },
    { icon: "🎨", name: "UI/UX Designer", tag: "" },
    { icon: "☁️", name: "Cloud Engineer", tag: "Hot" },
    { icon: "🔒", name: "Cybersecurity", tag: "New" },
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Got hired at TCS", text: "I was failing every interview. After 2 weeks on Questioneer, I cracked TCS with an 89/100 score. The AI feedback was incredibly detailed!", avatar: "P", score: 89 },
    { name: "Rahul Mehta", role: "Software Engineer at Infosys", text: "The streak system kept me going every day. My confidence went from 40 to 78 in just 10 days. Got my dream job offer!", avatar: "R", score: 78 },
    { name: "Ananya Krishna", role: "Data Scientist at Wipro", text: "The evaluation report showed exactly where I was weak. After following the study plan for 3 weeks, I nailed it!", avatar: "A", score: 92 },
    { name: "Vikram Reddy", role: "Full Stack Dev at Startup", text: "Best ₹100 I ever spent. The company-specific questions for my target company were spot on. Highly recommend!", avatar: "V", score: 85 },
  ];

  const faqs = [
    { q: "Is Questioneer free to use?", a: "Yes! You get 2 free interviews per day forever. Upgrade to Pro for ₹100/month for unlimited interviews and all features." },
    { q: "How does the voice interview work?", a: "We use your browser's built-in microphone. The AI asks questions aloud and you speak your answers. It works best on Chrome." },
    { q: "Which job roles are covered?", a: "We cover 15+ roles including Frontend, Backend, Full Stack, Data Science, ML, DevOps, Product Manager, Business Analyst and more." },
    { q: "How accurate is the evaluation?", a: "Our AI evaluates you on 6 parameters and gives detailed per-question feedback. Most users report 85%+ accuracy in identifying their weak areas." },
    { q: "Can I practice for specific companies?", a: "Yes! Pro users get access to company-specific question banks for TCS, Infosys, Wipro, Amazon, Google, Microsoft and more." },
    { q: "Is my data safe?", a: "Absolutely. We use Supabase with row-level security. Your interview data is private and never shared with anyone." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole(prev => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const targets = { interviews: 10000, users: 5000, hired: 85 };
    const steps = 60;
    const stepTime = duration / steps;
    let current = { interviews: 0, users: 0, hired: 0 };
    const timer = setInterval(() => {
      current = {
        interviews: Math.min(current.interviews + targets.interviews / steps, targets.interviews),
        users: Math.min(current.users + targets.users / steps, targets.users),
        hired: Math.min(current.hired + targets.hired / steps, targets.hired),
      };
      setCounter({ interviews: Math.floor(current.interviews), users: Math.floor(current.users), hired: Math.floor(current.hired) });
      if (current.interviews >= targets.interviews) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: "var(--white)" }}>
      <Navbar session={session} />

      {/* HERO */}
      <section className="landing-hero">
        <div className="landing-hero-content fade-in-up">
          <div className="landing-badge">🚀 AI-Powered Mock Interviews · Used by 5,000+ job seekers</div>
          <h1 className="landing-title">
            Practice Interviews<br />
            for <span className="landing-title-rotating">{roles[currentRole]}</span>
          </h1>
          <p className="landing-subtitle">
            Interview with an AI that feels real. Get scored on 6 skills, receive per-question feedback, and a personalized 30-day study plan. Land your dream job faster.
          </p>
          <div className="landing-cta-buttons">
            <button className="btn-primary btn-lg" onClick={() => navigate(session ? "/setup" : "/auth")}>Start Free Interview →</button>
            <button className="btn-secondary btn-lg" onClick={() => navigate("/pricing")}>View Pricing</button>
          </div>
          <div className="landing-trust">
            <div className="landing-trust-item">✓ Free forever</div>
            <div className="landing-trust-divider">·</div>
            <div className="landing-trust-item">✓ No credit card</div>
            <div className="landing-trust-divider">·</div>
            <div className="landing-trust-item">✓ 2 interviews/day</div>
            <div className="landing-trust-divider">·</div>
            <div className="landing-trust-item">✓ Works on Chrome</div>
          </div>
        </div>

        <div className="landing-hero-card scale-in">
          <div className="hero-card-top">
            <div className="hero-card-header">
              <div className="hero-card-avatar">A</div>
              <div>
                <div className="hero-card-name">Alex · AI Interviewer</div>
                <div className="hero-card-status"><span className="status-dot"></span> Live Interview</div>
              </div>
              <div className="hero-card-badge">Q3/10</div>
            </div>
            <div className="hero-card-question">"Tell me about a challenging project you worked on and how you overcame the obstacles."</div>
          </div>
          <div className="hero-card-answer-section">
            <div className="hero-card-answer-label">🎤 Your Answer</div>
            <div className="speaking-indicator">
              <div className="speaking-dot"></div>
              <div className="speaking-dot"></div>
              <div className="speaking-dot"></div>
              <div className="speaking-dot"></div>
              <div className="speaking-dot"></div>
              <span className="speaking-text">Listening...</span>
            </div>
          </div>
          <div className="hero-card-footer">
            <span className="hero-card-progress-text">Progress</span>
            <div className="progress-bar" style={{ flex: 1, margin: "0 12px" }}>
              <div className="progress-fill" style={{ width: "30%" }}></div>
            </div>
            <span className="hero-card-progress-pct">30%</span>
          </div>
          <div className="hero-card-scores">
            <div className="hero-mini-score">
              <div className="hero-mini-score-val" style={{ color: "var(--success)" }}>8.2</div>
              <div className="hero-mini-score-label">Technical</div>
            </div>
            <div className="hero-mini-score">
              <div className="hero-mini-score-val" style={{ color: "var(--info)" }}>7.5</div>
              <div className="hero-mini-score-label">Communication</div>
            </div>
            <div className="hero-mini-score">
              <div className="hero-mini-score-val" style={{ color: "var(--warning)" }}>6.8</div>
              <div className="hero-mini-score-label">Confidence</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="landing-stats">
        <div className="landing-stats-inner">
          <div className="landing-stat"><div className="landing-stat-number">{counter.interviews.toLocaleString()}+</div><div className="landing-stat-label">Interviews Conducted</div></div>
          <div className="landing-stat-divider"></div>
          <div className="landing-stat"><div className="landing-stat-number">{counter.users.toLocaleString()}+</div><div className="landing-stat-label">Active Users</div></div>
          <div className="landing-stat-divider"></div>
          <div className="landing-stat"><div className="landing-stat-number">{counter.hired}%</div><div className="landing-stat-label">Got Hired</div></div>
          <div className="landing-stat-divider"></div>
          <div className="landing-stat"><div className="landing-stat-number">15+</div><div className="landing-stat-label">Job Roles</div></div>
          <div className="landing-stat-divider"></div>
          <div className="landing-stat"><div className="landing-stat-number">₹100</div><div className="landing-stat-label">Pro Per Month</div></div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="landing-section">
        <div className="page-content">
          <div className="landing-section-header">
            <div className="landing-section-tag">How It Works</div>
            <h2 className="landing-section-title">Three Steps to Interview Success</h2>
            <p className="landing-section-desc">From zero to confident in days, not months</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, i) => (
              <div key={i} className="step-card fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-section landing-section-gray">
        <div className="page-content">
          <div className="landing-section-header">
            <div className="landing-section-tag">Features</div>
            <h2 className="landing-section-title">Everything You Need to Get Hired</h2>
            <p className="landing-section-desc">Built for serious job seekers who want results</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon-wrap"><span className="feature-icon">{f.icon}</span></div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOB ROLES */}
      <section className="landing-section">
        <div className="page-content">
          <div className="landing-section-header">
            <div className="landing-section-tag">Job Roles</div>
            <h2 className="landing-section-title">15+ Roles Covered</h2>
            <p className="landing-section-desc">Technical and non-technical roles with targeted questions</p>
          </div>
          <div className="roles-showcase-grid">
            {jobRoles.map((role, i) => (
              <div key={i} className="role-showcase-card" onClick={() => navigate(session ? "/setup" : "/auth")}>
                <div className="role-icon">{role.icon}</div>
                <div className="role-name">{role.name}</div>
                {role.tag && <div className="role-tag">{role.tag}</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button className="btn-primary" onClick={() => navigate(session ? "/setup" : "/auth")}>Practice Now →</button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="landing-section landing-section-gray">
        <div className="page-content">
          <div className="landing-section-header">
            <div className="landing-section-tag">Success Stories</div>
            <h2 className="landing-section-title">Real Results from Real Users</h2>
            <p className="landing-section-desc">Join thousands who already cracked their dream job</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className={`testimonial-card ${i === currentTestimonial ? "testimonial-active" : ""}`}>
                <div className="testimonial-score-badge">{t.score}/100</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="avatar">{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <div key={i} className={`testimonial-dot ${i === currentTestimonial ? "active" : ""}`} onClick={() => setCurrentTestimonial(i)}></div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="landing-section">
        <div className="page-content">
          <div className="landing-section-header">
            <div className="landing-section-tag">Pricing</div>
            <h2 className="landing-section-title">Simple, Affordable Pricing</h2>
            <p className="landing-section-desc">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="landing-pricing-grid">
            <div className="landing-pricing-card">
              <div className="pricing-plan">Free</div>
              <div className="pricing-price">₹0</div>
              <div className="pricing-period">forever</div>
              <ul className="pricing-features">
                <li className="pricing-feature"><div className="pricing-feature-check">✓</div>2 interviews per day</li>
                <li className="pricing-feature"><div className="pricing-feature-check">✓</div>3 basic job roles</li>
                <li className="pricing-feature"><div className="pricing-feature-check">✓</div>Basic evaluation report</li>
                <li className="pricing-feature"><div className="pricing-feature-x">✗</div><span style={{color:"var(--gray-400)"}}>Company specific prep</span></li>
                <li className="pricing-feature"><div className="pricing-feature-x">✗</div><span style={{color:"var(--gray-400)"}}>Study plan</span></li>
              </ul>
              <button className="btn-secondary btn-full" onClick={() => navigate("/auth")}>Get Started Free</button>
            </div>
            <div className="landing-pricing-card landing-pricing-popular">
              <div className="pricing-popular-badge">Most Popular</div>
              <div className="pricing-plan">Pro</div>
              <div className="pricing-price">₹100</div>
              <div className="pricing-period">per month</div>
              <ul className="pricing-features">
                <li className="pricing-feature"><div className="pricing-feature-check">✓</div>Unlimited interviews</li>
                <li className="pricing-feature"><div className="pricing-feature-check">✓</div>All 15+ job roles</li>
                <li className="pricing-feature"><div className="pricing-feature-check">✓</div>Full evaluation report</li>
                <li className="pricing-feature"><div className="pricing-feature-check">✓</div>Company specific prep</li>
                <li className="pricing-feature"><div className="pricing-feature-check">✓</div>30-day study plan</li>
              </ul>
              <button className="btn-primary btn-full" onClick={() => navigate("/pricing")}>Upgrade to Pro →</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="landing-section landing-section-gray">
        <div className="page-content">
          <div className="landing-section-header">
            <div className="landing-section-tag">FAQ</div>
            <h2 className="landing-section-title">Frequently Asked Questions</h2>
            <p className="landing-section-desc">Everything you need to know about Questioneer</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? "faq-open" : ""}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <span className="faq-icon">{openFaq === i ? "−" : "+"}</span>
                </div>
                {openFaq === i && <div className="faq-answer fade-in">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="landing-final-cta">
        <div className="page-content" style={{ textAlign: "center" }}>
          <h2 className="landing-final-title">Ready to Land Your Dream Job?</h2>
          <p className="landing-final-desc">Join 5,000+ job seekers who practice daily on Questioneer. Start free, no credit card required.</p>
          <div className="landing-cta-buttons" style={{ justifyContent: "center" }}>
            <button className="btn-primary btn-lg" onClick={() => navigate(session ? "/setup" : "/auth")}>Start Free Interview →</button>
            <button className="btn-secondary btn-lg" onClick={() => navigate("/pricing")}>View Pricing</button>
          </div>
          <p className="landing-note" style={{ textAlign: "center", marginTop: "16px" }}>✓ Free forever &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ 2 interviews/day</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="page-content">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="navbar-logo" style={{ marginBottom: "8px" }}>Questioneer</div>
              <p className="footer-brand-desc">Practice smart. Get hired faster.</p>
              <p className="footer-brand-desc" style={{ marginTop: "8px" }}>Made with ❤️ in India 🇮🇳</p>
            </div>
            <div>
              <div className="footer-heading">Product</div>
              <div className="footer-links">
                <span onClick={() => navigate("/pricing")}>Pricing</span>
                <span onClick={() => navigate("/auth")}>Login</span>
                <span onClick={() => navigate("/auth")}>Sign Up</span>
                <span onClick={() => navigate("/setup")}>Practice</span>
              </div>
            </div>
            <div>
              <div className="footer-heading">Roles</div>
              <div className="footer-links">
                <span>Frontend Dev</span>
                <span>Backend Dev</span>
                <span>Data Scientist</span>
                <span>Product Manager</span>
              </div>
            </div>
            <div>
              <div className="footer-heading">Legal</div>
              <div className="footer-links">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Contact Us</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Questioneer. All rights reserved.</span>
            <span>Built with React, FastAPI & Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;