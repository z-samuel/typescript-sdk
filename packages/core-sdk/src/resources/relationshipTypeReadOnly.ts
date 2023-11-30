import { AxiosInstance, AxiosResponse } from "axios";
import { PublicClient } from "viem";

import {
  GetRelationshipTypeRequest,
  GetRelationshipTypeResponse,
  ListRelationshipTypesRequest,
  ListRelationshipTypesResponse,
} from "../types/resources/relationshipType";
import { dictToQueryParams } from "../utils/utils";
import { handleError } from "../utils/errors";
/**
 * Client for managing RelationshipTypes.
 */
export class RelationshipTypeReadOnlyClient {
  protected readonly httpClient: AxiosInstance;
  protected readonly rpcClient: PublicClient;

  constructor(httpClient: AxiosInstance, rpcClient: PublicClient) {
    this.httpClient = httpClient;
    this.rpcClient = rpcClient;
  }

  /**
   * Get a RelationshipType by ipOrgId or relType.
   *
   * @param ipOrgId - The ID of the IP Org.
   * @param relType - Relationship Type.
   * @returns A Promise that resolves to the GetRelationshipTypeResponse.
   */
  public async get(request: GetRelationshipTypeRequest): Promise<GetRelationshipTypeResponse> {
    try {
      const params = dictToQueryParams(request);
      const response: AxiosResponse = await this.httpClient.get(
        `/protocol/relationship-type?${params}`,
      );

      return response.data as GetRelationshipTypeResponse;
    } catch (error: unknown) {
      handleError(error, `Failed to get RelationshipType`);
    }
  }

  /**
   * List all RelationshipTypes.
   *
   * @returns A Promise that resolves to the ListRelationshipTypesResponse.
   */
  public async list(request: ListRelationshipTypesRequest): Promise<ListRelationshipTypesResponse> {
    try {
      const response: AxiosResponse = await this.httpClient.post(
        `/protocol/relationship-type`,
        request,
        {
          params: {
            ipOrgId: request?.ipOrgId,
            options: request?.options,
          },
        },
      );

      return response.data as ListRelationshipTypesResponse;
    } catch (error: unknown) {
      handleError(error, `Failed to list RelationshipTypes`);
    }
  }
}
