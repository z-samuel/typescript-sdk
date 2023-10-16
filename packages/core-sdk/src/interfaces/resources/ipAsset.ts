import { ipAssetType } from "../../enums/ipAssetType";

/**
 * Core data model for IP Asset.
 *
 * @public
 */
export interface ipAsset {
  ipAssetId: string;
  franchiseId: string;
  ipAssetName: string;
  ipAssetType: ipAssetType;
  ownerAddress: string;
  tokenUri: string;
}

/**
 * Request interface for ipAsset.get method.
 *
 * @public
 */
export interface GetIpAssetRequest {
  ipAssetId: string;
  franchiseId: string;
}

/**
 * Response interface for ipAsset.get method.
 *
 * @public
 */
export interface GetIpAssetResponse {
  data: ipAsset;
}

/**
 * Request interface for ipAsset.create method.
 *
 * @public
 */
export interface CreateIpAssetRequest {
  franchiseId: string;
  ipAssetType: ipAssetType;
  ipAssetName: string;
  description: string;
  mediaUrl: string;
  to: string;
  parentIpAssetId: string;
}

/**
 * Response interface for ipAsset.create method.
 *
 * @public
 */
export interface CreateIpAssetResponse {
  txHash: string;
}

/**
 * Request interface for ipAsset.list method.
 *
 * @public
 */
export interface ListIpAssetRequest {
  franchiseId: string;
}

/**
 * Response interface for ipAsset.list method.
 *
 * @public
 */
export interface ListIpAssetResponse {
  data: ipAsset[];
}
