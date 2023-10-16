/**
 * Core data model for Collect.
 *
 * @public
 */
export interface Collection {
  franchiseId: string;
  ipAssetId: string;
  totalCollected: number;
}

/**
 * Request interface for collect.collect method.
 *
 * @public
 */
export interface CollectIPAssetRequest {
  franchiseId: string;
  ipAssetId: string;
  collector: string;
}

/**
 * Response interface for collect.collect method.
 *
 * @public
 */
export interface CollectIPAssetResponse {
  txHash: string;
}

/**
 * Request interface for collect.list method.
 *
 * @public
 */
export interface ListCollectionsRequest {
  franchiseId: string;
}

/**
 * Response interface for collect.list method.
 *
 * @public
 */
export interface ListCollectionsResponse {
  data: Collection[];
}
