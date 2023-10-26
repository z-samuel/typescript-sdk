import { AxiosInstance } from "axios";

import { TransactionReadOnlyClient } from "./transactionReadOnly";

/**
 * TransactionClient allows you to view and monitor transactions on
 * Story Protocol.
 */
export class TransactionClient extends TransactionReadOnlyClient {
  constructor(httpClient: AxiosInstance) {
    super(httpClient);
  }
}
