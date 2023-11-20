export { StoryClient } from "./client";
export { Environment } from "./enums/Environment";
export { IPAssetType } from "./enums/IPAssetType";
export { ResourceType } from "./enums/ResourceType";

export type { StoryConfig, StoryReadOnlyConfig } from "./types/config";

export type {
  IPOrg,
  GetIPOrgRequest,
  GetIPOrgResponse,
  RegisterIPOrgRequest,
  RegisterIPOrgResponse,
  ListIPOrgResponse,
} from "./types/resources/IPOrg";

export type {
  IPAsset,
  GetIpAssetRequest,
  GetIpAssetResponse,
  RegisterIpAssetRequest,
  RegisterIpAssetResponse,
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

// export type {
//   Relationship,
//   RegisterRelationshipRequest,
//   RegisterRelationshipResponse,
//   ListRelationshipRequest,
//   ListRelationshipResponse,
//   GetRelationshipRequest,
//   GetRelationshipResponse,
//   CreateNewTypeRelationshipRequest,
//   CreateNewTypeRelationshipResponse,
// } from "./types/resources/relationship";

export type {
  Transaction,
  GetTransactionRequest,
  GetTransactionResponse,
  ListTransactionResponse,
} from "./types/resources/transaction";
