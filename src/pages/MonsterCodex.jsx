// MonsterCodex.jsx - SIMPLIFIED VERSION
// Display all monsters with search, filter, and sort

import { useEffect, useState } from "react";
import facade from "../apiFacade";
import styles from "./MonsterCodex.module.css";

export default function MonsterCodex() {
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [sortBy, setSortBy] = useState("LEVEL_DESC");

  // Load monsters on mount
  useEffect(() => {
    facade
      .getMonsters()
      .then((data) => {
        setMonsters(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load monsters");
        setLoading(false);
      });
  }, []);

  // Get unique areas from monsters
  function getAreas() {
    const uniqueAreas = new Set(monsters.map((m) => m.area).filter(Boolean));
    return ["ALL", ...Array.from(uniqueAreas).sort()];
  }

  // Filter and sort monsters
  function getFilteredMonsters() {
    const query = searchQuery.trim().toLowerCase();

    // Filter by name and area
    let filtered = monsters.filter((m) => {
      const matchesName = !query || m.name.toLowerCase().includes(query);
      const matchesArea = selectedArea === "ALL" || m.area === selectedArea;
      return matchesName && matchesArea;
    });

    // Sort
    if (sortBy === "LEVEL_DESC") {
      filtered.sort((a, b) => b.level - a.level);
    } else if (sortBy === "WEIGHT_DESC") {
      filtered.sort((a, b) => b.spawnWeight - a.spawnWeight);
    } else if (sortBy === "NAME_ASC") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }

  const areas = getAreas();
  const filteredMonsters = getFilteredMonsters();

  // Loading state
  if (loading) {
    return (
      <main className={styles.page}>
        <p>Loading monsters...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Monster Codex</h1>
          <p className={styles.subtitle}>All monsters currently available in the world.</p>
        </div>

        <div className={styles.controls}>
          <input
            className={styles.input}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name..."
          />

          <select className={styles.select} value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <select className={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="LEVEL_DESC">Sort: Level (high → low)</option>
            <option value="WEIGHT_DESC">Sort: Spawn weight (high → low)</option>
            <option value="NAME_ASC">Sort: Name (A → Z)</option>
          </select>
        </div>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {filteredMonsters.map((m) => (
          <article key={m.id} className={styles.card}>
            <div className={styles.cardTop}>
              <h2 className={styles.name}>{m.name || "Unnamed Monster"}</h2>
              <span className={styles.badge}>Lvl {m.level || 1}</span>
            </div>

            <p className={styles.meta}>
              <strong>Area:</strong> {m.area || "Unknown"} • <strong>Weight:</strong> {m.spawnWeight || 0}
            </p>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>HP</span>
                <span className={styles.statValue}>{m.hp || "-"}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>ATK</span>
                <span className={styles.statValue}>{m.attack || "-"}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>DEF</span>
                <span className={styles.statValue}>{m.defense || "-"}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!error && filteredMonsters.length === 0 && <p className={styles.empty}>No monsters match your filters.</p>}
    </main>
  );
}
