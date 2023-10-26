import { AxiosInstance } from "axios";
import { constants } from "ethers";

import {
  CreateFranchiseRequest,
  CreateFranchiseResponse,
  ConfigureFranchiseRequest,
  ConfigureFranchiseResponse,
} from "../types/resources/franchise";
import { handleError } from "../utils/errors";
import { FranchiseRegistry, LicensingModule } from "../abi/generated";
import { FranchiseReadOnlyClient } from "./franchiseReadOnly";

/**
 * FranchiseClient allows you to create, update, view, search franchises on
 * Story Protocol.
 */
export class FranchiseClient extends FranchiseReadOnlyClient {
  constructor(
    httpClient: AxiosInstance,
    franchiseRegistry: FranchiseRegistry,
    licenseModule: LicensingModule,
  ) {
    super(httpClient, franchiseRegistry, licenseModule);
  }

  /**
   * Create a franchise on Story Protocol based on the specified input franchise data.
   *
   * @param request - the request object that contains all data needed to create a franchise
   * @returns the response object that contains results from the create franchise action
   */
  public async create(request: CreateFranchiseRequest): Promise<CreateFranchiseResponse> {
    try {
      // hardcoded the URI for now until the backend API for uploading franchise metadata is ready
      const tokenURI = "https://arweave.net/dnFJl1v8kgOx_6Z0gEsBce3D56cMP4-lxAcFqSsL0_w";

      const response = await this.franchiseRegistry.registerFranchise({
        name: request.franchiseName,
        symbol: request.franchiseSymbol,
        description: request.franchiseDescription,
        tokenURI: tokenURI,
      });

      return {
        txHash: response.hash,
      };
    } catch (error: unknown) {
      handleError(error, "Failed to create franchise");
    }
  }

  /**
   * Configure a franchise on Story Protocol.
   *
   * @param request - the request object that contains all data needed to configure a franchise
   * @returns the response object that contains results from the configure franchise action
   */
  public async configure(request: ConfigureFranchiseRequest): Promise<ConfigureFranchiseResponse> {
    try {
      const response = await this.licenseModule.configureFranchiseLicensing(request.franchiseId, {
        nonCommercialConfig: {
          canSublicense: true,
          franchiseRootLicenseId: 0,
        },
        nonCommercialTerms: {
          processor: constants.AddressZero,
          data: [],
        },
        commercialConfig: {
          canSublicense: false,
          franchiseRootLicenseId: 0,
        },
        commercialTerms: {
          processor: constants.AddressZero,
          data: [],
        },
        commercialLicenseUri: "aaaa",
        rootIpAssetHasCommercialRights: false,
        revoker: "0xF33f05489d9708C2CA97944F2007d4E741D4DEe7",
      });

      return {
        txHash: response.hash,
      };
    } catch (error: unknown) {
      handleError(error, "Failed to configure franchise");
    }
  }
}
