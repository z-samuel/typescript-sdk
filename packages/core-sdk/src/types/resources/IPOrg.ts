import { QueryOptions, TxOptions } from "./helper";

/**
 * Core data model for franchise.
 *
 * @public
 */
export type IPOrg = {
  id: string;
  name: string;
  symbol: string;
  owner: string;
  metadataUrl: string;
  createdAt: string; // ISO 8601
  txHash: string;
};

/**
 * Request type for franchise.get method.
 *
 * @public
 */
export type GetIPOrgRequest = {
  ipOrgId: string;
};

/**
 * Response type for franchise.get method.
 *
 * @public
 */
export type GetIPOrgResponse = {
  ipOrg: IPOrg;
};

/**
 * Request type for franchise.register method.
 *
 * @public
 */
export type RegisterIPOrgRequest = {
  name: string;
  symbol: string;
  owner?: string;
  ipAssetTypes: Array<string>;
  txOptions?: TxOptions;
};

/**
 * Response type for franchise.register method.
 *
 * @public
 */
export type RegisterIPOrgResponse = {
  txHash: string;
  ipOrgId?: string;
};

/**
 * Request type for franchise.list method.
 *
 * @public
 */
export type ListIPOrgRequest = {
  options?: QueryOptions;
};

/**
 * Response type for franchise.list method.
 *
 * @public
 */
export type ListIPOrgResponse = {
  ipOrgs: IPOrg[];
};
