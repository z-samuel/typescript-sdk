import { AxiosInstance } from "axios";

import { fileToBase64 } from "./utils";
import { handleError } from "./errors";

export class PlatformClient {
  protected readonly httpClient: AxiosInstance;

  constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  /**
   * Upload a file to Arweave.
   *
   * @param file - the file binary data to upload
   * @param mimeType - the mime type of the file
   * @returns the response object that contains the uri of the uploaded file
   */
  public async uploadFile(file: File | Buffer, mimeType: string): Promise<{ uri: string }> {
    try {
      const base64 = await fileToBase64(file);
      const paylod = {
        base64: base64,
        mimeType: mimeType,
      };

      const response = await this.httpClient.post("/protocol/v2/files/upload", paylod, {
        timeout: 0,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data as { uri: string };
    } catch (error: unknown) {
      return handleError(error, ">>> Failed to upload file");
    }
  }
}
