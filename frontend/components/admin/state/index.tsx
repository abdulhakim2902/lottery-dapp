import React, { useState } from "react";

import ShowIf from "@/components/common/show-if";

import styles from "./state.module.css";
import { useLottery } from "@/hooks/use-lottery.hook";
import { Duration } from "./duration";

interface Durations {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function LotteryState() {
  const [loading, setLoading] = useState<boolean>(false);
  const [reset, setReset] = useState<boolean>(false);
  const [closingTimeDuration, setClosingTimeDuration] = useState<number>(0);
  const [durations, setDurations] = useState<Durations>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { betsOpen, openBets } = useLottery();

  const { writeAsync } = openBets;

  const onChangeDuration = (duration: number, dimension: string) => {
    if (dimension === "Days") {
      const { hours, minutes, seconds } = durations;
      const total = duration + hours + minutes + seconds;

      setDurations({ ...durations, days: duration });
      setClosingTimeDuration(total);
      return;
    }

    if (dimension === "Hours") {
      const { days, minutes, seconds } = durations;
      const total = days + duration + minutes + seconds;

      setDurations({ ...durations, hours: duration });
      setClosingTimeDuration(total);
      return;
    }

    if (dimension === "Minutes") {
      const { days, hours, seconds } = durations;
      const total = days + hours + duration + seconds;

      setDurations({ ...durations, minutes: duration });
      setClosingTimeDuration(total);
      return;
    }

    const { days, hours, minutes } = durations;
    const total = days + hours + minutes + duration;

    setDurations({ ...durations, seconds: duration });
    setClosingTimeDuration(total);
  };

  const onReset = () => {
    setReset(true);
    setClosingTimeDuration(0);
    setDurations({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  };

  const onClear = (isClear: boolean) => {
    if (reset && isClear) setReset(false);
  };

  const onStart = async () => {
    setLoading(true);

    try {
      const closingTimeInMs = closingTimeDuration + Date.now();
      const closingTimeInS = Math.floor(closingTimeInMs / 1000);

      await writeAsync({ args: [closingTimeInS.toString()] });
      onReset();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>State</p>
      <p>{betsOpen ? "Bets is Open" : "Bets is Closed"}</p>

      <ShowIf condition={!betsOpen}>
        <div className={styles.duration}>
          <div className={styles.times}>
            <Duration
              dimension="Days"
              loading={loading}
              reset={reset}
              onClear={onClear}
              onChangeDuration={onChangeDuration}
            />
          </div>
          <div className={styles.times}>
            <Duration
              dimension="Hours"
              loading={loading}
              reset={reset}
              onClear={onClear}
              onChangeDuration={onChangeDuration}
            />
          </div>
          <div className={styles.times}>
            <Duration
              dimension="Minutes"
              loading={loading}
              reset={reset}
              onClear={onClear}
              onChangeDuration={onChangeDuration}
            />
          </div>
          <div className={styles.times}>
            <Duration
              dimension="Seconds"
              loading={loading}
              reset={reset}
              onClear={onClear}
              onChangeDuration={onChangeDuration}
            />
          </div>
        </div>
        <div>
          <button disabled={loading} onClick={onStart}>
            {loading ? "Starting..." : "Start"}
          </button>
          <button disabled={loading} onClick={onReset}>
            Reset
          </button>
        </div>
      </ShowIf>
    </div>
  );
}
