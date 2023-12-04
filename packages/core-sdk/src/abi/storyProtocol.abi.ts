import { getAddress, parseAbi } from "viem";
import { formatAbi } from "abitype";
import * as dotenv from "dotenv";

import storyProtocolJson from "./json/StoryProtocol.json";
import errorsJson from "./json/Errors.json";

if (typeof process !== "undefined") {
  dotenv.config();
}

export const storyProtocolAbi = storyProtocolJson;
export const ErrorsAbi = errorsJson;

const storyProtocolMerged = Object.assign({}, storyProtocolAbi, ErrorsAbi);

export const storyProtocolReadable = formatAbi(storyProtocolMerged);

export const storyProtocolConfig = {
  abi: parseAbi(storyProtocolReadable),
  address: getAddress(
    process.env.STORY_PROTOCOL_CONTRACT || process.env.NEXT_PUBLIC_STORY_PROTOCOL_CONTRACT || "",
  ),
};
