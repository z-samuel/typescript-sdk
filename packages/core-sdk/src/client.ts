import axios, { AxiosInstance } from "axios";
import { Signer, ethers } from "ethers";
import { Provider } from "@ethersproject/providers";
import * as dotenv from "dotenv";

import { StoryConfig, StoryReadOnlyConfig } from "./types/config";
import { Environment } from "./enums/Environment";
import { FranchiseClient } from "./resources/franchise";
import { FranchiseReadOnlyClient } from "./resources/franchiseReadOnly";
import { RelationshipClient } from "./resources/relationship";
import { RelationshipReadOnlyClient } from "./resources/relationshipReadOnly";
import { IPAssetClient } from "./resources/ipAsset";
import { IPAssetReadOnlyClient } from "./resources/ipAssetReadOnly";
import { LicenseClient } from "./resources/license";
import { LicenseReadOnlyClient } from "./resources/licenseReadOnly";
import { TransactionClient } from "./resources/transaction";
import { TransactionReadOnlyClient } from "./resources/transactionReadOnly";
import { CollectClient } from "./resources/collect";
import { CollectReadOnlyClient } from "./resources/collectReadOnly";
import { HTTP_TIMEOUT } from "./constants/http";
import { CollectModule__factory } from "./abi/generated";
import { ReadOnlyClient, Client } from "./types/client";
import { LicensingModule__factory } from "./abi/generated/factories/LicensingModule__factory";
import { FranchiseRegistry__factory } from "./abi/generated/factories/FranchiseRegistry__factory";
import { RelationshipModule__factory } from "./abi/generated/factories/RelationshipModule__factory";

if (typeof process !== "undefined") {
  dotenv.config();
}
/**
 * The StoryClient is the main entry point for the SDK.
 */
export class StoryClient {
  private readonly config: StoryConfig | StoryReadOnlyConfig;
  private readonly httpClient: AxiosInstance;
  private readonly isReadOnly: boolean = false;
  private readonly signerOrProvider: Signer | Provider;

  private _franchise: FranchiseClient | FranchiseReadOnlyClient | null = null;
  private _license: LicenseClient | LicenseReadOnlyClient | null = null;
  private _transaction: TransactionClient | TransactionReadOnlyClient | null = null;
  private _ipAsset: IPAssetClient | IPAssetReadOnlyClient | null = null;
  private _collect: CollectClient | CollectReadOnlyClient | null = null;
  private _relationship: RelationshipClient | RelationshipReadOnlyClient | null = null;

  /**
   * @param config - the configuration for the SDK client
   */
  private constructor(config: StoryConfig | StoryReadOnlyConfig, isReadOnly: boolean = false) {
    if (config.environment !== Environment.TEST) {
      throw new Error("Invalid Environment: Only TEST environment is supported");
    }

    this.config = config;
    this.isReadOnly = isReadOnly;

    this.signerOrProvider = isReadOnly
      ? (this.config as StoryReadOnlyConfig).provider || new ethers.providers.JsonRpcProvider()
      : (this.config as StoryConfig).signer;

    this.httpClient = axios.create({
      baseURL: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: HTTP_TIMEOUT,
    });
  }

  /**
   * Factory method for creating a read only SDK client.
   *
   * @param config - the configuration for a read only SDK client
   */
  static newReadOnlyClient(config: StoryReadOnlyConfig): ReadOnlyClient {
    return new StoryClient(config, true) as ReadOnlyClient;
  }

  /**
   * Factory method for creating a SDK client with a signer.
   *
   * @param config - the configuration for a new read/write SDK client
   */
  static newClient(config: StoryConfig): Client {
    return new StoryClient(config, false) as Client;
  }

  private initFranchise(): void {
    const franchiseRegistryContract =
      process.env.FRANCHISE_REGISTRY_CONTRACT ||
      process.env.NEXT_PUBLIC_FRANCHISE_REGISTRY_CONTRACT;

    const licenseModuleContract =
      process.env.LICENSING_MODULE_CONTRACT || process.env.NEXT_PUBLIC_LICENSING_MODULE_CONTRACT;

    const franchiseRegistry = FranchiseRegistry__factory.connect(
      franchiseRegistryContract as string,
      this.signerOrProvider,
    );

    const licenseModule = LicensingModule__factory.connect(
      licenseModuleContract as string,
      this.signerOrProvider,
    );

    if (this.isReadOnly) {
      this._franchise = new FranchiseReadOnlyClient(
        this.httpClient,
        franchiseRegistry,
        licenseModule,
      );
    } else {
      this._franchise = new FranchiseClient(this.httpClient, franchiseRegistry, licenseModule);
    }
  }

  private initRelationship(): void {
    const franchiseRegistryContract =
      process.env.FRANCHISE_REGISTRY_CONTRACT ||
      process.env.NEXT_PUBLIC_FRANCHISE_REGISTRY_CONTRACT;

    const relationshipModuleContract =
      process.env.RELATIONSHIP_MODULE_CONTRACT ||
      process.env.NEXT_PUBLIC_RELATIONSHIP_MODULE_CONTRACT;

    const franchiseRegistry = FranchiseRegistry__factory.connect(
      franchiseRegistryContract as string,
      this.signerOrProvider,
    );

    const relationshipModule = RelationshipModule__factory.connect(
      relationshipModuleContract as string,
      this.signerOrProvider,
    );

    if (this.isReadOnly) {
      this._relationship = new RelationshipReadOnlyClient(relationshipModule, franchiseRegistry);
    } else {
      this._relationship = new RelationshipClient(relationshipModule, franchiseRegistry);
    }
  }

  private initIpAsset(): void {
    const franchiseRegistryContract =
      process.env.FRANCHISE_REGISTRY_CONTRACT ||
      process.env.NEXT_PUBLIC_FRANCHISE_REGISTRY_CONTRACT;

    const franchiseRegistry = FranchiseRegistry__factory.connect(
      franchiseRegistryContract as string,
      this.signerOrProvider,
    );

    if (this.isReadOnly) {
      this._ipAsset = new IPAssetReadOnlyClient(this.httpClient, franchiseRegistry);
    } else {
      this._ipAsset = new IPAssetClient(
        this.httpClient,
        franchiseRegistry,
        this.signerOrProvider as Signer,
      );
    }
  }

  private initLicense(): void {
    const franchiseRegistryContract =
      process.env.FRANCHISE_REGISTRY_CONTRACT ||
      process.env.NEXT_PUBLIC_FRANCHISE_REGISTRY_CONTRACT;

    const franchiseRegistry = FranchiseRegistry__factory.connect(
      franchiseRegistryContract as string,
      this.signerOrProvider,
    );

    if (this.isReadOnly) {
      this._license = new LicenseReadOnlyClient(this.httpClient, franchiseRegistry);
    } else {
      this._license = new LicenseClient(
        this.httpClient,
        this.signerOrProvider as Signer,
        franchiseRegistry,
      );
    }
  }

  private initTransaction(): void {
    if (this.isReadOnly) {
      this._transaction = new TransactionReadOnlyClient(this.httpClient);
    } else {
      this._transaction = new TransactionClient(this.httpClient);
    }
  }

  private initCollect(): void {
    const collectModuleContract =
      process.env.COLLECT_MODULE_CONTRACT || process.env.NEXT_PUBLIC_COLLECT_MODULE_CONTRACT;

    const collectModule = CollectModule__factory.connect(
      collectModuleContract as string,
      this.signerOrProvider,
    );

    if (this.isReadOnly) {
      this._collect = new CollectReadOnlyClient(this.httpClient, collectModule);
    } else {
      this._collect = new CollectClient(
        this.httpClient,
        this.signerOrProvider as Signer,
        collectModule,
      );
    }
  }

  /**
   * Getter for the franchise client. The client is lazily created when
   * this method is called.
   *
   * @returns the FranchiseClient or FranchiseReadOnlyClient instance
   */
  public get franchise(): FranchiseClient | FranchiseReadOnlyClient {
    if (this._franchise === null) {
      this.initFranchise();
    }

    return this._franchise as FranchiseClient | FranchiseReadOnlyClient;
  }

  /**
   * Getter for the relationship client. The client is lazily created when
   * this method is called.
   *
   * @returns the RelationshipClient instance
   */
  public get relationship(): RelationshipClient | RelationshipReadOnlyClient {
    if (this._relationship === null) {
      this.initRelationship();
    }

    return this._relationship as RelationshipClient | RelationshipReadOnlyClient;
  }

  /**
   * Getter for the IP Asset client. The client is lazily created when
   * this method is called.
   *
   * @returns the IpAssetClient instance
   */
  public get ipAsset(): IPAssetClient | IPAssetReadOnlyClient {
    if (this._ipAsset === null) {
      this.initIpAsset();
    }
    return this._ipAsset as IPAssetClient | IPAssetReadOnlyClient;
  }

  /**
   * Getter for the license client. The client is lazily created when
   * this method is called.
   *
   * @returns the FranchiseClient instance
   */
  public get license(): LicenseClient | LicenseReadOnlyClient {
    if (this._license === null) {
      this.initLicense();
    }

    return this._license as LicenseClient | LicenseReadOnlyClient;
  }

  /**
   * Getter for the transaction client. The client is lazily created when
   * this method is called.
   *
   * @returns the TransactionClient instance
   */
  public get transaction(): TransactionClient | TransactionReadOnlyClient {
    if (this._transaction === null) {
      this.initTransaction();
    }

    return this._transaction as TransactionClient | TransactionReadOnlyClient;
  }

  /**
   * Getter for the collect module client. The client is lazily created when
   * this method is called.
   *
   * @returns the CollectClient instance
   */

  public get collect(): CollectClient | CollectReadOnlyClient {
    if (this._collect === null) {
      this.initCollect();
    }

    return this._collect as CollectClient | CollectReadOnlyClient;
  }
}
