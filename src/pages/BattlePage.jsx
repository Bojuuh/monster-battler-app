import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import facade from "../apiFacade";
import styles from "./BattlePage.module.css";
import HeroCard from "../components/HeroCard";
import MonsterCard from "../components/MonsterCard";

export default function BattlePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get hero from route state (passed from CreateHero)
  const hero = location.state?.hero;

  // State for battle data
  const [monster, setMonster] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for turn playback
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Load battle when component mounts
  useEffect(() => {
    // Redirect if not logged in
    if (!facade.loggedIn()) {
      navigate("/login");
      return;
    }

    // Redirect if no hero provided
    if (!hero) {
      navigate("/");
      return;
    }

    // Load battle data
    async function loadBattle() {
      try {
        setLoading(true);
        setError("");

        // 1. Get monsters from API
        let monsters = await facade.getMonsters();

        // If no monsters, populate defaults and fetch again
        if (!monsters || monsters.length === 0) {
          await facade.populateMonsters();
          monsters = await facade.getMonsters();
        }

        // 2. Pick random monster
        const randomIndex = Math.floor(Math.random() * monsters.length);
        const selectedMonster = monsters[randomIndex];
        setMonster(selectedMonster);

        // 3. Start battle in backend
        const battleSummary = await facade.startBattle(hero.id, selectedMonster.id);

        // 4. Get battle details with logs
        const battleDetails = await facade.getBattleDetails(battleSummary.id);
        setBattleLog(battleDetails.logs || []);

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to start battle");
        setLoading(false);
      }
    }

    loadBattle();
  }, [hero, navigate]);

  // Auto-play effect - advances turn every 650ms and stops at end
  useEffect(() => {
    // Don't run if auto-play is off
    if (!isAutoPlaying) return;

    // Stop auto-play if we've shown all turns
    if (currentTurn >= battleLog.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAutoPlaying(false);
      return;
    }

    // Set timer to show next turn
    const timer = setTimeout(() => {
      setCurrentTurn((prev) => prev + 1);
    }, 650);

    // Cleanup timer on unmount or before next effect
    return () => clearTimeout(timer);
  }, [isAutoPlaying, currentTurn, battleLog.length]);

  // Calculate current HP based on turns shown so far
  function getCurrentHP(characterName, maxHP) {
    let hp = maxHP;

    // Process only the turns we've shown
    const visibleTurns = battleLog.slice(0, currentTurn);

    for (const turn of visibleTurns) {
      if (turn.defender === characterName) {
        hp = turn.defenderHpAfter;
      }
    }

    return Math.max(0, hp);
  }

  // Event handlers
  function handleNextTurn() {
    if (currentTurn < battleLog.length) {
      setCurrentTurn((prev) => prev + 1);
    }
  }

  function handleToggleAutoPlay() {
    setIsAutoPlaying((prev) => !prev);
  }

  function handleNewBattle() {
    // Reset all state
    setCurrentTurn(0);
    setIsAutoPlaying(false);
    setBattleLog([]);
    setMonster(null);
    setLoading(true);
    setError("");

    // Start new battle
    async function startNewBattle() {
      try {
        // 1. Get monsters
        let monsters = await facade.getMonsters();

        if (!monsters || monsters.length === 0) {
          await facade.populateMonsters();
          monsters = await facade.getMonsters();
        }

        // 2. Pick random monster
        const randomIndex = Math.floor(Math.random() * monsters.length);
        const selectedMonster = monsters[randomIndex];
        setMonster(selectedMonster);

        // 3. Start battle
        const battleSummary = await facade.startBattle(hero.id, selectedMonster.id);

        // 4. Get battle details
        const battleDetails = await facade.getBattleDetails(battleSummary.id);
        setBattleLog(battleDetails.logs || []);

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to start new battle");
        setLoading(false);
      }
    }

    startNewBattle();
  }

  // --- RENDER ---

  // Loading state
  if (loading) {
    return (
      <main className={styles.page}>
        <p>Starting battle...</p>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <h2>Battle Error</h2>
          <p className={styles.error}>{error}</p>
          <button className={styles.primaryBtn} onClick={() => navigate("/heroes/create")}>
            Create New Hero
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  // Safety check
  if (!monster || !hero) {
    return null;
  }

  // Calculate display values
  const heroCurrentHP = getCurrentHP(hero.name, hero.hp);
  const monsterCurrentHP = getCurrentHP(monster.name, monster.hp);
  const battleFinished = currentTurn >= battleLog.length && battleLog.length > 0;
  const visibleLog = battleLog.slice(0, currentTurn);
  const winner = heroCurrentHP > 0 ? hero.name : monster.name;

  // Main battle UI
  return (
    <main className={styles.page}>
      {/* Battle Arena - Hero vs Monster */}
      <div className={styles.grid}>
        <HeroCard hero={hero} currentHP={heroCurrentHP} maxHP={hero.hp} />

        <div className={styles.vs}>VS</div>

        <MonsterCard monster={monster} currentHP={monsterCurrentHP} maxHP={monster.hp} />
      </div>

      {/* Battle Controls */}
      <section className={styles.actions}>
        <div className={styles.turn}>
          Turn: <strong>{currentTurn}</strong> / {battleLog.length}
          {battleFinished && (
            <>
              {" "}
              • Winner: <strong>{winner}</strong>
            </>
          )}
        </div>

        {!battleFinished && <div style={{ opacity: 0.85 }}>Battle in progress...</div>}

        <button
          className={styles.primaryBtn}
          onClick={handleNextTurn}
          disabled={currentTurn >= battleLog.length}
        >
          Next Turn
        </button>

        <button
          className={styles.secondaryBtn}
          onClick={handleToggleAutoPlay}
          disabled={battleFinished}
        >
          {isAutoPlaying ? "Stop Auto" : "Auto Play"}
        </button>

        <button className={styles.secondaryBtn} onClick={handleNewBattle}>
          New Battle
        </button>

        <button className={styles.secondaryBtn} onClick={() => navigate("/")}>
          Back Home
        </button>
      </section>

      {/* Battle Log */}
      <section className={styles.log}>
        <h3>
          Battle Log ({currentTurn}/{battleLog.length})
        </h3>

        {visibleLog.length === 0 ? (
          <p style={{ opacity: 0.85 }}>No turns shown yet. Click "Next Turn" or "Auto Play"</p>
        ) : (
          <ul className={styles.logList}>
            {visibleLog.map((entry) => (
              <li key={entry.turnNumber}>
                <strong>Turn {entry.turnNumber}:</strong> {entry.attacker} hit {entry.defender} for{" "}
                <strong>{entry.damage}</strong> damage ({entry.defender} HP:{" "}
                <strong>{entry.defenderHpAfter}</strong>)
              </li>
            ))}
          </ul>
        )}

        {battleFinished && (
          <p style={{ opacity: 0.85, marginTop: "0.8rem" }}>
            Battle finished! {winner} wins!
          </p>
        )}
      </section>
    </main>
  );
}
