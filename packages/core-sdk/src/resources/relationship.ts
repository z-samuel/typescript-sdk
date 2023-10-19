import { ethers } from "ethers";

import { RelationshipModule } from "../abi/generated/RelationshipModule";
import {
  RelationshipIsRelatedRequest,
  RelationshipIsRelatedResponse,
  RelationshipIsRelationshipExpiredRequest,
  RelationshipIsRelationshipExpiredResponse,
  RelationshipRelateRequest,
  RelationshipRelateResponse,
  RelationshipUnrelateRequest,
  RelationshipUnrelateResponse,
} from "../types/resources/relationship";
import { handleError } from "../utils/errors";
import { FranchiseRegistry } from "../abi/generated";

/**
 * Client for managing relationships.
 */
export class RelationshipClient {
  private readonly relationshipModule: RelationshipModule;
  private readonly franchiseRegistry: FranchiseRegistry;

  /**
   * Creates a new RelationshipClient instance.
   * @param relationshipModule - The relationship module to interact with.
   * @param franchiseRegistry - The franchise registry to interact with.
   */
  constructor(relationshipModule: RelationshipModule, franchiseRegistry: FranchiseRegistry) {
    this.relationshipModule = relationshipModule;
    this.franchiseRegistry = franchiseRegistry;
  }

  /**
   * Retrieves the registry addresses for source and destination franchises.
   * @param sourceFranchiseId - The ID of the source franchise.
   * @param destFranchiseId - The ID of the destination franchise.
   * @returns An object containing the source and destination IP registry addresses.
   */
  private async getRegistryAddresses(
    sourceFranchiseId: string,
    destFranchiseId: string,
  ): Promise<{
    sourceIpRegistryAddress: string;
    destIpRegistryAddress: string;
  }> {
    try {
      const sourceIpRegistryAddress: string = await this.franchiseRegistry.ipAssetRegistryForId(
        sourceFranchiseId,
      );
      const destIpRegistryAddress: string = await this.franchiseRegistry.ipAssetRegistryForId(
        destFranchiseId,
      );

      return {
        sourceIpRegistryAddress,
        destIpRegistryAddress,
      };
    } catch (error) {
      handleError(error, "Failed to get registry addresses");
    }
  }

  /**
   * Establishes a relationship between two IP assets.
   * @param request - The request for establishing the relationship.
   * @returns A promise that resolves to the response with the transaction hash.
   */
  public async relate(request: RelationshipRelateRequest): Promise<RelationshipRelateResponse> {
    try {
      const { sourceIPAsset, destIPAsset } = request;

      const mockRelationshipData = ethers.utils.formatBytes32String("");

      // Get IPAssetRegistry Contract Address
      const { sourceIpRegistryAddress, destIpRegistryAddress } = await this.getRegistryAddresses(
        sourceIPAsset.franchiseId,
        destIPAsset.franchiseId,
      );

      const relationshipId = await this.relationshipModule.getRelationshipId("APPEARS_IN");

      const params = {
        sourceContract: sourceIpRegistryAddress,
        sourceId: sourceIPAsset.ipAssetId,
        destContract: destIpRegistryAddress,
        destId: destIPAsset.ipAssetId,
        relationshipId,
        ttl: "0",
      };

      const response = await this.relationshipModule.relate(params, mockRelationshipData);

      return {
        txHash: response.hash,
      };
    } catch (error) {
      handleError(error, "Failed to create relationship");
    }
  }

  /**
   * Removes a relationship between two IP assets.
   * @param request - The request for removing the relationship.
   * @returns A promise that resolves to the response with the transaction hash.
   */
  public async unrelate(
    request: RelationshipUnrelateRequest,
  ): Promise<RelationshipUnrelateResponse> {
    try {
      const { sourceIPAsset, destIPAsset } = request;

      // Get IPAssetRegistry Contract Address
      const { sourceIpRegistryAddress, destIpRegistryAddress } = await this.getRegistryAddresses(
        sourceIPAsset.franchiseId,
        destIPAsset.franchiseId,
      );

      const relationshipId = await this.relationshipModule.getRelationshipId("APPEARS_IN");

      const params = {
        sourceContract: sourceIpRegistryAddress,
        sourceId: sourceIPAsset.ipAssetId,
        destContract: destIpRegistryAddress,
        destId: destIPAsset.ipAssetId,
        relationshipId,
        ttl: "0",
      };

      const response = await this.relationshipModule.unrelate(params);

      return {
        txHash: response.hash,
      };
    } catch (error) {
      handleError(error, "Failed to unrelate relationship");
    }
  }

  /**
   * Checks if a relationship has expired.
   * @param request - The request for checking the relationship's expiration status.
   * @returns A promise that resolves to the response indicating whether the relationship has expired.
   */
  public async isRelationshipExpired(
    request: RelationshipIsRelationshipExpiredRequest,
  ): Promise<RelationshipIsRelationshipExpiredResponse> {
    try {
      const { sourceIPAsset, destIPAsset } = request;

      // Get IPAssetRegistry Contract Address
      const { sourceIpRegistryAddress, destIpRegistryAddress } = await this.getRegistryAddresses(
        sourceIPAsset.franchiseId,
        destIPAsset.franchiseId,
      );

      const relationshipId = await this.relationshipModule.getRelationshipId("APPEARS_IN");

      const params = {
        sourceContract: sourceIpRegistryAddress,
        sourceId: sourceIPAsset.ipAssetId,
        destContract: destIpRegistryAddress,
        destId: destIPAsset.ipAssetId,
        relationshipId,
        ttl: "0",
      };

      const response = await this.relationshipModule.isRelationshipExpired(params);

      return {
        result: response,
      };
    } catch (error) {
      handleError(error, "Failed to get isRelationshipExpired");
    }
  }

  /**
   * Checks if two IP assets are related.
   * @param request - The request for checking the relationship between two IP assets.
   * @returns A promise that resolves to the response indicating whether the IP assets are related.
   */
  public async isRelated(
    request: RelationshipIsRelatedRequest,
  ): Promise<RelationshipIsRelatedResponse> {
    try {
      const { sourceIPAsset, destIPAsset } = request;

      // Get IPAssetRegistry Contract Address
      const { sourceIpRegistryAddress, destIpRegistryAddress } = await this.getRegistryAddresses(
        sourceIPAsset.franchiseId,
        destIPAsset.franchiseId,
      );

      const relationshipId = await this.relationshipModule.getRelationshipId("APPEARS_IN");

      const params = {
        sourceContract: sourceIpRegistryAddress,
        sourceId: sourceIPAsset.ipAssetId,
        destContract: destIpRegistryAddress,
        destId: destIPAsset.ipAssetId,
        relationshipId,
        ttl: "0",
      };

      const response = await this.relationshipModule.areTheyRelated(params);

      return {
        result: response,
      };
    } catch (error) {
      handleError(error, "Failed to get isRelated");
    }
  }
}
