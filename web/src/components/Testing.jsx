import { test } from "../constants";
import styles from "../style";
import Test from "./Test";

const Testing = () => (
  <section id="clients" className={`${styles.paddingY} ${styles.flexCenter} flex-col relative `}>
    <div className="absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient bottom-40" />

    <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-16 mb-6 relative z-[1]">
      <h2 className={styles.heading2} style={{textAlign: "center"}}>
        Measure your abilities with our <br className="sm:block hidden" /> cognitive tests
      </h2>
    </div>

    <div className="grid grid-cols-4 gap-2 sm:justify-start justify-center w-full test-container relative z-[1]">
      {test.map((card) => <Test key={card.id} path={card.id} {...card} />)}
    </div>
  </section>
);

export default Testing;