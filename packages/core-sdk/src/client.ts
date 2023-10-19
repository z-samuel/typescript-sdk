import axios, { AxiosInstance } from "axios";
import * as dotenv from "dotenv";

import { StoryConfig } from "./types/config";
import { Environment } from "./enums/Environment";
import { FranchiseClient } from "./resources/franchise";
import { LicenseClient } from "./resources/license";
import { TransactionClient } from "./resources/transaction";
import { RelationshipClient } from "./resources/relationship";
import { IPAssetClient } from "./resources/ipAsset";
import { HTTP_TIMEOUT } from "./constants/http";
import { CollectClient } from "./resources/collect";
import { CollectModule__factory } from "./abi/generated/factories/CollectModule__factory";
import { LicensingModule__factory } from "./abi/generated/factories/LicensingModule__factory";
import { FranchiseRegistry__factory } from "./abi/generated/factories/FranchiseRegistry__factory";
import { RelationshipModule__factory } from "./abi/generated/factories/RelationshipModule__factory";

if (typeof process !== 'undefined') {
  dotenv.config();
}
/**
 * The StoryClient is the main entry point for the SDK.
 */
export class StoryClient {
  private readonly config: StoryConfig;
  private readonly httpClient: AxiosInstance;
  private _franchise: FranchiseClient | null = null;
  private _relationship: RelationshipClient | null = null;
  private _ipAsset: IPAssetClient | null = null;
  private _license: LicenseClient | null = null;
  private _transaction: TransactionClient | null = null;
  private _collect: CollectClient | null = null;

  /**
   * @param config - the configuration for the SDK client
   */
  constructor(config: StoryConfig) {
    if (config.environment !== Environment.TEST) {
      throw new Error("Invalid Environment: Only TEST environment is supported");
    }
    this.config = config;
    this.httpClient = axios.create({
      baseURL: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL,
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
      const franchiseRegistryContract =
        process.env.FRANCHISE_REGISTRY_CONTRACT ||
        process.env.NEXT_PUBLIC_FRANCHISE_REGISTRY_CONTRACT;
      const franchiseRegistry = FranchiseRegistry__factory.connect(
        franchiseRegistryContract as string,
        this.config.signer,
      );

      const licenseModuleContract =
        process.env.LICENSING_MODULE_CONTRACT || process.env.NEXT_PUBLIC_LICENSING_MODULE_CONTRACT;
      const licenseModule = LicensingModule__factory.connect(
        licenseModuleContract as string,
        this.config.signer,
      );
      this._franchise = new FranchiseClient(this.httpClient, franchiseRegistry, licenseModule);
    }
    return this._franchise;
  }

  /**
   * Getter for the relationship client. The client is lazily created when
   * this method is called.
   *
   * @returns the RelationshipClient instance
   */
  public get relationship(): RelationshipClient {
    if (this._relationship === null) {
      const franchiseRegistryContract =
        process.env.FRANCHISE_REGISTRY_CONTRACT ||
        process.env.NEXT_PUBLIC_FRANCHISE_REGISTRY_CONTRACT;
      const franchiseRegistry = FranchiseRegistry__factory.connect(
        franchiseRegistryContract as string,
        this.config.signer,
      );

      const relationshipModuleContract =
        process.env.RELATIONSHIP_MODULE_CONTRACT ||
        process.env.NEXT_PUBLIC_RELATIONSHIP_MODULE_CONTRACT;
      const relationshipModule = RelationshipModule__factory.connect(
        relationshipModuleContract as string,
        this.config.signer,
      );

      this._relationship = new RelationshipClient(relationshipModule, franchiseRegistry);
    }
    return this._relationship;
  }

  /**
   * Getter for the IP Asset client. The client is lazily created when
   * this method is called.
   *
   * @returns the IpAssetClient instance
   */
  public get ipAsset(): IPAssetClient {
    const franchiseRegistryContract =
      process.env.FRANCHISE_REGISTRY_CONTRACT ||
      process.env.NEXT_PUBLIC_FRANCHISE_REGISTRY_CONTRACT;
    if (this._ipAsset === null) {
      const franchiseRegistry = FranchiseRegistry__factory.connect(
        franchiseRegistryContract as string,
        this.config.signer,
      );
      this._ipAsset = new IPAssetClient(this.httpClient, franchiseRegistry, this.config.signer);
    }
    return this._ipAsset;
  }

  /**
   * Getter for the license client. The client is lazily created when
   * this method is called.
   *
   * @returns the FranchiseClient instance
   */
  public get license(): LicenseClient {
    if (this._license === null) {
      const franchiseRegistryContract =
        process.env.FRANCHISE_REGISTRY_CONTRACT ||
        process.env.NEXT_PUBLIC_FRANCHISE_REGISTRY_CONTRACT;
      const franchiseRegistry = FranchiseRegistry__factory.connect(
        franchiseRegistryContract as string,
        this.config.signer,
      );
      this._license = new LicenseClient(this.httpClient, this.config.signer, franchiseRegistry);
    }
    return this._license;
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

  /**
   * Getter for the collect module client. The client is lazily created when
   * this method is called.
   *
   * @returns the CollectClient instance
   */
  public get collect(): CollectClient {
    if (this._collect === null) {
      const collectModuleContract =
        process.env.COLLECT_MODULE_CONTRACT || process.env.NEXT_PUBLIC_COLLECT_MODULE_CONTRACT;
      const collectModule = CollectModule__factory.connect(
        collectModuleContract as string,
        this.config.signer,
      );
      this._collect = new CollectClient(this.httpClient, this.config.signer, collectModule);
    }
    return this._collect;
  }
}
