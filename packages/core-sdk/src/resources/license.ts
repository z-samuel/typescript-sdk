import { PublicClient, WalletClient } from "viem";
import { AxiosInstance } from "axios";

import { handleError } from "../utils/errors";
import { storyProtocolConfig } from "../abi/storyProtocol.abi";
import { licenseRegistryConfig } from "../abi/licenseRegistry.abi";
import { waitTxAndFilterLog } from "../utils/utils";
import { LicenseReadOnlyClient } from "./licenseReadOnly";
import {
  CreateIpaBoundLicenseRequest,
  CreateLicenseNftRequest,
  CreateLicenseResponse,
} from "../types/resources/license";

/**
 * Client for managing relationships.
 */
export class LicenseClient extends LicenseReadOnlyClient {
  private readonly wallet: WalletClient;

  constructor(httpClient: AxiosInstance, rpcClient: PublicClient, wallet: WalletClient) {
    super(httpClient, rpcClient);
    this.wallet = wallet;
  }

  public async create(
    request: CreateLicenseNftRequest | CreateIpaBoundLicenseRequest,
  ): Promise<CreateLicenseResponse> {
    let functionName: string;
    let args;

    if (this.isCreateLicenseNftRequest(request)) {
      functionName = "createLicenseNft";
      args = [
        request.ipOrgId,
        { isCommercial: request.isCommercial, parentLicenseId: request.parentLicenseId || 0 },
        request.licensee,
        request.preHooksCalldata,
        request.postHooksCalldata,
      ];
    } else if (this.isCreateIpaBoundLicenseRequest(request)) {
      functionName = "createIpaBoundLicense";
      args = [
        request.ipOrgId,
        { isCommercial: request.isCommercial, parentLicenseId: request.parentLicenseId || 0 },
        request.ipaId,
        request.preHooksCalldata,
        request.postHooksCalldata,
      ];
    } else {
      throw new Error("Invalid request type");
    }

    try {
      const { request: call } = await this.rpcClient.simulateContract({
        ...storyProtocolConfig,
        functionName,
        args,
        account: this.wallet.account,
      });

      const txHash = await this.wallet.writeContract(call);
      if (request.txOptions?.waitForTransaction) {
        const targetLog = await waitTxAndFilterLog(this.rpcClient, txHash, {
          ...licenseRegistryConfig,
          eventName: "LicenseRegistered",
        });
        return { txHash: txHash, licenseId: String(targetLog?.args["id"]) };
      } else {
        return { txHash: txHash };
      }
    } catch (error: unknown) {
      handleError(error, "Failed to register license");
    }
  }

  private isCreateLicenseNftRequest(
    request: CreateLicenseNftRequest | CreateIpaBoundLicenseRequest,
  ): request is CreateLicenseNftRequest {
    return (request as CreateLicenseNftRequest).licensee !== undefined;
  }

  private isCreateIpaBoundLicenseRequest(
    request: CreateLicenseNftRequest | CreateIpaBoundLicenseRequest,
  ): request is CreateIpaBoundLicenseRequest {
    return (request as CreateIpaBoundLicenseRequest).ipaId !== undefined;
  }
}
