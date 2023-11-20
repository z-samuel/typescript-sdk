import { getAddress, parseAbi } from "viem";
import { formatAbi } from "abitype";
import * as dotenv from "dotenv";

if (typeof process !== "undefined") {
  dotenv.config();
}

export const ipAssetRegistryAbi = [
  {
    inputs: [
      { internalType: "address", name: "ipOrg_", type: "address" },
      {
        components: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "uint64", name: "ipAssetType", type: "uint64" },
          { internalType: "bytes32", name: "hash", type: "bytes32" },
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
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "ipAssetId_", type: "uint256" },
      { indexed: true, internalType: "address", name: "ipOrg_", type: "address" },
      { indexed: false, internalType: "uint256", name: "ipOrgAssetId_", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner_", type: "address" },
      { indexed: false, internalType: "string", name: "name_", type: "string" },
      { indexed: true, internalType: "uint64", name: "ipAssetType_", type: "uint64" },
      { indexed: false, internalType: "bytes32", name: "hash_", type: "bytes32" },
    ],
    name: "IPAssetRegistered",
    type: "event",
  },
] as const;

export const ipAssetRegistryReadable = formatAbi(ipAssetRegistryAbi);

export const ipAssetRegistryConfig = {
  abi: parseAbi(ipAssetRegistryReadable),
  address: getAddress(
    process.env.IPASSSET_REGISTRY_CONTRACT ||
      process.env.NEXT_PUBLIC_IPASSSET_REGISTRY_CONTRACT ||
      "",
  ),
};
