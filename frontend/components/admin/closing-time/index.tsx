import { useEffect, useState } from "react";
import { CountDown } from "@/components/count-down";
import { useLottery } from "@/hooks/use-lottery.hook";

import ShowIf from "@/components/common/show-if";

import styles from "./closing-time.module.css";

export function ClosingTime() {
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const { betsOpen, betsClosingTime, closeLottery } = useLottery();

  const { writeAsync } = closeLottery;

  useEffect(() => {
    setEndTime(Number(betsClosingTime));
    setStartTime(Math.floor(Date.now() / 1000));
  }, [betsClosingTime]);

  const onChange = (totalElapsedTime: number) => {
    const isDone = totalElapsedTime === endTime - startTime;
    if (isDone) {
      setEnabled(isDone);
      setStartTime((ts) => ts + 1000);
    }
  };

  const onClose = async () => {
    setLoading(true);

    try {
      await writeAsync();
      setEnabled(false);
      setStartTime((ts) => ts + 1000);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>Closing Time</p>
      <ShowIf condition={endTime > startTime}>
        <p>{new Date(endTime * 1000).toString()}</p>
      </ShowIf>
      <ShowIf condition={betsOpen && startTime > 0 && endTime >= startTime}>
        <CountDown
          startTime={startTime}
          endTime={endTime}
          onChange={onChange}
        />
      </ShowIf>
      <ShowIf condition={enabled || (betsOpen && startTime > endTime)}>
        <button disabled={loading} onClick={onClose}>
          {loading ? "Closing..." : "Close"}
        </button>
      </ShowIf>
      <ShowIf condition={!betsOpen && startTime > endTime}>
        <p style={{ marginTop: "10px" }}>N/A</p>
      </ShowIf>
    </div>
  );
}
