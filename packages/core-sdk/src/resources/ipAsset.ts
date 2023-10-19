import { AxiosInstance } from "axios";
import { Signer } from "ethers";

import {
  GetIpAssetRequest,
  GetIpAssetResponse,
  CreateIpAssetRequest,
  CreateIpAssetResponse,
  ListIpAssetRequest,
  ListIpAssetResponse,
} from "../types/resources/ipAsset";
import { handleError } from "../utils/errors";
import { isIntegerString } from "../utils/utils";
import { FranchiseRegistry, IpAssetRegistry__factory } from "../abi/generated";
import { IpAssetRegistry } from "../abi/generated";

/**
 * IpAssetClient allows you to create, view, and list IP Assets on Story Protocol.
 */
export class IPAssetClient {
  private readonly httpClient: AxiosInstance;
  private readonly franchiseRegistry: FranchiseRegistry;
  private readonly signer: Signer;

  constructor(httpClient: AxiosInstance, franchiseRegistry: FranchiseRegistry, signer: Signer) {
    this.httpClient = httpClient;
    this.franchiseRegistry = franchiseRegistry;
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
   * Get an IP Asset based on the specified IP asset ID.
   *
   * @param request - the request object for getting an IP Asset.
   * @returns the response object the contains the fetched IP Asset.
   */
  public async get(request: GetIpAssetRequest): Promise<GetIpAssetResponse> {
    try {
      if (!isIntegerString(request.ipAssetId)) {
        throw new Error(`Invalid IP Asset id. Must be an integer. But get: ${request.ipAssetId}`);
      }

      const response = await this.httpClient.get(
        `/ipasset/${request.ipAssetId}?franchiseId=${request.franchiseId}`,
      );
      return response.data as GetIpAssetResponse;
    } catch (error: unknown) {
      handleError(error, "Failed to get IP Asset");
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

  /**
   * List all IP assets.
   *
   * @returns the response object that contains results from listing query.
   */
  public async list(request: ListIpAssetRequest): Promise<ListIpAssetResponse> {
    try {
      const response = await this.httpClient.get(`/ipasset?franchiseId=${request.franchiseId}`);
      return response.data as ListIpAssetResponse;
    } catch (error) {
      handleError(error, "Failed to list IP Asset.");
    }
  }
}
