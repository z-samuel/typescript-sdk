import { QueryOptions, TxOptions } from "../options";

/**
 * Core type for relationship IPAsset.
 *
 * @public
 */
export type IPAssetId = {
  franchiseId: string;
  ipAssetId: string;
};
/**
 * Request type for relationship.relate method.
 *
 * @public
 */
export type RelationshipRelateRequest = {
  sourceIPAsset: IPAssetId;
  destIPAsset: IPAssetId;
  ttl?: string;
};
/**
 * Response type for relationship.relate method.
 *
 * @public
 */
export type RelationshipRelateResponse = {
  txHash: string;
};

/**
 * Request type for relationship.unrelate method.
 *
 * @public
 */
export type RelationshipUnrelateRequest = {
  sourceIPAsset: IPAssetId;
  destIPAsset: IPAssetId;
  ttl?: string;
};

/**
 * Response type for relationship.unrelate method.
 *
 * @public
 */
export type RelationshipUnrelateResponse = {
  txHash: string;
};
/**
 * Request type for relationship.isRelationshipExpired method.
 *
 * @public
 */
export type RelationshipIsRelationshipExpiredRequest = {
  sourceIPAsset: IPAssetId;
  destIPAsset: IPAssetId;
  ttl?: string;
};
/**
 * Response type for relationship.isRelationshipExpired method.
 *
 * @public
 */
export type RelationshipIsRelationshipExpiredResponse = {
  result: boolean;
};
/**
 * Request type for relationship.isRelated method.
 *
 * @public
 */
export type RelationshipIsRelatedRequest = {
  sourceIPAsset: IPAssetId;
  destIPAsset: IPAssetId;
  ttl?: string;
};
/**
 * Response type for relationship.isRelated method.
 *
 * @public
 */
export type RelationshipIsRelatedResponse = {
  result: boolean;
};

enum Relatables {
  UNDEFINED,
  IPA,
  IPORG_ENTRY,
  LICENSE,
  ADDRESS,
  EXTERNAL_NFT,
}

export interface RelatedElements {
  src: Relatables;
  dst: Relatables;
}

export type Relationship = {
  id: string;
  type: string; // i.e. "APPEARS_IN"
  typeId: string;
  srcContract: string;
  srcTokenId: string;
  srcName?: string;
  dstContract: string;
  dstTokenId: string;
  dstName?: string;
  ttl?: number; // based in seconds
  registeredAt: string; // ISO 8601
  txHash: string;
};

export type RegisterRelationshipRequest = {
  ipOrgId: string;
  relType: string;
  srcContract: string;
  srcTokenId: string;
  srcType?: string;
  dstContract: string;
  dstTokenId: string;
  dstType?: string;
  preHookData: Record<string, unknown>[];
  postHookData: Record<string, unknown>[];
  txOptions?: TxOptions;
};

export type RegisterRelationshipResponse = {
  txHash: string;
  relationshipId?: string;
  success?: boolean;
};

export type GetRelationshipRequest = {
  relationshipId: string;
  options?: QueryOptions;
};

export type GetRelationshipResponse = {
  relationship: Relationship;
};

export type ListRelationshipRequest = {
  tokenId: string;
  contract?: string;
  options?: QueryOptions;
};
export type ListRelationshipResponse = {
  relationships: Relationship[];
};

export type RegisterRelationshipTypeRequest = {
  ipOrgId: string;
  relType: string;
  relatedElements: RelatedElements;
  allowedSrcs: string[];
  allowedDsts: string[];
  preHooksConfig: Record<string, unknown>[];
  postHooksConfig: Record<string, unknown>[];
  txOptions?: TxOptions;
};

export type RegisterRelationshipTypeResponse = {
  txHash: string;
  success?: boolean;
  relationshipId?: string;
};
