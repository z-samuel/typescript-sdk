import { getAddress, parseAbi } from "viem";
import { formatAbi } from "abitype";
import * as dotenv from "dotenv";

import ipOrgControllerRawAbi from "./json/IPOrgController.json";

if (typeof process !== "undefined") {
  dotenv.config();
}

export const ipOrgControllerAbi = ipOrgControllerRawAbi;

export const ipOrgControllerReadable = formatAbi(ipOrgControllerAbi);

export const ipOrgControllerConfig = {
  abi: parseAbi(ipOrgControllerReadable),
  address: getAddress(
    process.env.IP_ORG_CONTROLLER_CONTRACT ||
      process.env.NEXT_PUBLIC_IP_ORG_CONTROLLER_CONTRACT ||
      "",
  ),
};
