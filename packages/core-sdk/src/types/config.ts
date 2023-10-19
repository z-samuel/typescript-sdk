import { Signer } from "ethers";

import { Environment } from "../enums/Environment";

/**
 * Configuration for the SDK Client.
 *
 * @public
 */
export type StoryConfig = {
  readonly environment: Environment;
  readonly signer: Signer;
};
