export { StoryClient } from "./client";
export { Environment } from "./enums/Environment";
export { IPAssetType } from "./enums/IPAssetType";
export { ResourceType } from "./enums/ResourceType";

export type { StoryConfig, StoryReadOnlyConfig } from "./types/config";

export type {
  Franchise,
  GetFranchiseRequest,
  GetFranchiseResponse,
  CreateFranchiseRequest,
  CreateFranchiseResponse,
  ListFranchiseResponse,
  ConfigureFranchiseRequest,
  ConfigureFranchiseResponse,
} from "./types/resources/franchise";

export type {
  IPAsset,
  GetIpAssetRequest,
  GetIpAssetResponse,
  CreateIpAssetRequest,
  CreateIpAssetResponse,
  ListIpAssetRequest,
  ListIpAssetResponse,
} from "./types/resources/ipAsset";

export type {
  License,
  GetLicenseRequest,
  GetLicenseResponse,
  CreateLicenseRequest,
  CreateLicenseResponse,
  CreateLicenseRequestOptions,
  ListLicenseRequest,
  ListLicenseResponse,
} from "./types/resources/license";

export type {
  IPAssetId,
  RelationshipRelateRequest,
  RelationshipRelateResponse,
  RelationshipUnrelateRequest,
  RelationshipUnrelateResponse,
  RelationshipIsRelationshipExpiredRequest,
  RelationshipIsRelationshipExpiredResponse,
  RelationshipIsRelatedRequest,
  RelationshipIsRelatedResponse,
} from "./types/resources/relationship";

export type {
  Collection,
  CollectIPAssetRequest,
  CollectIPAssetResponse,
  ListCollectionsRequest,
  ListCollectionsResponse,
} from "./types/resources/collect";

export type {
  Transaction,
  GetTransactionRequest,
  GetTransactionResponse,
  ListTransactionResponse,
} from "./types/resources/transaction";
