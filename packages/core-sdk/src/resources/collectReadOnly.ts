import { AxiosInstance, AxiosResponse } from "axios";

import { ListCollectionsResponse, ListCollectionsRequest } from "../types/resources/collect";
import { CollectModule } from "../abi/generated";
import { handleError } from "../utils/errors";

export class CollectReadOnlyClient {
  protected readonly httpClient: AxiosInstance;
  protected readonly collectModuleContract: CollectModule;

  constructor(httpClient: AxiosInstance, collectModule: CollectModule) {
    this.httpClient = httpClient;

    this.collectModuleContract = collectModule;
  }

  /**
   * List all collected IP Assets.
   *
   * @returns A Promise that resolves to the ListLicenseResponse.
   */
  public async list(request: ListCollectionsRequest): Promise<ListCollectionsResponse> {
    try {
      const response: AxiosResponse = await this.httpClient.get(
        `/collection?franchiseId=${request.franchiseId}`,
      );
      return response.data as ListCollectionsResponse;
    } catch (error: unknown) {
      handleError(error, `Failed to get collections`);
    }
  }
}
