// MonsterCard.jsx - SIMPLIFIED & SAFE VERSION
// Same structure as HeroCard for consistency

import styles from "./Card.module.css";

export default function MonsterCard({ monster, currentHP, maxHP }) {
  // If no monster provided, show placeholder (used in HomePage)
  if (!monster) {
    return (
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div className={styles.level}>Lvl ?</div>
          <div className={styles.name}>Monster</div>
          <div className={styles.diamond}>♦</div>
        </div>

        <div className={styles.art}>
          <div className={styles.artEmoji}>👹</div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>ATK</span>
            <span className={styles.statValue}>?</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>DEF</span>
            <span className={styles.statValue}>?</span>
          </div>
        </div>

        <div className={styles.hpRow}>
          <div className={styles.hpLabel}>HP</div>
          <div className={styles.hpBar}>
            <div className={styles.hpFill} style={{ width: "100%" }} />
          </div>
          <div className={styles.hpText}>? / ?</div>
        </div>
      </div>
    );
  }

  // Extract monster properties with simple defaults
  const name = monster.name || "Unknown Monster";
  const level = monster.level || 1;
  const attack = monster.attack || 0;
  const defense = monster.defense || 0;

  // Calculate HP percentage for the bar
  // Use provided values or defaults
  const safeCurrentHP = currentHP !== undefined ? currentHP : monster.hp || 80;
  const safeMaxHP = maxHP !== undefined ? maxHP : monster.hp || 80;
  const hpPercentage = Math.round((safeCurrentHP / safeMaxHP) * 100);

  return (
    <div className={styles.card}>
      {/* Header - Level, Name, Symbol */}
      <div className={styles.headerRow}>
        <div className={styles.level}>Lvl {level}</div>
        <div className={styles.name}>{name}</div>
        <div className={styles.diamond}>♦</div>
      </div>

      {/* Monster Artwork */}
      <div className={styles.art}>
        <div className={styles.artEmoji}>👹</div>
      </div>

      {/* Stats - Attack and Defense */}
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>ATK</span>
          <span className={styles.statValue}>{attack}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>DEF</span>
          <span className={styles.statValue}>{defense}</span>
        </div>
      </div>

      {/* HP Bar */}
      <div className={styles.hpRow}>
        <div className={styles.hpLabel}>HP</div>
        <div className={styles.hpBar}>
          <div className={styles.hpFill} style={{ width: `${hpPercentage}%` }} />
        </div>
        <div className={styles.hpText}>
          {safeCurrentHP} / {safeMaxHP}
        </div>
      </div>
    </div>
  );
}
