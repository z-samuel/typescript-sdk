export { StoryClient } from "./client";
export { Environment } from "./enums/environment";
export { ipAssetType } from "./enums/ipAssetType";

export type { StoryConfig } from "./interfaces/config";

export type {
  Franchise,
  GetFranchiseRequest,
  GetFranchiseResponse,
  CreateFranchiseRequest,
  CreateFranchiseResponse,
  ListFranchiseResponse,
  ConfigureFranchiseRequest,
  ConfigureFranchiseResponse,
} from "./interfaces/resources/franchise";

export type {
  ipAsset,
  GetIpAssetRequest,
  GetIpAssetResponse,
  CreateIpAssetRequest,
  CreateIpAssetResponse,
  ListIpAssetRequest,
  ListIpAssetResponse,
} from "./interfaces/resources/ipAsset";

export type {
  License,
  GetLicenseRequest,
  GetLicenseResponse,
  CreateLicenseRequest,
  CreateLicenseResponse,
  CreateLicenseRequestOptions,
  ListLicenseRequest,
  ListLicenseResponse,
} from "./interfaces/resources/license";

export type {
  IPAsset,
  RelationshipRelateRequest,
  RelationshipRelateResponse, 
  RelationshipUnrelateRequest,
  RelationshipUnrelateResponse,
  RelationshipIsRelationshipExpiredRequest,
  RelationshipIsRelationshipExpiredResponse,
  RelationshipIsRelatedRequest,
  RelationshipIsRelatedResponse,
} from "./interfaces/resources/relationship";

export type {
  Collection,
  CollectIPAssetRequest,
  CollectIPAssetResponse,
  ListCollectionsRequest,
  ListCollectionsResponse,
} from "./interfaces/resources/collect";

export type {
  Transaction,
  ResourceType,
  GetTransactionRequest,
  GetTransactionResponse,
  ListTransactionResponse,
} from "./interfaces/resources/transaction";