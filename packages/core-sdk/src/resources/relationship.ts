import { getAddress, PublicClient, WalletClient } from "viem";
import { AxiosInstance } from "axios";

import {
  RegisterRelationshipTypeRequest,
  RegisterRelationshipTypeResponse,
  RegisterRelationshipRequest,
  RegisterRelationshipResponse,
} from "../types/resources/relationship";
import { handleError } from "../utils/errors";
import { RelationshipReadOnlyClient } from "./relationshipReadOnly";
import { storyProtocolConfig } from "../abi/storyProtocol.abi";
import { relationshipModuleConfig } from "../abi/relationshipModule.abi";
import { waitTxAndFilterLog } from "../utils/utils";

/**
 * Client for managing relationships.
 */
export class RelationshipClient extends RelationshipReadOnlyClient {
  private readonly wallet: WalletClient;

  constructor(httpClient: AxiosInstance, rpcClient: PublicClient, wallet: WalletClient) {
    super(httpClient, rpcClient);
    this.wallet = wallet;
  }

  /**
   * Register a relationship on Story Protocol based on the specified input relationship data.
   *
   * @param request - the request object that contains all data needed to register a relationship
   * @returns the response object that contains results from the register relationship action
   */
  public async register(
    request: RegisterRelationshipRequest,
  ): Promise<RegisterRelationshipResponse> {
    try {
      const { request: call } = await this.rpcClient.simulateContract({
        ...storyProtocolConfig,
        functionName: "createRelationship",
        args: [
          getAddress(request.ipOrgId),
          {
            relType: request.relType,
            srcAddress: request.srcContract as `0x${string}`,
            srcId: request.srcTokenId,
            srcType: request.srcType || 1, // This represents the n-th bit on the bit mask
            dstAddress: request.dstContract as `0x${string}`,
            dstId: request.dstTokenId,
            dstType: request.dstType || 1, // This represents the n-th bit on the bit mask,
          },
          [],
          [],
        ],
        account: this.wallet.account,
      });

      const txHash = await this.wallet.writeContract(call);
      if (request.txOptions?.waitForTransaction) {
        const targetLog = await waitTxAndFilterLog(this.rpcClient, txHash, {
          ...relationshipModuleConfig,
          eventName: "RelationshipCreated",
        });
        // https://sepolia.etherscan.io/tx/0x99d5736c65bd81cd4a361a731d4a035375a0926c95e4132e8fcb80ad5b602b5c#eventlog
        return { txHash: txHash, relationshipId: targetLog?.args?.relationshipId?.toString() };
      } else {
        return { txHash: txHash };
      }
    } catch (error: unknown) {
      handleError(error, "Failed to register relationship");
    }
  }

  /**
   * Register a relationship type on Story Protocol based on the specified input data.
   *
   * @param request - the request object that contains all data needed to register a relationship type
   * @returns the response object that contains results from the register relationship type action
   */
  public async registerRelationshipType(
    request: RegisterRelationshipTypeRequest,
  ): Promise<RegisterRelationshipTypeResponse> {
    try {
      const { request: call } = await this.rpcClient.simulateContract({
        ...storyProtocolConfig,
        functionName: "addRelationshipType",
        args: [
          {
            ipOrg: getAddress(request.ipOrgId),
            relType: request.relType,
            allowedElements: {
              src: request.relatedElements.src,
              dst: request.relatedElements.dst,
            },
            allowedSrcs: request.allowedSrcs,
            allowedDsts: request.allowedDsts,
          },
        ],
        account: this.wallet.account,
      });

      const txHash = await this.wallet.writeContract(call);
      if (request.txOptions?.waitForTransaction) {
        await waitTxAndFilterLog(this.rpcClient, txHash, {
          ...relationshipModuleConfig,
          eventName: "RelationshipTypeSet",
        });
        // https://sepolia.etherscan.io/tx/0x6b5072235bf5af5e3dc440dcd67b295a6fe6d68e5263c5dc9576f84392e77616#eventlog
        return { txHash: txHash, success: true };
      } else {
        return { txHash: txHash };
      }
    } catch (error: unknown) {
      handleError(error, "Failed to register relationship");
    }
  }
}
