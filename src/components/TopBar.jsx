import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./TopBar.module.css";
import facade from "../apiFacade";

export default function TopBar() {
  const navigate = useNavigate();

  // State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loggedIn, setLoggedIn] = useState(facade.loggedIn());
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  // Apply theme to HTML element when it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for authentication changes
  useEffect(() => {
    function handleAuthChange() {
      setLoggedIn(facade.loggedIn());
      setUsername(localStorage.getItem("username") || "");
    }

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  function handleLogout() {
    facade.logout();
    navigate("/");
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          MonsterBattler
        </Link>

        <nav className={styles.actions}>
          {!loggedIn ? (
            <Link to="/login" className={styles.link}>
              Login
            </Link>
          ) : (
            <>
              <span className={styles.username}>
                <strong>{username || "user"}</strong>
              </span>

              <Link to="/monsters" className={styles.link}>
                Monster Codex
              </Link>

              <Link to="/monsters/create" className={styles.link}>
                Create Monster
              </Link>

              <button type="button" className={styles.linkBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          <button onClick={toggleTheme} className={styles.themeBtn} type="button">
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </nav>
      </div>
    </header>
  );
}
