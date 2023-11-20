import { Hash } from "viem/types/misc";
import { DecodeEventLogReturnType } from "viem/_types/utils/abi/decodeEventLog";
import { Abi, decodeEventLog, PublicClient } from "viem";
import { Hex } from "viem/_types/types/misc";
import { InferEventName } from "viem/types/contract";

export function isIntegerString(s: string): boolean {
  const num = Number(s);
  return !isNaN(num) && parseInt(s, 10) === num;
}

export function parseToBigInt(num: string | number): bigint {
  return BigInt(num);
}

export function fileToBase64(file: File | Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // convert file to base64
    if (file instanceof Buffer) {
      resolve(file.toString("base64"));
      return;
    }

    if (file instanceof File) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result?.toString().split(",")[1];
        if (base64) {
          resolve(base64);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
      return;
    }

    reject(new Error("Invalid file type"));
  });
}

export async function waitTxAndFilterLog<
  const TAbi extends Abi | readonly unknown[],
  TEventName extends string | undefined = undefined,
  TTopics extends Hex[] = Hex[],
  TData extends Hex | undefined = undefined,
  TStrict extends boolean = true,
>(
  client: PublicClient,
  txHash: Hash,
  params: {
    abi: TAbi;
    eventName: InferEventName<TAbi, TEventName>;
    confirmations?: number;
    pollingInterval?: number;
    timeout?: number;
  },
): Promise<DecodeEventLogReturnType<TAbi, TEventName, TTopics, TData, TStrict>> {
  const txReceipt = await client.waitForTransactionReceipt({
    hash: txHash,
    confirmations: params.confirmations,
    pollingInterval: params.pollingInterval,
    timeout: params.timeout,
  });

  for (const log of txReceipt.logs) {
    try {
      return decodeEventLog<TAbi, TEventName, TTopics, TData, TStrict>({
        abi: params.abi,
        eventName: params.eventName,
        data: log.data as TData,
        topics: log.topics as [signature: Hex, ...args: TTopics],
      });
    } catch (e) {
      // no action
    }
  }

  throw new Error(`not found event ${params.eventName} in target transaction`);
}
