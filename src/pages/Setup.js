import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";

function Setup({ session }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedInterviewer, setSelectedInterviewer] = useState("");

  const roles = [
    { icon: "💻", name: "Frontend Developer" },
    { icon: "⚙️", name: "Backend Developer" },
    { icon: "📊", name: "Data Scientist" },
    { icon: "🤖", name: "ML Engineer" },
    { icon: "💼", name: "Product Manager" },
    { icon: "☁️", name: "Cloud Engineer" },
    { icon: "🔒", name: "Cybersecurity" },
    { icon: "📱", name: "Mobile Developer" },
    { icon: "🎨", name: "UI/UX Designer" },
    { icon: "📈", name: "Data Analyst" },
    { icon: "🧪", name: "QA Engineer" },
    { icon: "🏗️", name: "DevOps Engineer" },
  ];

  const difficulties = [
    { id: "Fresher", label: "Fresher", desc: "0–1 years experience", icon: "🌱" },
    { id: "Mid Level", label: "Mid Level", desc: "2–4 years experience", icon: "🚀" },
    { id: "Senior", label: "Senior", desc: "5+ years experience", icon: "🏆" },
  ];

  const types = [
    { id: "Technical", label: "Technical", desc: "DSA, System Design, Coding", icon: "💻" },
    { id: "HR", label: "HR & Behavioral", desc: "STAR method, Culture fit", icon: "🤝" },
    { id: "Mixed", label: "Mixed", desc: "Technical + HR questions", icon: "🎯" },
  ];

  const interviewers = [
    { id: "Friendly", label: "Arjun", style: "Friendly & Encouraging", icon: "😊", desc: "Supportive tone, hints when stuck" },
    { id: "Balanced", label: "Priya", style: "Balanced & Professional", icon: "🎯", desc: "Realistic interview experience" },
    { id: "Strict", label: "Vikram", style: "Strict & Challenging", icon: "🔥", desc: "Tough questions, no hints" },
  ];

  useEffect(() => {
    fetchProfile();
    if (location.state?.role) setSelectedRole(location.state.role);
    if (location.state?.difficulty) setSelectedDifficulty(location.state.difficulty);
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      if (data) setProfile(data);
    } catch (err) {}
    setLoading(false);
  };

  const canStart = selectedRole && selectedDifficulty && selectedType && selectedInterviewer;

  const handleStart = async () => {
    if (!canStart) return;
    if (profile?.plan !== "pro" && (profile?.interviews_today || 0) >= 2) {
      alert("You've used your 2 free interviews today! Upgrade to Pro for unlimited interviews.");
      navigate("/pricing");
      return;
    }
    setStarting(true);
    navigate("/interview", {
      state: {
        role: selectedRole,
        difficulty: selectedDifficulty,
        type: selectedType,
        interviewer: selectedInterviewer,
      }
    });
  };

  if (loading) return (
    <div className="page" style={{ background: "#FFFBF7" }}>
      <Navbar session={session} />
      <div className="page-content">
        {[200, 150, 150].map((h, i) => (
          <div key={i} className="skeleton" style={{ height: h, borderRadius: 20, marginBottom: 20 }}></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="page" style={{ background: "#FFFBF7" }}>
      <Navbar session={session} />
      <div className="page-content fade-in-up" style={{ maxWidth: 860 }}>

        {/* Header */}
        <div className="setup-header">
          <button className="setup-back" onClick={() => navigate("/dashboard")}>← Back</button>
          <div>
            <h1 className="setup-title">Set Up Your Interview</h1>
            <p className="setup-subtitle">Choose your preferences and start practicing</p>
          </div>
          {profile?.plan !== "pro" && (
            <div className="setup-quota">
              <span className="setup-quota-num">{Math.max(0, 2 - (profile?.interviews_today || 0))}</span>
              <span className="setup-quota-label">interviews left today</span>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="setup-progress">
          {[
            { num: 1, label: "Role", done: !!selectedRole },
            { num: 2, label: "Level", done: !!selectedDifficulty },
            { num: 3, label: "Type", done: !!selectedType },
            { num: 4, label: "Interviewer", done: !!selectedInterviewer },
          ].map((step, i) => (
            <div key={i} className="setup-step">
              <div className={`setup-step-circle ${step.done ? "done" : ""}`}>
                {step.done ? "✓" : step.num}
              </div>
              <span className="setup-step-label">{step.label}</span>
              {i < 3 && <div className={`setup-step-line ${step.done ? "done" : ""}`}></div>}
            </div>
          ))}
        </div>

        {/* Step 1 — Role */}
        <div className="setup-section">
          <div className="setup-section-header">
            <div className="setup-section-num">01</div>
            <div>
              <h2 className="setup-section-title">Job Role</h2>
              <p className="setup-section-desc">What position are you interviewing for?</p>
            </div>
          </div>
          <div className="setup-roles-grid">
            {roles.map((role, i) => (
              <div
                key={i}
                className={`setup-role-card ${selectedRole === role.name ? "selected" : ""}`}
                onClick={() => setSelectedRole(role.name)}
              >
                <span className="setup-role-icon">{role.icon}</span>
                <span className="setup-role-name">{role.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 — Difficulty */}
        <div className="setup-section">
          <div className="setup-section-header">
            <div className="setup-section-num">02</div>
            <div>
              <h2 className="setup-section-title">Experience Level</h2>
              <p className="setup-section-desc">How many years of experience do you have?</p>
            </div>
          </div>
          <div className="setup-diff-grid">
            {difficulties.map((d, i) => (
              <div
                key={i}
                className={`setup-diff-card ${selectedDifficulty === d.id ? "selected" : ""}`}
                onClick={() => setSelectedDifficulty(d.id)}
              >
                <span className="setup-diff-icon">{d.icon}</span>
                <span className="setup-diff-label">{d.label}</span>
                <span className="setup-diff-desc">{d.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3 — Type */}
        <div className="setup-section">
          <div className="setup-section-header">
            <div className="setup-section-num">03</div>
            <div>
              <h2 className="setup-section-title">Interview Type</h2>
              <p className="setup-section-desc">What kind of questions do you want to practice?</p>
            </div>
          </div>
          <div className="setup-diff-grid">
            {types.map((t, i) => (
              <div
                key={i}
                className={`setup-diff-card ${selectedType === t.id ? "selected" : ""}`}
                onClick={() => setSelectedType(t.id)}
              >
                <span className="setup-diff-icon">{t.icon}</span>
                <span className="setup-diff-label">{t.label}</span>
                <span className="setup-diff-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 4 — Interviewer */}
        <div className="setup-section">
          <div className="setup-section-header">
            <div className="setup-section-num">04</div>
            <div>
              <h2 className="setup-section-title">Choose Interviewer</h2>
              <p className="setup-section-desc">Pick your AI interviewer personality</p>
            </div>
          </div>
          <div className="setup-interviewer-grid">
            {interviewers.map((iv, i) => (
              <div
                key={i}
                className={`setup-interviewer-card ${selectedInterviewer === iv.id ? "selected" : ""}`}
                onClick={() => setSelectedInterviewer(iv.id)}
              >
                <div className="setup-interviewer-avatar">{iv.icon}</div>
                <div className="setup-interviewer-name">{iv.label}</div>
                <div className="setup-interviewer-style">{iv.style}</div>
                <div className="setup-interviewer-desc">{iv.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary + Start */}
        <div className="setup-footer">
          {canStart && (
            <div className="setup-summary">
              <span className="setup-summary-item">💼 {selectedRole}</span>
              <span className="setup-summary-dot">·</span>
              <span className="setup-summary-item">📊 {selectedDifficulty}</span>
              <span className="setup-summary-dot">·</span>
              <span className="setup-summary-item">🎯 {selectedType}</span>
              <span className="setup-summary-dot">·</span>
              <span className="setup-summary-item">🤖 {selectedInterviewer}</span>
            </div>
          )}
          <button
            className="setup-start-btn"
            onClick={handleStart}
            disabled={!canStart || starting}
            style={{ opacity: canStart ? 1 : 0.4 }}
          >
            {starting ? "Starting..." : canStart ? "🎤 Start Interview →" : "Complete all steps to start"}
          </button>
          {!canStart && (
            <p className="setup-hint">Please select all 4 options above to start your interview</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Setup;