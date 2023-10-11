import { AxiosInstance } from "axios";
import {
  Franchise,
  GetFranchiseRequest,
  GetFranchiseResponse,
  CreateFranchiseRequest,
  CreateFranchiseResponse,
  ListFranchiseResponse,
  ConfigureFranchiseRequest,
  ConfigureFranchiseResponse,
} from "../interfaces/resources/franchise";
import { handleError } from "../utils/errors";
import { isIntegerString } from "../utils/utils";
import { FranchiseRegistry, LicensingModule } from "../abi/generated";
import { constants } from "ethers";

/**
 * FranchiseClient allows you to create, update, view, search franchises on
 * Story Protocol.
 */
export class FranchiseClient {
  private readonly httpClient: AxiosInstance;
  private readonly franchiseRegistry: FranchiseRegistry;
  private readonly licenseModule: LicensingModule;

  constructor(
    httpClient: AxiosInstance,
    franchiseRegistry: FranchiseRegistry,
    licenseModule: LicensingModule,
  ) {
    this.httpClient = httpClient;
    this.franchiseRegistry = franchiseRegistry;
    this.licenseModule = licenseModule;
  }

  /**
   * Get a franchise data based on the specified franchise id.
   *
   * @param request - the request object for getting the franchise
   * @returns the response object that contains the fetched franchise object
   */
  public async get(request: GetFranchiseRequest): Promise<GetFranchiseResponse> {
    try {
      if (!isIntegerString(request.franchiseId)) {
        throw new Error(
          `Invalid franchise id. Must be an integer. But got: ${request.franchiseId}`,
        );
      }

      const response = await this.httpClient.get(`/protocol/kbw/franchise/${request.franchiseId}`);

      return {
        franchise: response.data as Franchise,
      };
    } catch (error: unknown) {
      handleError(error, "Failed to get franchise");
    }
  }
  /**
   * List all franchises.
   *
   * @returns the response object that contains a list of franchises
   */
  public async list(): Promise<ListFranchiseResponse> {
    try {
      const response = await this.httpClient.get(`protocol/kbw/franchise`);
      return {
        franchises: response.data as Franchise[],
      };
    } catch (error: unknown) {
      handleError(error, "Failed to list franchises.");
    }
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
