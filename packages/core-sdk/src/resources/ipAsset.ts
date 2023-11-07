import { AxiosInstance } from "axios";
import { Signer } from "ethers";

import { CreateIpAssetRequest, CreateIpAssetResponse } from "../types/resources/ipAsset";
import { handleError } from "../utils/errors";
import { isIntegerString } from "../utils/utils";
import { FranchiseRegistry, IpAssetRegistry__factory } from "../abi/generated";
import { IpAssetRegistry } from "../abi/generated";
import { IPAssetReadOnlyClient } from "./ipAssetReadOnly";

/**
 * IpAssetClient allows you to create, view, and list IP Assets on Story Protocol.
 */
export class IPAssetClient extends IPAssetReadOnlyClient {
  private readonly signer: Signer;

  constructor(httpClient: AxiosInstance, franchiseRegistry: FranchiseRegistry, signer: Signer) {
    super(httpClient, franchiseRegistry);
    this.signer = signer;
  }

  /**
   * Get the ipAssetRegistry associated with a franchiseId.
   *
   * @returns the response object that contains the requested ipAssetRegistry.
   */
  private async getRegistry(franchiseId: string): Promise<IpAssetRegistry> {
    try {
      const address = await this.franchiseRegistry.ipAssetRegistryForId(franchiseId);
      const ipAssetRegistry = IpAssetRegistry__factory.connect(address, this.signer);
      return ipAssetRegistry;
    } catch (error) {
      handleError(error, "Failed to retrieve IP Asset Registry");
    }
  }

  /**
   * Create an IP Asset on Story Protocol based on the specified input asset data.
   *
   * @param request - the request object that contains all data needed to create an IP Asset.
   * @returns the response object that contains results from the asset creation.
   */
  public async create(request: CreateIpAssetRequest): Promise<CreateIpAssetResponse> {
    try {
      const franchiseId = request.franchiseId;
      if (!isIntegerString(franchiseId)) {
        throw new Error(
          `Invalid franchise ID for IP asset creation. Must be an integer, but got: ${request.franchiseId}`,
        );
      }
      const ipAssetRegistry = await this.getRegistry(franchiseId);
      const response = await ipAssetRegistry.createIPAsset(
        request.ipAssetType,
        request.ipAssetName,
        request.description,
        request.mediaUrl,
        request.to,
        request.parentIpAssetId,
      );

      return {
        txHash: response.hash,
      };
    } catch (error) {
      handleError(error, "Failed to create IP Asset");
    }
  }
}
