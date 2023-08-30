import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useLottery } from "@/hooks/use-lottery.hook";

import styles from "./balance.module.css";

export function Pool() {
  const {
    ownerPool,
    ownerWithdraw: { writeAsync },
  } = useLottery();

  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("0");
  const [amountBN, setAmountBN] = useState<bigint>(BigInt(0));

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const amount = validateNumber(value);
    if (!amount) return;
    const amountBN = parseEther(amount as `${number}`);
    if (amountBN > ownerPool) {
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
    <div className={styles.row}>
      <p className={styles.title}>Owner pool</p>
      <p>Token Amount: {formatEther(ownerPool)}</p>
      <input value={amount} onChange={onChange} disabled={loading} />
      <button disabled={loading || ownerPool <= 0} onClick={onWithdraw}>
        {loading ? "Withdrawing..." : "Withdraw"}
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
