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
}

/**
 * Response interface for ipAsset.get method.
 *
 * @public
 */
export interface GetIpAssetResponse {
  ipAsset: ipAsset;
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
 * Response interface for ipAsset.list method.
 *
 * @public
 */
export interface ListIpAssetResponse {
  ipAssets: ipAsset[];
}
