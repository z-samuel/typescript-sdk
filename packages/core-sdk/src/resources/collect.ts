import { AxiosInstance } from "axios";
import { ContractTransaction, Signer } from "ethers";

import { CollectIPAssetRequest, CollectIPAssetResponse } from "../types/resources/collect";
import { CollectModule } from "../abi/generated";
import { handleError } from "../utils/errors";
import { CollectReadOnlyClient } from "./collectReadOnly";

export class CollectClient extends CollectReadOnlyClient {
  private readonly signer: Signer;

  constructor(httpClient: AxiosInstance, signer: Signer, collectModule: CollectModule) {
    super(httpClient, collectModule);
    this.signer = signer;
  }

  /**
   * Collect an IP Asset on Story Protocol based on the specified input collect data.
   *
   * @param request - the request object that contains all data needed to collect an IP Asset
   * @returns the response object that contains results from the create franchise action
   */
  public async collect(request: CollectIPAssetRequest): Promise<CollectIPAssetResponse> {
    try {
      const response: ContractTransaction = await this.collectModuleContract.collect({
        franchiseId: request.franchiseId,
        ipAssetId: request.ipAssetId,
        collector: request.collector,
        collectData: "0x",
        collectNFTInitData: "0x",
        collectNFTData: "0x",
      });

      return {
        txHash: response.hash,
      };
    } catch (error: unknown) {
      handleError(error, "Failed to collect IP Asset");
    }
  }
}
