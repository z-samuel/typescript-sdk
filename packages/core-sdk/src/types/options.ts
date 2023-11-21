export type TxOptions = {
  waitForTransaction?: boolean;
};

export type QueryOptions = {
  pagination?: {
    offset?: number; // starting from 0
    limit?: number;
  };
};
