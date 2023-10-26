import { AxiosInstance } from "axios";
import { Signer, ContractTransaction, constants } from "ethers";

import { CreateLicenseRequest, CreateLicenseResponse } from "../types/resources/license";
import { FranchiseRegistry, IpAssetRegistry__factory } from "../abi/generated";
import { handleError } from "../utils/errors";
import { LicenseReadOnlyClient } from "./licenseReadOnly";

/**
 * A class representing License operations.
 *
 * @public
 */
export class LicenseClient extends LicenseReadOnlyClient {
  private readonly signer: Signer;

  constructor(httpClient: AxiosInstance, signer: Signer, franchiseRegistry: FranchiseRegistry) {
    super(httpClient, franchiseRegistry);
    this.signer = signer;
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
