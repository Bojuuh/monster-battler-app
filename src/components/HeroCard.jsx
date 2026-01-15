import styles from "./Card.module.css";

export default function HeroCard({ hero, currentHP, maxHP }) {
  // If no hero provided, show placeholder (used in HomePage)
  if (!hero) {
    return (
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div className={styles.level}>Lvl ?</div>
          <div className={styles.name}>Hero</div>
          <div className={styles.diamond}>♦</div>
        </div>

        <div className={styles.art}>
          <div className={styles.artEmoji}>🧙‍♂️</div>
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

  const name = hero.name || "Hero";
  const level = hero.level || 1;
  const attack = hero.attack || 0;
  const defense = hero.defense || 0;

  // Calculate HP percentage for the bar
  const safeCurrentHP = currentHP !== undefined ? currentHP : hero.hp || 100;
  const safeMaxHP = maxHP !== undefined ? maxHP : hero.hp || 100;
  const hpPercentage = Math.round((safeCurrentHP / safeMaxHP) * 100);

  return (
    <div className={styles.card}>
      {/* Header - Level, Name, Symbol */}
      <div className={styles.headerRow}>
        <div className={styles.level}>Lvl {level}</div>
        <div className={styles.name}>{name}</div>
        <div className={styles.diamond}>♦</div>
      </div>

      {/* Hero Artwork */}
      <div className={styles.art}>
        <div className={styles.artEmoji}>🧙‍♂️</div>
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
