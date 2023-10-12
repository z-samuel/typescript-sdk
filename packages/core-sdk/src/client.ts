import { StoryConfig } from "./interfaces/config";
import { Environment } from "./enums/environment";
import { FranchiseClient } from "./resources/franchise";
import { TransactionClient } from "./resources/transaction";
import axios, { AxiosInstance } from "axios";
import { HTTP_TIMEOUT } from "./constants/http";
import { FranchiseRegistry__factory, LicensingModule__factory } from "./abi/generated/factories";
import * as dotenv from "dotenv";

dotenv.config();
/**
 * The StoryClient is the main entry point for the SDK.
 */
export class StoryClient {
  private readonly config: StoryConfig;
  private readonly httpClient: AxiosInstance;
  private _franchise: FranchiseClient | null = null;
  private _transaction: TransactionClient | null = null;

  /**
   * @param config - the configuration for the SDK client
   */
  constructor(config: StoryConfig) {
    if (config.environment !== Environment.TEST) {
      throw new Error("Invalid Environment: Only TEST environment is supported");
    }
    this.config = config;
    this.httpClient = axios.create({
      baseURL: process.env.API_BASE_URL,
      timeout: HTTP_TIMEOUT,
    });
  }

  /**
   * Getter for the franchise client. The client is lazily created when
   * this method is called.
   *
   * @returns the FranchiseClient instance
   */
  public get franchise(): FranchiseClient {
    if (this._franchise === null) {
      const franchiseRegistry = FranchiseRegistry__factory.connect(
        process.env.FRANCHISE_REGISTRY_CONTRACT as string,
        this.config.signer,
      );
      const licenseModule = LicensingModule__factory.connect(
        process.env.LICENSING_MODULE_CONTRACT as string,
        this.config.signer,
      );
      this._franchise = new FranchiseClient(this.httpClient, franchiseRegistry, licenseModule);
    }
    return this._franchise;
  }

  /**
   * Getter for the transaction client. The client is lazily created when
   * this method is called.
   *
   * @returns the TransactionClient instance
   */
  public get transaction(): TransactionClient {
    if (this._transaction === null) {
      this._transaction = new TransactionClient(this.httpClient);
    }
    return this._transaction;
  }
}
