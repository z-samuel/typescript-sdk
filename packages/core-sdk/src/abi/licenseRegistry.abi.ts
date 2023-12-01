import { formatAbi } from "abitype";
import { getAddress, parseAbi } from "viem";

import licenseRegistryJson from "./json/LicenseRegistry.json";

export const licenseRegistryAbi = licenseRegistryJson;
export const licenseRegistryReadable = formatAbi(licenseRegistryAbi);

export const licenseRegistryConfig = {
  abi: parseAbi(licenseRegistryReadable),
  address: getAddress(
    process.env.LICENSE_REGISTRY_CONTRACT ||
      process.env.NEXT_PUBLIC_LICENSE_REGISTRY_CONTRACT ||
      "",
  ),
};
