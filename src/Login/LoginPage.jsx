import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./LoginPage.module.css";
import facade from "../apiFacade";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    facade
      .login(username.trim(), password)
      .then(() => {
        navigate("/"); // or "/heroes/create"
      })
      .catch((err) => {
        setError(err?.message || "Login failed. Check username/password.");
        console.error("Login failed:", err);
      });
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit">Login</button>

        <p className={styles.registerLink}>
          No account? <Link to="/register">Register</Link>
        </p>

        <p className={styles.registerLink}>
          <Link to="/">Back to Home</Link>
        </p>
      </form>
    </div>
  );
}
