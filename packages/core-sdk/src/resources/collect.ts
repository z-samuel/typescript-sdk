import { AxiosInstance, AxiosResponse } from "axios";
import { ContractTransaction, Signer } from "ethers";

import {
  CollectIPAssetRequest,
  CollectIPAssetResponse,
  ListCollectionsRequest,
  ListCollectionsResponse,
} from "../types/resources/collect";
import { CollectModule } from "../abi/generated";
import { handleError } from "../utils/errors";

export class CollectClient {
  private readonly httpClient: AxiosInstance;
  private readonly signer: Signer;
  private readonly collectModuleContract: CollectModule;

  constructor(httpClient: AxiosInstance, signer: Signer, collectModule: CollectModule) {
    this.httpClient = httpClient;
    this.signer = signer;
    this.collectModuleContract = collectModule;
  }

  /**
   * List all collected IP Assets.
   *
   * @returns A Promise that resolves to the ListLicenseResponse.
   */
  public async list(request: ListCollectionsRequest): Promise<ListCollectionsResponse> {
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/collection?franchiseId=${request.franchiseId}`,
      );
      return response.data as ListCollectionsResponse;
    } catch (error: unknown) {
      handleError(error, `Failed to get collections`);
    }
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
