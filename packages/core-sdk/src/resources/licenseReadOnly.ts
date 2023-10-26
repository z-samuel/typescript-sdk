import { AxiosInstance, AxiosResponse } from "axios";

import {
  GetLicenseRequest,
  GetLicenseResponse,
  ListLicenseResponse,
  ListLicenseRequest,
} from "../types/resources/license";
import { FranchiseRegistry } from "../abi/generated";
import { handleError } from "../utils/errors";
import { isIntegerString } from "../utils/utils";

/**
 * A class representing License operations.
 *
 * @public
 */
export class LicenseReadOnlyClient {
  protected readonly httpClient: AxiosInstance;
  protected readonly franchiseRegistry: FranchiseRegistry;

  constructor(httpClient: AxiosInstance, franchiseRegistry: FranchiseRegistry) {
    this.httpClient = httpClient;
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
}
