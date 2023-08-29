import { useEffect, useState } from "react";
import { CountDown } from "@/components/count-down";
import { useLottery } from "@/hooks/use-lottery.hook";
import { useAccount } from "wagmi";

import ShowIf from "@/components/common/show-if";

import styles from "./timer.module.css";

export function Timer() {
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const { isDisconnected, isConnected, isConnecting } = useAccount();
  const { betsOpen, betsClosingTime, closeLottery } = useLottery();

  const { writeAsync } = closeLottery;

  const isCounting = startTime > 0 && endTime >= startTime;
  const isClose = betsOpen && startTime >= endTime;

  const onChange = (totalElapsedTime: number) => {
    const isDone = totalElapsedTime === endTime - startTime;
    if (isDone) {
      setEnabled(isDone);
      setStartTime((ts) => ts + 1000);
    }
  };

  const onClose = async () => {
    if (isDisconnected) return;
    setLoading(true);
    try {
      await writeAsync();
      setEnabled(false);
      setStartTime((ts) => ts + 1000);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEndTime(Number(betsClosingTime));
    setStartTime(Math.floor(Date.now() / 1000));
  }, [betsClosingTime, isConnected]);

  return (
    <div className={styles.container}>
      <ShowIf condition={!betsOpen}>
        <p className={styles.title}>Bets is Closed!</p>
      </ShowIf>
      <ShowIf condition={betsOpen}>
        <p className={styles.title}>Closing Time</p>
        <ShowIf condition={endTime < startTime}>
          <CountDown startTime={0} endTime={0} onChange={onChange} />
        </ShowIf>
        <ShowIf condition={betsOpen && isCounting}>
          <CountDown
            startTime={startTime}
            endTime={endTime}
            onChange={onChange}
          />
        </ShowIf>
        <ShowIf condition={enabled || isClose}>
          <button
            disabled={loading || isDisconnected || isConnecting}
            onClick={onClose}
          >
            {loading ? "Closing..." : "Close"}
          </button>
        </ShowIf>
      </ShowIf>
    </div>
  );
}
