import { AxiosInstance } from "axios";

import {
  GetIpAssetRequest,
  GetIpAssetResponse,
  ListIpAssetRequest,
  ListIpAssetResponse,
} from "../types/resources/ipAsset";
import { handleError } from "../utils/errors";
import { isIntegerString } from "../utils/utils";
import { FranchiseRegistry } from "../abi/generated";

/**
 * IpAssetClient allows you to create, view, and list IP Assets on Story Protocol.
 */
export class IPAssetReadOnlyClient {
  protected readonly httpClient: AxiosInstance;
  protected readonly franchiseRegistry: FranchiseRegistry;

  constructor(httpClient: AxiosInstance, franchiseRegistry: FranchiseRegistry) {
    this.httpClient = httpClient;
    this.franchiseRegistry = franchiseRegistry;
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
