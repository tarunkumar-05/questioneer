import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";

function Navbar({ session }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navTo("/")} style={{ cursor: "pointer" }}>
          Questioneer
        </div>

        <div className="navbar-links desktop-nav">
          {session ? (
            <>
              <button className="navbar-link" style={{ fontWeight: isActive("/dashboard") ? "700" : "500", color: isActive("/dashboard") ? "var(--black)" : "" }} onClick={() => navTo("/dashboard")}>Dashboard</button>
              <button className="navbar-link" style={{ fontWeight: isActive("/setup") ? "700" : "500", color: isActive("/setup") ? "var(--black)" : "" }} onClick={() => navTo("/setup")}>Practice</button>
              <button className="navbar-link" style={{ fontWeight: isActive("/pricing") ? "700" : "500", color: isActive("/pricing") ? "var(--black)" : "" }} onClick={() => navTo("/pricing")}>Pricing</button>
              <button className="navbar-link" style={{ fontWeight: isActive("/profile") ? "700" : "500", color: isActive("/profile") ? "var(--black)" : "" }} onClick={() => navTo("/profile")}>Profile</button>
              <button className="btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="navbar-link" onClick={() => navTo("/pricing")}>Pricing</button>
              <button className="navbar-link" onClick={() => navTo("/auth")}>Login</button>
              <button className="btn-primary btn-sm" onClick={() => navTo("/auth")}>Get Started →</button>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className="hamburger-line" style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }}></span>
          <span className="hamburger-line" style={{ opacity: menuOpen ? "0" : "1", transform: menuOpen ? "translateX(-10px)" : "none" }}></span>
          <span className="hamburger-line" style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }}></span>
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {session ? (
            <>
              <button className="mobile-menu-item" style={{ fontWeight: isActive("/dashboard") ? "700" : "500" }} onClick={() => navTo("/dashboard")}>Dashboard</button>
              <button className="mobile-menu-item" style={{ fontWeight: isActive("/setup") ? "700" : "500" }} onClick={() => navTo("/setup")}>Practice</button>
              <button className="mobile-menu-item" style={{ fontWeight: isActive("/pricing") ? "700" : "500" }} onClick={() => navTo("/pricing")}>Pricing</button>
              <button className="mobile-menu-item" style={{ fontWeight: isActive("/profile") ? "700" : "500" }} onClick={() => navTo("/profile")}>Profile</button>
              <div className="divider" style={{ margin: "8px 0" }}></div>
              <button className="mobile-menu-item" style={{ color: "var(--error)" }} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="mobile-menu-item" onClick={() => navTo("/pricing")}>Pricing</button>
              <button className="mobile-menu-item" onClick={() => navTo("/auth")}>Login</button>
              <button className="mobile-menu-item" style={{ fontWeight: "700" }} onClick={() => navTo("/auth")}>Get Started →</button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;