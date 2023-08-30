import React from "react";
import { useLottery } from "@/hooks/use-lottery.hook";
import { formatEther } from "viem";
import { useToken } from "@/hooks/use-token.hook";

import styles from "./pool-info.module.css";
import ShowIf from "../common/show-if";

export default function PoolInfo() {
  const {
    contract,
    betFee,
    betPrize,
    prizePool,
    betsClosingTime,
    betsOpen,
    events,
  } = useLottery();
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
      <ShowIf condition={betsOpen && events.length > 0}>
        <p>Records:</p>
        <React.Fragment>
          <table className={styles.table_container}>
            <thead>
              <tr>
                <th>Address</th>
                <th>Total Bet</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => {
                return (
                  <tr key={index}>
                    <td>{event.sender}</td>
                    <td>{event.totalBet}</td>
                    <td>{new Date(event.timestamp).toString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </React.Fragment>
      </ShowIf>
    </div>
  );
}
