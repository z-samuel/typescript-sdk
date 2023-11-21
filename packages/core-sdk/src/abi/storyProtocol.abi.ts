import { getAddress, parseAbi } from "viem";
import { formatAbi } from "abitype";
import * as dotenv from "dotenv";

if (typeof process !== "undefined") {
  dotenv.config();
}

export const storyProtocolAbi = [
  {
    inputs: [
      { internalType: "address", name: "owner_", type: "address" },
      { internalType: "string", name: "name_", type: "string" },
      { internalType: "string", name: "symbol_", type: "string" },
      { internalType: "string[]", name: "ipAssetTypes_", type: "string[]" },
    ],
    name: "registerIpOrg",
    outputs: [{ internalType: "address", name: "ipOrg_", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "ipOrg_", type: "address" },
      {
        components: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "uint64", name: "ipAssetType", type: "uint64" },
          { internalType: "bytes32", name: "hash", type: "bytes32" },
          { internalType: "string", name: "mediaUrl", type: "string" },
        ],
        internalType: "struct Registration.RegisterIPAssetParams",
        name: "params_",
        type: "tuple",
      },
      { internalType: "bytes[]", name: "preHooksData_", type: "bytes[]" },
      { internalType: "bytes[]", name: "postHooksData_", type: "bytes[]" },
    ],
    name: "registerIPAsset",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const storyProtocolReadable = formatAbi(storyProtocolAbi);

export const storyProtocolConfig = {
  abi: parseAbi(storyProtocolReadable),
  address: getAddress(
    process.env.STORY_PROTOCOL_CONTRACT || process.env.NEXT_PUBLIC_STORY_PROTOCOL_CONTRACT || "",
  ),
};
