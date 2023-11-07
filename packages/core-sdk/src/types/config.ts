import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";

import { Environment } from "../enums/Environment";

/**
 * Configuration for the SDK Client.
 *
 * @public
 */
export interface StoryCommonConfig {
  readonly environment: Environment;
}

export interface StoryConfig extends StoryCommonConfig {
  readonly signer: Signer;
}

export interface StoryReadOnlyConfig extends StoryCommonConfig {
  readonly provider?: Provider;
}
