import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import HeroCard from "../components/HeroCard";
import MonsterCard from "../components/MonsterCard";
import facade from "../apiFacade";

export default function HomePage() {
  const navigate = useNavigate();

  function handleGetStarted() {
    if (facade.loggedIn()) {
      navigate("/heroes/create");
    } else {
      navigate("/login");
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.previewRow}>
        <HeroCard hero={null} />
        <div className={styles.vs}>VS</div>
        <MonsterCard monster={null} />
      </section>

      <section className={styles.cta}>
        <div>
          <h1 className={styles.title}>Create your hero and start your journey!</h1>
          <p className={styles.subtitle}>Build your character, face monsters, and track your battles.</p>
        </div>

        <button className={styles.startBtn} onClick={handleGetStarted} type="button">
          Get started!
        </button>
      </section>
    </main>
  );
}
