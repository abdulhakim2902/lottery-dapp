import { useLottery } from "@/hooks/use-lottery.hook";
import { formatEther } from "viem";
import { useToken } from "@/hooks/use-token.hook";

import styles from "./pool-info.module.css";
import ShowIf from "../common/show-if";

export default function PoolInfo() {
  const { contract, betFee, betPrize, prizePool, betsClosingTime, betsOpen } =
    useLottery();
  const { symbol } = useToken(contract);

  return (
    <div className={styles.container}>
      <h4>Pool Info</h4>
      <p>
        Bet Size: {formatEther(betPrize)} {symbol}
      </p>
      <p>
        Bet Fee: {formatEther(betFee)} {symbol}
      </p>
      <p>
        Total Prize: {formatEther(prizePool)} {symbol}
      </p>
      <ShowIf condition={betsOpen}>
        <p>
          Closing Date: {new Date(Number(betsClosingTime) * 1000).toString()}
        </p>
      </ShowIf>
    </div>
  );
}
