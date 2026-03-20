import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";

function Dashboard({ session }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => { fetchProfile(); fetchInterviews(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (data) setProfile(data);
    } catch (err) {}
  };

  const fetchInterviews = async () => {
    try {
      const { data } = await supabase.from("interviews").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }).limit(10);
      if (data) setInterviews(data);
    } catch (err) {}
    setLoading(false);
  };

  const getName = () => profile?.full_name ? profile.full_name.split(" ")[0] : session.user.email.split("@")[0];
  const getGreeting = () => { const h = new Date().getHours(); return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening"; };
  const getScoreColor = (s) => s >= 80 ? "#059669" : s >= 60 ? "#D97706" : "#DC2626";

  const getGrade = (g) => ({
    A: { bg: "#ECFDF5", color: "#065F46" },
    B: { bg: "#FFF7ED", color: "#92400E" },
    C: { bg: "#FFFBEB", color: "#78350F" },
    D: { bg: "#FEF2F2", color: "#991B1B" },
    F: { bg: "#FEF2F2", color: "#991B1B" },
  }[g] || { bg: "#F9FAFB", color: "#6B7280" });

  const readiness = Math.min(100, (profile?.total_interviews || 0) * 8 + (profile?.average_score || 0) * 0.4);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (readiness / 100) * circumference;

  const roles = [
    { icon: "💻", name: "Frontend Developer", diff: "Fresher", color: "#FFF7ED", accent: "#D97706" },
    { icon: "⚙️", name: "Backend Developer", diff: "Mid Level", color: "#ECFDF5", accent: "#059669" },
    { icon: "📊", name: "Data Scientist", diff: "Fresher", color: "#FFFBEB", accent: "#D97706" },
    { icon: "🤖", name: "ML Engineer", diff: "Mid Level", color: "#F0FDF4", accent: "#16A34A" },
    { icon: "💼", name: "Product Manager", diff: "Senior", color: "#FFF7ED", accent: "#B45309" },
    { icon: "☁️", name: "Cloud Engineer", diff: "Mid Level", color: "#FFF7ED", accent: "#D97706" },
  ];

  const badges = [
    { icon: "🎯", name: "First Interview", earned: (profile?.total_interviews || 0) >= 1 },
    { icon: "🔥", name: "3 Day Streak", earned: (profile?.streak_days || 0) >= 3 },
    { icon: "⭐", name: "Score 80+", earned: (profile?.average_score || 0) >= 80 },
    { icon: "🏆", name: "10 Interviews", earned: (profile?.total_interviews || 0) >= 10 },
    { icon: "💎", name: "Pro Member", earned: profile?.plan === "pro" },
    { icon: "🎓", name: "All Roles", earned: false },
  ];

  const tips = [
    "Practice answering STAR method questions for behavioral interviews.",
    "Research the company culture before your next interview.",
    "Speak slowly and clearly — confidence matters more than perfection.",
    "Always prepare 2-3 questions to ask your interviewer.",
    "Review your weak areas from your last evaluation report.",
  ];

  if (loading) return (
    <div className="page" style={{ background: "#FFFBF7" }}>
      <Navbar session={session} />
      <div className="page-content">
        {[220, 140, 300].map((h, i) => (
          <div key={i} className="skeleton" style={{ height: h, borderRadius: 20, marginBottom: 20 }}></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="page" style={{ background: "#FFFBF7" }}>
      <Navbar session={session} />
      <div className="page-content fade-in-up" style={{ maxWidth: 1200 }}>

        {/* HERO */}
        <div className="anth-hero">
          <div className="anth-glow-1"></div>
          <div className="anth-glow-2"></div>
          <div className="anth-hero-inner">
            <div className="anth-hero-left">
              <div className="anth-date-tag">
                📅 {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              <h1 className="anth-greeting">
                {getGreeting()},<br />
                <span className="anth-name">{getName()}</span> 👋
              </h1>
              <p className="anth-tagline">
                {profile?.plan === "pro"
                  ? "⭐ Pro Member · Unlimited interviews"
                  : `${Math.max(0, 2 - (profile?.interviews_today || 0))} free interviews remaining today`}
              </p>
              <div className="anth-hero-btns">
                <button className="anth-start-btn" onClick={() => navigate("/setup")}>
                  🎤 Start Interview
                </button>
                {profile?.plan !== "pro" && (
                  <button className="anth-pro-btn" onClick={() => navigate("/pricing")}>
                    ⭐ Go Pro · ₹100/mo
                  </button>
                )}
              </div>
            </div>

            <div className="anth-hero-stats">
              {[
                { num: profile?.total_interviews || 0, label: "Interviews" },
                { num: Math.round(profile?.average_score || 0), label: "Avg Score" },
                { num: `${profile?.streak_days || 0} 🔥`, label: "Streak" },
              ].map((s, i) => (
                <div key={i} className="anth-stat-box">
                  <div className="anth-stat-num">{s.num}</div>
                  <div className="anth-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="anth-ring-box">
              <svg width="130" height="130" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#FEF3C7" strokeWidth="8"/>
                <circle cx="50" cy="50" r="45" fill="none"
                  stroke={readiness >= 70 ? "#059669" : readiness >= 40 ? "#D97706" : "#DC2626"}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={offset}
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 1.5s ease" }}
                />
                <text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="800" fill="#1C1917">{Math.round(readiness)}%</text>
                <text x="50" y="60" textAnchor="middle" fontSize="8" fill="#92400E">READINESS</text>
              </svg>
              <div className="anth-ring-label">Interview Readiness</div>
              <div className="anth-ring-sub">
                {readiness >= 70 ? "🎯 Ready!" : readiness >= 40 ? "💪 Almost!" : "🌱 Just started"}
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="anth-tabs">
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "practice", label: "🎤 Practice" },
            { id: "progress", label: "📈 Progress" },
            { id: "badges", label: "🏆 Badges" },
          ].map(t => (
            <button key={t.id} className={`anth-tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="anth-content fade-in">
            <div className="anth-stat-grid">
              {[
                { icon: "🎤", label: "Total Interviews", value: profile?.total_interviews || 0, sub: "Keep going!", color: "#FFF7ED", top: "#D97706" },
                { icon: "📊", label: "Average Score", value: `${Math.round(profile?.average_score || 0)}/100`, sub: (profile?.average_score || 0) >= 70 ? "Excellent! 🌟" : "Keep improving!", color: "#ECFDF5", top: "#059669" },
                { icon: "🔥", label: "Day Streak", value: profile?.streak_days || 0, sub: (profile?.streak_days || 0) >= 3 ? "On fire! 🔥" : "Build it!", color: "#FFFBEB", top: "#D97706" },
                { icon: "⭐", label: "Plan", value: profile?.plan === "pro" ? "Pro" : "Free", sub: profile?.plan !== "pro" ? "Upgrade →" : "Unlimited!", color: "#FFF7ED", top: "#B45309", action: profile?.plan !== "pro" ? () => navigate("/pricing") : null },
              ].map((s, i) => (
                <div key={i} className="anth-card" style={{ background: s.color }}>
                  <div className="anth-card-top" style={{ background: s.top }}></div>
                  <div className="anth-card-icon">{s.icon}</div>
                  <div className="anth-card-value">{s.value}</div>
                  <div className="anth-card-label">{s.label}</div>
                  <div className="anth-card-sub"
                    style={{ color: s.action ? "#D97706" : "#9CA3AF", cursor: s.action ? "pointer" : "default", fontWeight: s.action ? 700 : 400 }}
                    onClick={s.action || undefined}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="anth-tip">
              <div className="anth-tip-icon">💡</div>
              <div className="anth-tip-content">
                <div className="anth-tip-label">TIP OF THE DAY</div>
                <div className="anth-tip-text">{tips[new Date().getDay() % tips.length]}</div>
              </div>
              <button className="anth-tip-btn" onClick={() => navigate("/setup")}>Practice Now →</button>
            </div>

            <div className="anth-section-head">
              <h2 className="anth-section-title">Recent Interviews</h2>
              {interviews.length > 0 && <button className="anth-link-btn" onClick={() => navigate("/profile")}>View All →</button>}
            </div>

            {interviews.length === 0 ? (
              <div className="anth-empty">
                <div style={{ fontSize: 64 }}>🎤</div>
                <h3 className="anth-empty-title">No interviews yet!</h3>
                <p className="anth-empty-desc">Complete your first AI interview to see your results and track your progress.</p>
                <button className="anth-start-btn" onClick={() => navigate("/setup")}>Start First Interview →</button>
              </div>
            ) : (
              <div className="anth-interview-list">
                {interviews.slice(0, 5).map((iv, i) => {
                  const g = getGrade(iv.grade);
                  return (
                    <div key={i} className="anth-interview-row">
                      <span className="anth-rank">#{i + 1}</span>
                      <div className="anth-grade" style={{ background: g.bg, color: g.color }}>{iv.grade || "?"}</div>
                      <div className="anth-iv-info">
                        <div className="anth-iv-role">{iv.job_role}</div>
                        <div className="anth-iv-meta">{iv.difficulty} · {new Date(iv.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                      </div>
                      <div className="anth-iv-score-wrap">
                        <div className="anth-iv-score" style={{ color: getScoreColor(iv.overall_score) }}>{iv.overall_score || 0}<span style={{ fontSize: 12, color: "#D1D5DB" }}>/100</span></div>
                        <div className="anth-iv-bar"><div style={{ width: `${iv.overall_score || 0}%`, height: "100%", background: getScoreColor(iv.overall_score), borderRadius: 99 }}></div></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PRACTICE */}
        {activeTab === "practice" && (
          <div className="anth-content fade-in">
            <div className="anth-section-head">
              <h2 className="anth-section-title">Choose Your Role</h2>
              <div style={{ fontSize: 13, color: "#9CA3AF" }}>Click to start practicing</div>
            </div>
            <div className="anth-roles-grid">
              {roles.map((r, i) => (
                <div key={i} className="anth-role-card" style={{ background: r.color, borderColor: r.accent + "30" }}
                  onClick={() => navigate("/setup", { state: { role: r.name, difficulty: r.diff } })}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{r.icon}</div>
                  <div className="anth-role-name">{r.name}</div>
                  <div className="anth-role-diff" style={{ color: r.accent }}>{r.diff}</div>
                  <div className="anth-role-start" style={{ color: r.accent }}>Start Interview →</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROGRESS */}
        {activeTab === "progress" && (
          <div className="anth-content fade-in">
            <div className="anth-section-head">
              <h2 className="anth-section-title">Skill Breakdown</h2>
            </div>
            <div className="anth-skills-grid">
              {[
                { label: "Technical Knowledge", score: profile?.average_score || 0, color: "#D97706" },
                { label: "Communication", score: Math.round((profile?.average_score || 0) * 0.9), color: "#059669" },
                { label: "Problem Solving", score: Math.round((profile?.average_score || 0) * 0.85), color: "#D97706" },
                { label: "Confidence", score: Math.round((profile?.average_score || 0) * 0.8), color: "#B45309" },
                { label: "Clarity", score: Math.round((profile?.average_score || 0) * 0.95), color: "#059669" },
                { label: "Answer Depth", score: Math.round((profile?.average_score || 0) * 0.75), color: "#D97706" },
              ].map((sk, i) => (
                <div key={i} className="anth-skill">
                  <div className="anth-skill-head">
                    <span className="anth-skill-label">{sk.label}</span>
                    <span className="anth-skill-score" style={{ color: sk.color }}>{sk.score}/100</span>
                  </div>
                  <div className="anth-skill-bar">
                    <div style={{ width: `${sk.score}%`, height: "100%", background: `linear-gradient(90deg, ${sk.color}, ${sk.color}88)`, borderRadius: 99, transition: "width 1.2s ease" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BADGES */}
        {activeTab === "badges" && (
          <div className="anth-content fade-in">
            <div className="anth-section-head">
              <h2 className="anth-section-title">Achievements</h2>
              <span style={{ fontSize: 13, color: "#9CA3AF" }}>{badges.filter(b => b.earned).length}/{badges.length} earned</span>
            </div>
            <div className="anth-badges-grid">
              {badges.map((b, i) => (
                <div key={i} className={`anth-badge ${b.earned ? "earned" : "locked"}`}>
                  <div className="anth-badge-icon">{b.earned ? b.icon : "🔒"}</div>
                  <div className="anth-badge-name">{b.name}</div>
                  <div className="anth-badge-status">{b.earned ? "✅ Earned" : "Locked"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UPGRADE */}
        {profile?.plan !== "pro" && (
          <div className="anth-upgrade">
            <div className="anth-upgrade-glow"></div>
            <div className="anth-upgrade-left">
              <div className="anth-upgrade-tag">LIMITED OFFER</div>
              <h3 className="anth-upgrade-title">Unlock Your Full Potential</h3>
              <p className="anth-upgrade-desc">Unlimited interviews · All 15+ roles · Company-specific prep · 30-day study plans</p>
              <div className="anth-upgrade-features">
                {["Unlimited interviews", "All job roles", "Company prep", "Study plans"].map((f, i) => (
                  <span key={i} className="anth-upgrade-feat">✓ {f}</span>
                ))}
              </div>
            </div>
            <div className="anth-upgrade-right">
              <div className="anth-upgrade-price">₹100<span>/mo</span></div>
              <button className="anth-upgrade-cta" onClick={() => navigate("/pricing")}>Upgrade to Pro →</button>
              <div className="anth-upgrade-note">Cancel anytime · No hidden fees</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;