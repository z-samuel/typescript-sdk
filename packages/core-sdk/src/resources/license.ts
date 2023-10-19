import { AxiosInstance, AxiosResponse } from "axios";
import { Signer, ContractTransaction, constants } from "ethers";

import {
  GetLicenseRequest,
  GetLicenseResponse,
  ListLicenseResponse,
  CreateLicenseRequest,
  CreateLicenseResponse,
  ListLicenseRequest,
} from "../types/resources/license";
import { FranchiseRegistry, IpAssetRegistry__factory } from "../abi/generated";
import { handleError } from "../utils/errors";
import { isIntegerString } from "../utils/utils";

/**
 * A class representing License operations.
 *
 * @public
 */
export class LicenseClient {
  private readonly httpClient: AxiosInstance;
  private readonly signer: Signer;
  private readonly franchiseRegistry: FranchiseRegistry;

  constructor(httpClient: AxiosInstance, signer: Signer, franchiseRegistry: FranchiseRegistry) {
    this.httpClient = httpClient;
    this.signer = signer;
    this.franchiseRegistry = franchiseRegistry;
  }

  /**
   * Get a license by its ID.
   *
   * @param licenseId - The ID of the license to retrieve.
   * @returns A Promise that resolves to the GetLicenseResponse.
   */
  public async get(request: GetLicenseRequest): Promise<GetLicenseResponse> {
    try {
      if (!isIntegerString(request.licenseId)) {
        throw new Error(`Invalid licenseId. Must be an integer. But got: ${request.licenseId}`);
      }

      const response: AxiosResponse = await this.httpClient.get(`/license/${request.licenseId}`);

      return response.data as GetLicenseResponse;
    } catch (error: unknown) {
      handleError(error, `Failed to get license`);
    }
  }

  /**
   * List all licenses.
   *
   * @returns A Promise that resolves to the ListLicenseResponse.
   */
  public async list(request: ListLicenseRequest): Promise<ListLicenseResponse> {
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/license?franchiseId=${request.franchiseId}&ipAssetId=${request.ipAssetId}`,
      );

      return response.data as ListLicenseResponse;
    } catch (error: unknown) {
      handleError(error, `Failed to get licenses`);
    }
  }

  /**
   * Create a license within the Story Protocol based on the specified input data.
   *
   * @param request - An object containing the necessary data to create a license.
   * @returns A response object containing the result of the create license action, including the transaction hash.
   */
  public async create(request: CreateLicenseRequest): Promise<CreateLicenseResponse> {
    try {
      const defaults = {
        _tokenId: 0, // Assuming BigNumberish can be initialized with 0
        _parentLicenseId: "0",
        _licenseHolder: "0x8e3B91c90561523312f32B49DAAc4AD15293De7F", // An empty string for a default holder address
        _uri: "https://example.xyz", // An empty string for a default URI
        _revoker: "0x8e3B91c90561523312f32B49DAAc4AD15293De7F", // An empty string for a default revoker address
        _commercial: false, // Default to non-commercial
        _canSublicense: false, // Default to not allowing sublicense
        _terms: {
          processor: constants.AddressZero,
          data: [],
        },
        overrides: {
          // Assuming overrides is an object with properties from and gasLimit
          // You may need to provide default values for its properties as well
        },
      };

      const { franchiseId, ipAssetId, licenseURI, options } = request;

      // Get Wallet address from Signer
      const walletAddress: string = await this.signer.getAddress();

      // Get IPAssetRegistry Contract Address
      const ipAssetRegistryAddress: string = await this.franchiseRegistry.ipAssetRegistryForId(
        franchiseId,
      );

      // Connect to  IPAssetRegistry Contract
      const ipAssetRegistry = IpAssetRegistry__factory.connect(ipAssetRegistryAddress, this.signer);

      // Get parent license Id
      const parentLicenseId = await ipAssetRegistry.getLicenseIdByTokenId(
        ipAssetId,
        options?.isCommercial || defaults._commercial,
      );

      const createResponse: ContractTransaction = await ipAssetRegistry.createLicense(
        ipAssetId,
        parentLicenseId,
        walletAddress,
        licenseURI,
        options?.revoker || defaults._revoker,
        options?.isCommercial || defaults._commercial,
        options?.isSublicensable || defaults._canSublicense,
        options?.terms || defaults._terms,
      );

      return {
        txHash: createResponse.hash,
      };
    } catch (error: unknown) {
      handleError(error, "Failed to create license");
    }
  }
}
