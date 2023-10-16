import { BigNumberish } from "ethers";

/**
 * Core interface for relationship IPAsset.
 *
 * @public
 */
export interface IPAsset {
  franchiseId: string;
  ipAssetId: string;
}
/**
 * Request interface for relationship.relate method.
 *
 * @public
 */
export interface RelationshipRelateRequest {
  sourceIPAsset: IPAsset;
  destIPAsset: IPAsset;
  ttl?: BigNumberish;
}
/**
 * Response interface for relationship.relate method.
 *
 * @public
 */
export interface RelationshipRelateResponse {
  txHash: string;
}

/**
 * Request interface for relationship.unrelate method.
 *
 * @public
 */
export interface RelationshipUnrelateRequest {
  sourceIPAsset: IPAsset;
  destIPAsset: IPAsset;
  ttl?: BigNumberish;
}

/**
 * Response interface for relationship.unrelate method.
 *
 * @public
 */
export interface RelationshipUnrelateResponse {
  txHash: string;
}
/**
 * Request interface for relationship.isRelationshipExpired method.
 *
 * @public
 */
export interface RelationshipIsRelationshipExpiredRequest {
  sourceIPAsset: IPAsset;
  destIPAsset: IPAsset;
  ttl?: BigNumberish;
}
/**
 * Response interface for relationship.isRelationshipExpired method.
 *
 * @public
 */
export interface RelationshipIsRelationshipExpiredResponse {
  result: boolean;
}
/**
 * Request interface for relationship.isRelated method.
 *
 * @public
 */
export interface RelationshipIsRelatedRequest {
  sourceIPAsset: IPAsset;
  destIPAsset: IPAsset;
  ttl?: BigNumberish;
}
/**
 * Response interface for relationship.isRelated method.
 *
 * @public
 */
export interface RelationshipIsRelatedResponse {
  result: boolean;
}
