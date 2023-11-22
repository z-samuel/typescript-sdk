import { AxiosInstance, AxiosResponse } from "axios";
import { PublicClient } from "viem";

import {
  RelationshipGetRequest,
  RelationshipGetResponse,
  RelationshipListRequest,
  RelationshipListResponse,
} from "../types/resources/relationship";
import { isIntegerString } from "../utils/utils";
import { handleError } from "../utils/errors";

/**
 * Client for managing relationships.
 */
export class RelationshipReadOnlyClient {
  protected readonly httpClient: AxiosInstance;
  protected readonly rpcClient: PublicClient;

  constructor(httpClient: AxiosInstance, rpcClient: PublicClient) {
    this.httpClient = httpClient;
    this.rpcClient = rpcClient;
  }

  /**
   * Get a relationship by its ID.
   *
   * @param relationshipId - The ID of the relationship to retrieve.
   * @returns A Promise that resolves to the RelationshipGetResponse.
   */
  public async get(request: RelationshipGetRequest): Promise<RelationshipGetResponse> {
    try {
      if (!isIntegerString(request.relationshipId)) {
        throw new Error(
          `Invalid relationshipId. Must be an integer. But got: ${request.relationshipId}`,
        );
      }

      const response: AxiosResponse = await this.httpClient.get(
        `/protocol/relationship/${request.relationshipId}`,
      );

      return response.data as RelationshipGetResponse;
    } catch (error: unknown) {
      handleError(error, `Failed to get relationship`);
    }
  }

  /**
   * List all relationships.
   *
   * @returns A Promise that resolves to the RelationshipListResponse.
   */
  public async list(request: RelationshipListRequest): Promise<RelationshipListResponse> {
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/protocol/relationship`,
        request,
        {
          params: {
            contract:
              request?.contract ||
              process.env.IP_ASSET_REGISTRY_CONTRACT ||
              process.env.NEXT_PUBLIC_IP_ASSET_REGISTRY_CONTRACT,
            tokenId: request?.tokenId,
          },
        },
      );

      return response.data as RelationshipListResponse;
    } catch (error: unknown) {
      handleError(error, `Failed to list relationships`);
    }
  }
}
