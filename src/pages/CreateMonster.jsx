import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import facade from "../apiFacade";
import styles from "./CreateMonster.module.css";

export default function CreateMonster() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [hp, setHp] = useState(60);
  const [attack, setAttack] = useState(8);
  const [defense, setDefense] = useState(3);
  const [area, setArea] = useState("Forest");
  const [spawnWeight, setSpawnWeight] = useState(10);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!facade.loggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const monster = {
      name: name.trim(),
      level: Number(level),
      hp: Number(hp),
      attack: Number(attack),
      defense: Number(defense),
      area: area.trim(),
      spawnWeight: Number(spawnWeight),
    };

    facade
      .createMonster(monster)
      .then((created) => {
        setSuccess(`Monster "${created.name || monster.name}" created!`);

        // Reset form for creating more monsters
        setName("");
        setLevel(1);
        setHp(60);
        setAttack(8);
        setDefense(3);
        setArea("Forest");
        setSpawnWeight(10);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to create monster");
        setLoading(false);
      });
  }

  function handlePopulate() {
    setError("");
    setSuccess("");
    setLoading(true);

    facade
      .populateMonsters()
      .then(() => {
        setSuccess("Database populated with default monsters");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to populate monsters");
        setLoading(false);
      });
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Create Monster</h1>
            <p className={styles.subtitle}>Add a new monster to the world. It can appear in battles!</p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handlePopulate}
              disabled={loading}
            >
              Populate defaults
            </button>

            <button type="button" className={styles.secondaryBtn} onClick={() => navigate("/")} disabled={loading}>
              Back home
            </button>
          </div>
        </header>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Name
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fire Slime"
              required
            />
          </label>

          <div className={styles.grid}>
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

            <label className={styles.label}>
              HP
              <input className={styles.input} type="number" min="1" value={hp} onChange={(e) => setHp(e.target.value)} />
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
              Area
              <input
                className={styles.input}
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Caves"
                required
              />
            </label>

            <label className={styles.label}>
              Spawn weight
              <input
                className={styles.input}
                type="number"
                min="0"
                value={spawnWeight}
                onChange={(e) => setSpawnWeight(e.target.value)}
              />
            </label>
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryBtn} type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Monster"}
            </button>

            <button
              className={styles.secondaryBtn}
              type="button"
              onClick={() => navigate("/monsters")}
              disabled={loading}
            >
              View Monster Codex
            </button>
          </div>
        </form>

        <div className={styles.note}>
          <strong>Tip:</strong> Battles use <em>spawnWeight</em> for weighted random selection.
        </div>
      </div>
    </main>
  );
}
