import React, { useEffect, useState } from "react";

interface DurationProps {
  dimension: string;
  loading: boolean;
  reset: boolean;
  onClear: (isClear: boolean) => void;
  onChangeDuration: (duration: number, dimension: string) => void;
}

export function Duration(props: DurationProps) {
  const { dimension, loading, onChangeDuration, reset, onClear } = props;

  const [duration, setDuration] = useState<string>("0");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const currentDuration = validateNumber(value, dimension);
    if (!currentDuration) {
      return;
    }

    let durationInMs = 0;
    switch (dimension) {
      case "Days":
        if (+currentDuration > 7) return
        durationInMs = +currentDuration * 24 * 60 * 60 * 1000;
        break;
      case "Hours":
        durationInMs = +currentDuration * 60 * 60 * 1000;
        break;
      case "Minutes":
        durationInMs = +currentDuration * 60 * 1000;
        break;
      default:
        durationInMs = +currentDuration * 1000;
    }

    setDuration(currentDuration);
    onChangeDuration(durationInMs, dimension);
  };

  useEffect(() => {
    if (!reset) return;
    setDuration("0");
    onClear(true);
  }, [reset]);

  return (
    <React.Fragment>
      <p>{dimension}</p>
      <input
        style={{ width: "50%" }}
        value={duration}
        onChange={onChange}
        disabled={loading}
      />
    </React.Fragment>
  );
}

function validateNumber(value: string, dimension: string): string {
  const regex = new RegExp(/^\d*$/);
  if (!regex.exec(value)) {
    return "";
  }

  const duration = Number(value);

  switch (dimension) {
    case "Days":
      break;
    case "Hours":
      if (duration > 23) return "";
      break;
    case "Minutes":
    case "Seconds":
      if (duration > 59) return "";
      break;
    default:
      return "";
  }

  return duration.toString();
}
