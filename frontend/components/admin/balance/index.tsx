import { Balance } from "./balance";
import { Pool } from "./pool";

import styles from "./balance.module.css";

export function OwnerBalance() {
  return (
    <div className={styles.container}>
      <Pool />
      <Balance />
    </div>
  );
}
