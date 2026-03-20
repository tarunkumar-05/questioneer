import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) { setMessage({ type: "error", text: "Please fill in all fields." }); return; }
    if (password.length < 6) { setMessage({ type: "error", text: "Password must be at least 6 characters." }); return; }
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setMessage({ type: "error", text: error.message }); }
        else { navigate("/dashboard"); }
      } else {
        if (!fullName.trim()) { setMessage({ type: "error", text: "Please enter your full name." }); setLoading(false); return; }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) {
          setMessage({ type: "error", text: error.message });
        } else {
          if (data.user) {
            await supabase.from("profiles").upsert({
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
              plan: "free",
              total_interviews: 0,
              streak_days: 0,
              average_score: 0,
              interviews_today: 0
            });
          }
          setMessage({ type: "success", text: "Account created successfully! You can now login." });
          setMode("login");
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) { setMessage({ type: "error", text: "Please enter your email address." }); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) { setMessage({ type: "error", text: error.message }); }
      else { setMessage({ type: "success", text: "Password reset link sent to your email!" }); }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong." });
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") { mode === "forgot" ? handleForgotPassword() : handleAuth(); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Questioneer</div>
        <div className="auth-left-content">
          <h2 className="auth-left-title">Practice interviews.<br />Land your dream job.</h2>
          <p className="auth-left-desc">Join 5,000+ job seekers who practice daily with our AI interviewer. Get detailed feedback and improve faster.</p>
          <div className="auth-features">
            {[
              { icon: "🎤", text: "Voice-based AI interviews" },
              { icon: "📊", text: "Detailed skill evaluation" },
              { icon: "🏢", text: "Company-specific prep" },
              { icon: "🔥", text: "Daily streak tracking" },
            ].map((f, i) => (
              <div key={i} className="auth-feature-item">
                <span className="auth-feature-icon">{f.icon}</span>
                <span className="auth-feature-text">{f.text}</span>
              </div>
            ))}
          </div>
          <div className="auth-testimonial">
            <p className="auth-testimonial-text">"I improved my interview score from 45 to 89 in just 2 weeks. Got hired at TCS!"</p>
            <div className="auth-testimonial-author">
              <div className="avatar avatar-sm">P</div>
              <div>
                <div className="auth-testimonial-name">Priya Sharma</div>
                <div className="auth-testimonial-role">Software Engineer at TCS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container scale-in">
          <div className="auth-mobile-logo" onClick={() => navigate("/")}>Questioneer</div>
          {mode !== "forgot" && (
            <div className="tabs" style={{ marginBottom: "32px" }}>
              <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => { setMode("login"); setMessage({ type: "", text: "" }); }}>Login</button>
              <button className={`tab ${mode === "signup" ? "active" : ""}`} onClick={() => { setMode("signup"); setMessage({ type: "", text: "" }); }}>Sign Up</button>
            </div>
          )}
          <h1 className="auth-form-title">
            {mode === "login" && "Welcome back 👋"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Reset your password"}
          </h1>
          <p className="auth-form-subtitle">
            {mode === "login" && "Enter your details to continue practicing."}
            {mode === "signup" && "Start your interview journey today. It's free!"}
            {mode === "forgot" && "We'll send a reset link to your email."}
          </p>
          <div className="auth-form">
            {mode === "signup" && (
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input className="input" type="text" placeholder="Rahul Mehta" value={fullName} onChange={(e) => setFullName(e.target.value)} onKeyPress={handleKeyPress} autoFocus />
              </div>
            )}
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyPress={handleKeyPress} autoFocus={mode !== "signup"} />
            </div>
            {mode !== "forgot" && (
              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="input-password-wrap">
                  <input className="input" type={showPassword ? "text" : "password"} placeholder={mode === "signup" ? "Min 6 characters" : "Your password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeyPress} style={{ paddingRight: "48px" }} />
                  <button className="input-password-toggle" onClick={() => setShowPassword(!showPassword)} type="button">{showPassword ? "🙈" : "👁️"}</button>
                </div>
              </div>
            )}
            {mode === "login" && (
              <div style={{ textAlign: "right", marginTop: "-8px" }}>
                <span className="auth-link" onClick={() => { setMode("forgot"); setMessage({ type: "", text: "" }); }}>Forgot password?</span>
              </div>
            )}
            {message.text && (
              <div className={`auth-message-box ${message.type === "error" ? "auth-message-error" : "auth-message-success"}`}>
                {message.type === "error" ? "⚠️" : "✅"} {message.text}
              </div>
            )}
            <button className="btn-primary btn-full" onClick={mode === "forgot" ? handleForgotPassword : handleAuth} disabled={loading} style={{ marginTop: "8px" }}>
              {loading ? (
                <span className="auth-loading"><span className="auth-spinner"></span>Please wait...</span>
              ) : (
                <>
                  {mode === "login" && "Continue →"}
                  {mode === "signup" && "Create Account →"}
                  {mode === "forgot" && "Send Reset Link →"}
                </>
              )}
            </button>
            {mode === "forgot" && (
              <button className="btn-secondary btn-full" onClick={() => { setMode("login"); setMessage({ type: "", text: "" }); }} style={{ marginTop: "8px" }}>← Back to Login</button>
            )}
            {mode === "signup" && (
              <p className="auth-terms">By creating an account, you agree to our <span className="auth-link">Terms of Service</span> and <span className="auth-link">Privacy Policy</span>.</p>
            )}
          </div>
          {mode !== "forgot" && (
            <p className="auth-switch-text">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <span className="auth-link" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage({ type: "", text: "" }); }}>
                {mode === "login" ? "Sign up free →" : "Log in →"}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;