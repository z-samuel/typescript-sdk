import { ResourceType } from "../../enums/ResourceType";
import { ActionType } from "../../enums/ActionType";
import { QueryOptions } from "./helper";

/**
 * Core data model for transactions.
 *
 * @public
 */
export type Transaction = {
  id: string;
  txHash: string;
  ipOrgId: string;
  creator: string;
  resourceId: string;
  resourceType: ResourceType;
  actionType: ActionType;
  createdAt: string; // ISO8601
};

/**
 * Request type for transaction.get method.
 *
 * @public
 */
export type GetTransactionRequest = {
  transactionId: string;
};

/**
 * Response type for transaction.get method.
 *
 * @public
 */
export type GetTransactionResponse = {
  transaction: Transaction;
};

/**
 * Response type for transaction.list method.
 *
 * @public
 */
export type ListTransactionRequest = {
  ipOrgId?: string;
  options?: QueryOptions;
};

/**
 * Response type for transaction.list method.
 *
 * @public
 */
export type ListTransactionResponse = {
  transactions: Transaction[];
};
