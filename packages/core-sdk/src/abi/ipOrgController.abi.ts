import { getAddress, parseAbi } from "viem";
import { formatAbi } from "abitype";
import * as dotenv from "dotenv";

if (typeof process !== "undefined") {
  dotenv.config();
}

export const ipOrgControllerAbi = [
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

export const ipOrgControllerReadable = formatAbi(ipOrgControllerAbi);

export const ipOrgControllerConfig = {
  abi: parseAbi(ipOrgControllerReadable),
  address: getAddress(
    process.env.IP_ORG_CONTROLLER_CONTRACT ||
      process.env.NEXT_PUBLIC_IP_ORG_CONTROLLER_CONTRACT ||
      "",
  ),
};
