import { Signer } from "ethers";
import { Environment } from "../enums/environment";

/**
 * Configuration for the SDK Client.
 *
 * @public
 */
export interface StoryConfig {
  readonly environment: Environment;
  readonly signer: Signer;
}
