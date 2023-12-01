import { getAddress, parseAbi } from "viem";
import { formatAbi } from "abitype";
import * as dotenv from "dotenv";

import registrationModuleJson from "./json/RegistrationModule.json";

if (typeof process !== "undefined") {
  dotenv.config();
}

export const registrationModuleAbi = registrationModuleJson;

export const registrationModuleReadable = formatAbi(registrationModuleAbi);

export const registrationModuleConfig = {
  abi: parseAbi(registrationModuleReadable),
  address: getAddress(
    process.env.REGISTRATION_MODULE_CONTRACT ||
      process.env.NEXT_PUBLIC_REGISTRATION_MODULE_CONTRACT ||
      "",
  ),
};
