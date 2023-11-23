import { formatAbi } from "abitype";
import { getAddress } from "viem";

export const licenseRegistryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "LicenseRegistered",
    type: "event",
  },
] as const;

export const licenseRegistryReadable = formatAbi(licenseRegistryAbi);

export const licenseRegistryConfig = {
  abi: licenseRegistryAbi,
  address: getAddress(
    process.env.LICENSE_REGISTRY_CONTRACT ||
      process.env.NEXT_PUBLIC_LICENSE_REGISTRY_CONTRACT ||
      "",
  ),
};
