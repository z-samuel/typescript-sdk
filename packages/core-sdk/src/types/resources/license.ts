import { QueryOptions, TxOptions } from "../options";

/**
 * Represents the core data model for a License, containing essential information.
 *
 * @public
 */
export type License = {
  id: number;
  isCommercial: boolean;
  status: number;
  licensor: string;
  revoker: string;
  ipOrgId: string;
  licenseeType: number;
  ipAssetId: string;
  parentLicenseId: string;
  termIds: string[];
  termsData: string[];
  createdAt: string;
  txHash: string;
};

interface CreateLicenseRequest {
  ipOrgId: string;
  parentLicenseId?: string;
  isCommercial: boolean;
  preHooksCalldata?: Record<string, undefined>[];
  postHooksCalldata?: Record<string, undefined>[];
  txOptions?: TxOptions;
}

/**
 * Represents the request structure for creating a new license NFT (createLicenseNft on StoryProtocol.sol)
 *
 * @public
 */
export interface CreateLicenseNftRequest extends CreateLicenseRequest {
  licensee: string;
}

/**
 * Represents the request structure for creating a new IPA-bound license (createIpaBoundLicense on StoryProtocol.sol)
 *
 * @public
 */
export interface CreateIpaBoundLicenseRequest extends CreateLicenseRequest {
  ipaId: number;
}

/**
 * Represents the request structure for retrieving license details using the `franchise.get` method.
 *
 * @public
 */
export type GetLicenseRequest = {
  licenseId: string; // Unique identifier of the license to retrieve.
};

/**
 * Represents the response structure for retrieving license details using the `license.get` method.
 *
 * @public
 */
export type GetLicenseResponse = {
  license: License;
};

export type ListLicenseRequest = {
  ipOrgId?: string;
  ipAssetId?: string;
  options?: QueryOptions;
};

/**
 * Represents the request structure for listing multiple licenses using the `license.list` method.
 *
 * @public
 */
export type ListLicenseResponse = {
  licenses: License[];
};

/**
 * Represents the response structure for creating a new license using the `license.create` method.
 *
 * @public
 */
export type CreateLicenseResponse = {
  txHash: string; // Transaction hash of the license creation transaction.
  licenseId?: string;
};
