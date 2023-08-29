import React from "react";
import { ConnectKitButton } from "connectkit";

import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.leftContent}>
        <a
          className={styles.button}
          href="https://github.com/consensus-collective/lottery-dapp"
          target={"_blank"}
        >
          <p>Github Repository</p>
        </a>
      </div>
      <div className={styles.rightContent}>
        <ConnectKitButton />
      </div>
    </nav>
  );
}
