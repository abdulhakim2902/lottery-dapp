import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { formatEther, parseEther } from "viem";
import { useLottery } from "@/hooks/use-lottery.hook";
import { useToken } from "@/hooks/use-token.hook";
import { useAccount } from "wagmi";

import styles from "./balance.module.css";

export function Balance() {
  const [loading, setLoading] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [text, setText] = useState<string>("Return Token");
  const [amount, setAmount] = useState<string>("0");
  const [amountBN, setAmountBN] = useState<bigint>(BigInt(0));

  const { enqueueSnackbar } = useSnackbar();
  const { isDisconnected, isConnecting } = useAccount();
  const { contract, returnTokens, purchaseRatio } = useLottery();
  const { balance, approve, allowance, symbol } = useToken(contract);

  const { writeAsync: writeReturnTokens } = returnTokens;
  const { writeAsync: writeApprove } = approve;

  useEffect(() => {
    if (loading) {
      if (!approved) {
        setText("Approving...");
      } else {
        setText("Returning...");
      }
    } else {
      if (approved) {
        setText(`Return ${symbol} Token`);
      } else {
        setText("Approve");
      }
    }
  }, [approved, loading, symbol]);

  useEffect(() => {
    setApproved(allowance >= amountBN);
  }, [amountBN, allowance]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const amount = validateNumber(value);
    if (!amount) return;
    const amountBN = parseEther(amount as `${number}`);
    if (amountBN > balance) {
      return;
    }

    setAmount(amount);
    setAmountBN(amountBN);
  };

  const onApprove = async () => {
    setLoading(true);

    try {
      await writeApprove({ args: [contract, amountBN] });
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const onReturn = async () => {
    setLoading(true);

    try {
      await writeReturnTokens({ args: [amountBN] });
      setAmountBN(BigInt(0));
      setAmount("0");
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const onMouseLeave = () => {
    if (purchaseRatio <= 0) return;
    if (amountBN <= 0) return;
    enqueueSnackbar({
      variant: "info",
      message: `You will receive ${formatEther(amountBN / purchaseRatio)} ETH`,
    });
  };

  return (
    <div className={styles.container}>
      <p>
        Token Amount: {formatEther(balance)} {symbol}
      </p>
      <input
        style={{ marginBottom: "20px" }}
        value={amount}
        onChange={onChange}
        disabled={loading || isConnecting || isDisconnected}
        onMouseLeave={onMouseLeave}
      />
      <button
        disabled={loading || balance <= 0}
        onClick={approved ? onReturn : onApprove}
      >
        {text}
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
