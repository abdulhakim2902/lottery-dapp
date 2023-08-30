import { BuyToken } from "./buy";
import { Timer } from "./timer";
import { Balance } from "./balance";
import { useAccount } from "wagmi";
import { useLottery } from "@/hooks/use-lottery.hook";
import { useToken } from "@/hooks/use-token.hook";
import { Prize } from "./prize";

import ShowIf from "../common/show-if";

import dynamic from "next/dynamic";
import styles from "./action.module.css";

const PlaceBets = dynamic(() => import("./bets"), { ssr: false });

export default function Action() {
  const { isDisconnected, isConnecting } = useAccount();
  const { contract, betsOpen } = useLottery();
  const { balance } = useToken(contract);

  const canPlaceBets = betsOpen && balance > 0;
  const isShow = canPlaceBets || isDisconnected || isConnecting;

  return (
    <div className={styles.container}>
      <h4>Action</h4>
      <div className={styles.action_container}>
        <div className={styles.time_container}>
          <Timer />
        </div>
        <div className={styles.bets_container}>
          <BuyToken />
          <ShowIf condition={isShow}>
            <PlaceBets />
          </ShowIf>
        </div>
        <div className={styles.balance_container}>
          <Prize />
          <Balance />
        </div>
      </div>
    </div>
  );
}
