import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useLottery } from "@/hooks/use-lottery.hook";
import { useAccount } from "wagmi";
import { useToken } from "@/hooks/use-token.hook";

import styles from "./prize.module.css";

export function Prize() {
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("0");
  const [amountBN, setAmountBN] = useState<bigint>(BigInt(0));

  const { isDisconnected, isConnecting } = useAccount();
  const {
    contract,
    prize,
    prizeWithdraw: { writeAsync },
  } = useLottery();
  const { symbol } = useToken(contract);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const amount = validateNumber(value);
    if (!amount) return;
    const amountBN = parseEther(amount as `${number}`);
    if (amountBN > prize) {
      return;
    }

    setAmount(amount);
    setAmountBN(amountBN);
  };

  const onWithdraw = async () => {
    setLoading(true);

    try {
      await writeAsync({ args: [amountBN] });
      setAmountBN(BigInt(0));
      setAmount("0");
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <p>
        Prize: {formatEther(prize)} {symbol}
      </p>
      <input
        style={{ marginBottom: "20px" }}
        value={amount}
        onChange={onChange}
        disabled={loading || isConnecting || isDisconnected}
      />
      <button disabled={loading || prize <= 0} onClick={onWithdraw}>
        {loading ? "Claiming..." : "Claim Prize"}
      </button>
    </div>
  );
}

function validateNumber(value: string): string {
  const regex = new RegExp(/^\d*\.?\d*$/);
  if (!regex.exec(value)) {
    return "";
  }

  const values = value.split(".");
  if (values.length === 1) {
    return Number(values[0]).toString();
  }

  if (values[1] && values[1].length > 5) {
    return "";
  }

  return values.join(".");
}
