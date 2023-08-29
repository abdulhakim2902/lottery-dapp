import React from "react";
import { LotteryState } from "./state";
import { ClosingTime } from "./closing-time";
import { OwnerBalance } from "./balance";

export function Admin() {
  return (
    <React.Fragment>
      <LotteryState />
      <ClosingTime />
      <OwnerBalance />
    </React.Fragment>
  );
}
