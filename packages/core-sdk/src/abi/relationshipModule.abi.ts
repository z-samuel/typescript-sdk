import { getAddress, parseAbi } from "viem";
import { formatAbi } from "abitype";

import relationshipModuleJson from "./json/RelationshipModule.json";

export const relationshipModuleAbi = relationshipModuleJson;
export const relationshipModuleReadable = formatAbi(relationshipModuleAbi);

export const relationshipModuleConfig = {
  abi: parseAbi(relationshipModuleReadable),
  address: getAddress(
    process.env.RELATIONSHIP_MODULE_CONTRACT ||
      process.env.NEXT_PUBLIC_RELATIONSHIP_MODULE_CONTRACT ||
      "",
  ),
};
