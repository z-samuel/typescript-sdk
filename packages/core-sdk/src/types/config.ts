import { Account, Chain, Transport } from "viem";

/**
 * Configuration for the SDK Client.
 *
 * @public
 */
export interface StoryConfig extends StoryReadOnlyConfig {
  readonly account: Account;
}

export interface StoryReadOnlyConfig {
  readonly chain?: Chain;
  readonly transport?: Transport;
}
