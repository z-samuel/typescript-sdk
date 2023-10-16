/**
 * Core data model for transactions.
 *
 * @public
 */
export interface Transaction {
  txId: string;
  txHash: string;
  createdAt: string; // ISO8601
  creatorAddress: string;
  type: ResourceType;
  resourceId: string;
  franchiseId: string;
}

export enum ResourceType {
  FRANCHISE,
  IP_ASSET,
  LICENSE,
  RELATIONSHIP,
  COLLECT,
}

/**
 * Request interface for transaction.get method.
 *
 * @public
 */
export interface GetTransactionRequest {
  txId: string;
}

/**
 * Response interface for transaction.get method.
 *
 * @public
 */
export interface GetTransactionResponse {
  data: Transaction;
}

/**
 * Response interface for transaction.list method.
 *
 * @public
 */
export interface ListTransactionResponse {
  data: Transaction[];
}
