import axios, { AxiosInstance } from "axios";
import { createPublicClient, createWalletClient, http, PublicClient, WalletClient } from "viem";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";

import { StoryConfig, StoryReadOnlyConfig } from "./types/config";
import { IPOrgClient } from "./resources/ipOrg";
import { IPOrgReadOnlyClient } from "./resources/ipOrgReadOnly";
import { RelationshipReadOnlyClient } from "./resources/relationshipReadOnly";
import { IPAssetClient } from "./resources/ipAsset";
import { IPAssetReadOnlyClient } from "./resources/ipAssetReadOnly";
import { LicenseReadOnlyClient } from "./resources/licenseReadOnly";
import { TransactionClient } from "./resources/transaction";
import { TransactionReadOnlyClient } from "./resources/transactionReadOnly";
import { HTTP_TIMEOUT } from "./constants/http";
import { Client, ReadOnlyClient } from "./types/client";
import { ModuleClient } from "./resources/module";
import { ModuleReadOnlyClient } from "./resources/moduleReadOnly";
import { HookClient } from "./resources/hook";
import { HookReadOnlyClient } from "./resources/hookReadOnly";
import { PlatformClient } from "./utils/platform";
import { LicenseClient } from "./resources/license";
import { RelationshipClient } from "./resources/relationship";
import { RelationshipTypeClient } from "./resources/relationshipType";
import { RelationshipTypeReadOnlyClient } from "./resources/relationshipTypeReadOnly";

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
  private readonly rpcClient: PublicClient;
  private readonly wallet?: WalletClient;

  private _ipOrg: IPOrgClient | IPOrgReadOnlyClient | null = null;
  private _license: LicenseReadOnlyClient | null = null;
  private _transaction: TransactionClient | TransactionReadOnlyClient | null = null;
  private _ipAsset: IPAssetClient | IPAssetReadOnlyClient | null = null;
  private _relationship: RelationshipReadOnlyClient | null = null;
  private _relationshipType: RelationshipTypeReadOnlyClient | null = null;
  private _module: ModuleClient | ModuleReadOnlyClient | null = null;
  private _hook: HookClient | HookReadOnlyClient | null = null;
  private _platform: PlatformClient | null = null;

  /**
   * @param config - the configuration for the SDK client
   * @param isReadOnly
   */
  private constructor(config: StoryConfig | StoryReadOnlyConfig, isReadOnly: boolean = false) {
    this.config = config;
    this.isReadOnly = isReadOnly;

    const clientConfig = {
      chain: this.config.chain || sepolia,
      transport: this.config.transport || http(process.env.RPC_PROVIDER_URL),
    };

    this.rpcClient = createPublicClient(clientConfig);

    if (!isReadOnly) {
      const account = (this.config as StoryConfig).account;
      if (!account) {
        throw new Error("account is null");
      }

      this.wallet = createWalletClient({
        ...clientConfig,
        account: account,
      });
    }

    this.httpClient = axios.create({
      baseURL: process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: HTTP_TIMEOUT,
      headers: {
        version: "v0-alpha",
      },
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

  private initIPOrg(): void {
    if (this.isReadOnly) {
      this._ipOrg = new IPOrgReadOnlyClient(this.httpClient, this.rpcClient);
    } else {
      this._ipOrg = new IPOrgClient(this.httpClient, this.rpcClient, this.wallet!);
    }
  }

  private initRelationship(): void {
    if (this.isReadOnly) {
      this._relationship = new RelationshipReadOnlyClient(this.httpClient, this.rpcClient);
    } else {
      this._relationship = new RelationshipClient(this.httpClient, this.rpcClient, this.wallet!);
    }
  }

  private initRelationshipType(): void {
    if (this.isReadOnly) {
      this._relationshipType = new RelationshipTypeReadOnlyClient(this.httpClient, this.rpcClient);
    } else {
      this._relationshipType = new RelationshipTypeClient(
        this.httpClient,
        this.rpcClient,
        this.wallet!,
      );
    }
  }

  private initIpAsset(): void {
    if (this.isReadOnly) {
      this._ipAsset = new IPAssetReadOnlyClient(this.httpClient, this.rpcClient);
    } else {
      this._ipAsset = new IPAssetClient(this.httpClient, this.rpcClient, this.wallet!);
    }
  }

  private initLicense(): void {
    if (this.isReadOnly) {
      this._license = new LicenseReadOnlyClient(this.httpClient, this.rpcClient);
    } else {
      this._license = new LicenseClient(this.httpClient, this.rpcClient, this.wallet!);
    }
  }

  private initTransaction(): void {
    if (this.isReadOnly) {
      this._transaction = new TransactionReadOnlyClient(this.httpClient, this.rpcClient);
    } else {
      this._transaction = new TransactionClient(this.httpClient, this.rpcClient, this.wallet!);
    }
  }

  private initModule(): void {
    if (this.isReadOnly) {
      this._module = new ModuleReadOnlyClient(this.httpClient, this.rpcClient);
    } else {
      this._module = new ModuleClient(this.httpClient, this.rpcClient, this.wallet!);
    }
  }

  private initHook(): void {
    if (this.isReadOnly) {
      this._hook = new HookReadOnlyClient(this.httpClient, this.rpcClient);
    } else {
      this._hook = new HookClient(this.httpClient, this.rpcClient, this.wallet!);
    }
  }

  private initPlatform(): void {
    this._platform = new PlatformClient(this.httpClient);
  }

  /**
   * Getter for the ipOrg client. The client is lazily created when
   * this method is called.
   *
   * @returns the IPOrgClient or IPOrgReadOnlyClient instance
   */
  public get ipOrg(): IPOrgClient | IPOrgReadOnlyClient {
    if (this._ipOrg === null) {
      this.initIPOrg();
    }

    return this._ipOrg as IPOrgClient | IPOrgReadOnlyClient;
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

    return this._relationship as RelationshipReadOnlyClient;
  }

  /**
   * Getter for the relationship type client. The client is lazily created when
   * this method is called.
   *
   * @returns the RelationshipTypeClient instance
   */
  public get relationshipType(): RelationshipTypeClient | RelationshipTypeReadOnlyClient {
    if (this._relationshipType === null) {
      this.initRelationshipType();
    }

    return this._relationshipType as RelationshipTypeReadOnlyClient;
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
   * @returns the License instance
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
   * Getter for the module client. The client is lazily created when
   * this method is called.
   *
   * @returns the ModuleClient instance
   */
  public get module(): ModuleClient | ModuleReadOnlyClient {
    if (this._module === null) {
      this.initModule();
    }

    return this._module as ModuleClient | ModuleReadOnlyClient;
  }

  /**
   * Getter for the hook client. The client is lazily created when
   * this method is called.
   *
   * @returns the HookClient instance
   */
  public get hook(): HookClient | HookReadOnlyClient {
    if (this._hook === null) {
      this.initHook();
    }

    return this._hook as HookClient | HookReadOnlyClient;
  }

  public get platform(): PlatformClient {
    if (this._platform === null) {
      this.initPlatform();
    }

    return this._platform as PlatformClient;
  }
}
