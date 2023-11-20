import { AxiosInstance } from "axios";
import { getAddress, PublicClient, toHex, WalletClient } from "viem";

import { RegisterIpAssetRequest, RegisterIpAssetResponse } from "../types/resources/ipAsset";
import { handleError } from "../utils/errors";
import { IPAssetReadOnlyClient } from "./ipAssetReadOnly";
import { ipAssetRegistryConfig } from "../abi/ipAssetRegistry.abi";
import { parseToBigInt, waitTxAndFilterLog } from "../utils/utils";

/**
 * IpAssetClient allows you to create, view, and list IP Assets on Story Protocol.
 */
export class IPAssetClient extends IPAssetReadOnlyClient {
  private readonly wallet: WalletClient;

  constructor(httpClient: AxiosInstance, rpcClient: PublicClient, wallet: WalletClient) {
    super(httpClient, rpcClient);
    this.wallet = wallet;
  }

  /**
   * Create an IP Asset on Story Protocol based on the specified input asset data.
   *
   * @param request - the request object that contains all data needed to create an IP Asset.
   * @returns the response object that contains results from the asset creation.
   */
  public async register(request: RegisterIpAssetRequest): Promise<RegisterIpAssetResponse> {
    try {
      const { request: call } = await this.rpcClient.simulateContract({
        ...ipAssetRegistryConfig,
        functionName: "registerIPAsset",
        args: [
          getAddress(request.ipOrgId),
          {
            owner: getAddress(request.owner),
            name: request.name,
            ipAssetType: parseToBigInt(request.type),
            hash: toHex(request.hash || "", { size: 32 }),
          },
          [],
          [],
        ],
        account: this.wallet.account,
      });

      const txHash = await this.wallet.writeContract(call);
      if (request.txOptions?.waitForTransaction) {
        const targetLog = await waitTxAndFilterLog(this.rpcClient, txHash, {
          ...ipAssetRegistryConfig,
          eventName: "IPAssetRegistered",
        });
        return { txHash: txHash, ipAssetId: targetLog.args.ipAssetId_.toString() };
      } else {
        return { txHash: txHash };
      }
    } catch (error) {
      handleError(error, "Failed to create IP Asset");
    }
  }
}
