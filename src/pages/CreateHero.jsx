// CreateHero.jsx - SIMPLIFIED VERSION
// Create a hero and navigate to battle

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateHero.module.css";
import facade from "../apiFacade";

export default function CreateHero() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [hp, setHp] = useState(100);
  const [attack, setAttack] = useState(10);
  const [defense, setDefense] = useState(5);
  const [level, setLevel] = useState(1);

  // UI state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!facade.loggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    // Create hero object
    const hero = {
      name: name.trim(),
      level: Number(level),
      hp: Number(hp),
      attack: Number(attack),
      defense: Number(defense),
      xp: 0,
    };

    // Send to backend
    facade
      .createHero(hero)
      .then((created) => {
        // Navigate to battle with hero data
        navigate("/battle", { state: { hero: created } });
      })
      .catch((err) => {
        setError(err.message || "Failed to create hero");
        setLoading(false);
      });
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Hero</h1>
        <p className={styles.subtitle}>Create your champion and prepare for battle.</p>

        {error && <p className={styles.error}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Hero name
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Markus the Brave"
              required
            />
          </label>

          <div className={styles.grid}>
            <label className={styles.label}>
              HP
              <input
                className={styles.input}
                type="number"
                min="1"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              Attack
              <input
                className={styles.input}
                type="number"
                min="0"
                value={attack}
                onChange={(e) => setAttack(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              Defense
              <input
                className={styles.input}
                type="number"
                min="0"
                value={defense}
                onChange={(e) => setDefense(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              Level
              <input
                className={styles.input}
                type="number"
                min="1"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              />
            </label>
          </div>

          <button className={styles.primaryBtn} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Hero"}
          </button>

          <button
            className={styles.secondaryBtn}
            type="button"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
}
