import { getAddress, parseAbi } from "viem";
import { formatAbi } from "abitype";
import * as dotenv from "dotenv";

if (typeof process !== "undefined") {
  dotenv.config();
}

export const ipOrgRegistryAbi = [
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
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "owner_", type: "address" },
      { indexed: false, internalType: "address", name: "ipAssetOrg_", type: "address" },
      { indexed: false, internalType: "string", name: "name_", type: "string" },
      { indexed: false, internalType: "string", name: "symbol_", type: "string" },
    ],
    name: "IPOrgRegistered",
    type: "event",
  },
] as const;

export const ipOrgRegistryReadable = formatAbi(ipOrgRegistryAbi);

export const ipOrgRegistryConfig = {
  abi: parseAbi(ipOrgRegistryReadable),
  address: getAddress(
    process.env.IPORG_REGISTRY_CONTRACT || process.env.NEXT_PUBLIC_IPORG_REGISTRY_CONTRACT || "",
  ),
};
