import { useEffect, useState } from "react";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { useSnackbar } from "notistack";
import { waitForTransaction } from "@wagmi/core";
import { ExplorerURL } from "@/components/common/explorer-url";

import LOTTERY from "@/artifacts/lottery.json";
import { decodeEventLog } from "viem";

const LOTTERY_CONTRACT = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT;

interface ContractData {
  data?: bigint;
}

interface Event {
  sender: string;
  totalBet: string;
  timestamp: number;
}

export function useLottery() {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalBet, setTotalBet] = useState<bigint>(BigInt(0));

  const { enqueueSnackbar } = useSnackbar();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const betPrice = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "betPrice",
    args: [],
    watch: true,
  });

  const betFee = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "betFee",
    args: [],
    watch: true,
  });

  const betsOpen = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "betsOpen",
    args: [],
    watch: true,
  });

  const ownerPool = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "ownerPool",
    args: [],
    watch: true,
  });

  const betsClosingTime = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "betsClosingTime",
    args: [],
    watch: true,
  });

  const purchaseRatio = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "purchaseRatio",
    args: [],
    watch: true,
  });

  const owner = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "owner",
    args: [],
  });

  const prize = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "prize",
    args: [address ?? LOTTERY_CONTRACT],
    watch: true,
  });

  const prizePool = useContractRead({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi as any,
    functionName: "prizePool",
    args: [],
    watch: true,
  });

  const onError = (error: any) => {
    enqueueSnackbar({
      variant: "error",
      message: error.name,
    });
  };

  const onSuccess = async (data: any) => {
    const { hash } = data;
    const { transactionHash } = await waitForTransaction({ hash });

    const explorer = chain?.blockExplorers?.default.url;
    if (!explorer) return;
    const url = `${explorer}/tx/${transactionHash}`;

    enqueueSnackbar({
      message: "TransactionSucceed",
      variant: "success",
      persist: true,
      action: (id) => ExplorerURL({ href: url, snackbarId: id }),
    });
  };

  const openBets = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "openBets",
    onError,
    onSuccess,
  });

  const ownerWithdraw = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "ownerWithdraw",
    onError,
    onSuccess,
  });

  const prizeWithdraw = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "prizeWithdraw",
    onError,
    onSuccess,
  });

  const closeLottery = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "closeLottery",
    onError,
    onSuccess,
  });

  const returnTokens = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "returnTokens",
    onError,
    onSuccess,
  });

  const purchaseTokens = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "purchaseTokens",
    onError,
    onSuccess,
  });

  const bet = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "bet",
    onError,
    onSuccess,
  });

  const betMany = useContractWrite({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    functionName: "betMany",
    onError,
    onSuccess,
  });

  const unwatch = useContractEvent({
    address: LOTTERY_CONTRACT as `0x${string}`,
    abi: LOTTERY.abi,
    eventName: "PlaceBets",
    listener: (logs) => {
      logs.forEach((log) => {
        const result = decodeEventLog({
          abi: LOTTERY.abi,
          data: log.data,
          topics: log.topics,
          eventName: "PlaceBets",
        });

        const newEvent = {
          sender: (result.args as any).sender,
          totalBet: (result.args as any).totalBet.toString(),
          timestamp: Date.now(),
        };

        setEvents((events) => [newEvent, ...events].slice(0, 11));
      });

      unwatch?.();
    },
  });

  useEffect(() => {
    const fee = betFee as ContractData;
    const price = betPrice as ContractData;
    const total = (fee?.data ?? BigInt(0)) + (price?.data ?? BigInt(0));
    setTotalBet(total);
  }, [betFee, betPrice]);

  return {
    contract: LOTTERY_CONTRACT as `0x${string}`,
    bet,
    betMany,
    openBets,
    ownerWithdraw,
    prizeWithdraw,
    closeLottery,
    returnTokens,
    purchaseTokens,
    totalBet,
    betFee: (betFee as ContractData)?.data ?? BigInt(0),
    betPrize: (betPrice as ContractData)?.data ?? BigInt(0),
    betsOpen: Boolean(betsOpen?.data),
    ownerPool: (ownerPool as ContractData)?.data ?? BigInt(0),
    betsClosingTime: (betsClosingTime as ContractData)?.data ?? BigInt(0),
    purchaseRatio: (purchaseRatio as ContractData)?.data ?? BigInt(0),
    owner: owner?.data ?? "",
    prize: (prize as ContractData)?.data ?? BigInt(0),
    prizePool: (prizePool as ContractData)?.data ?? BigInt(0),
    events,
  };
}
