import { AxiosInstance } from "axios";
import { getAddress, PublicClient, WalletClient, zeroAddress } from "viem";

import { RegisterIPOrgRequest, RegisterIPOrgResponse } from "../types/resources/IPOrg";
import { handleError } from "../utils/errors";
import { IPOrgReadOnlyClient } from "./ipOrgReadOnly";
import { ipOrgRegistryConfig } from "../abi/ipOrgRegistry.abi";
import { waitTxAndFilterLog } from "../utils/utils";

/**
 * IPOrgClient allows you to create, update, view, search IPOrgs on
 * Story Protocol.
 */
export class IPOrgClient extends IPOrgReadOnlyClient {
  private readonly wallet: WalletClient;

  constructor(httpClient: AxiosInstance, rpcClient: PublicClient, wallet: WalletClient) {
    super(httpClient, rpcClient);
    this.wallet = wallet;
  }

  /**
   * Register a IPOrg on Story Protocol based on the specified input IPOrg data.
   *
   * @param request - the request object that contains all data needed to create a IPOrg
   * @returns the response object that contains results from the create IPOrg action
   */
  public async register(request: RegisterIPOrgRequest): Promise<RegisterIPOrgResponse> {
    try {
      const { request: call } = await this.rpcClient.simulateContract({
        ...ipOrgRegistryConfig,
        functionName: "registerIpOrg",
        args: [
          getAddress(request.owner || zeroAddress),
          request.name,
          request.symbol,
          request.ipAssetTypes,
        ],
        account: this.wallet.account,
      });

      const txHash = await this.wallet.writeContract(call);
      if (request.txOptions?.waitForTransaction) {
        const targetLog = await waitTxAndFilterLog(this.rpcClient, txHash, {
          ...ipOrgRegistryConfig,
          eventName: "IPOrgRegistered",
        });
        return { txHash: txHash, ipOrgId: targetLog.args.ipAssetOrg_ };
      } else {
        return { txHash: txHash };
      }
    } catch (error: unknown) {
      handleError(error, "Failed to create IPOrg");
    }
  }
}
