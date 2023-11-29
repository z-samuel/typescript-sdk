import { Client } from "../../src/types/client";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, IPAssetType } from "../../src";
import * as dotenv from "dotenv";
import { sepolia } from "viem/chains";
import { getAddress, Hex, http, PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { WalletClient } from "viem";

dotenv.config();
chai.use(chaiAsPromised);
chai.config.truncateThreshold = 0;

describe("License Functions", () => {
  let client: Client;
  let senderAddress: string;
  let wallet: PrivateKeyAccount;

  before(function () {
    wallet = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

    const config: StoryConfig = {
      chain: sepolia,
      transport: http(process.env.RPC_PROVIDER_URL),
      account: wallet,
    };

    senderAddress = config.account.address;
    client = StoryClient.newClient(config);
  });

  describe("Non-commercial license registration", async function () {
    it("should be able to register a license NFT (don't wait for txn)", async () => {
      const waitForTransaction: boolean = false;
      const createLicenseNftRequest = {
        ipOrgId: "0xb422E54932c1dae83E78267A4DD2805aa64A8061",
        isCommercial: false,
        licensee: wallet.address,
        preHooksCalldata: [],
        postHooksCalldata: [],
        txOptions: {
          waitForTransaction,
        },
      };

      const response = await expect(client.license.create(createLicenseNftRequest)).to.not.be
        .rejected;

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.empty;
    });

    it("should be able to register a license NFT (wait for txn)", async () => {
      const waitForTransaction: boolean = true;
      const createLicenseNftRequest = {
        ipOrgId: "0xb422E54932c1dae83E78267A4DD2805aa64A8061",
        isCommercial: false,
        licensee: wallet.address,
        preHooksCalldata: [],
        postHooksCalldata: [],
        txOptions: {
          waitForTransaction,
        },
      };

      const response = await expect(client.license.create(createLicenseNftRequest)).to.not.be
        .rejected;
      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.empty;

      expect(response.licenseId).to.be.a("string");
      expect(response.licenseId).not.empty;
    });

    it("should be able to register an IPA-bound license (don't wait for txn)", async () => {
      const waitForTransaction: boolean = false;
      const createIpaBoundLicenseRequest = {
        ipOrgId: "0xb422E54932c1dae83E78267A4DD2805aa64A8061",
        isCommercial: false,
        ipaId: 1,
        preHooksCalldata: [],
        postHooksCalldata: [],
        txOptions: {
          waitForTransaction,
        },
      };

      const response = await expect(client.license.create(createIpaBoundLicenseRequest)).to.not.be
        .rejected;

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.empty;
    });

    it("should be able to register an IPA-bound license (wait for txn)", async () => {
      const waitForTransaction: boolean = true;
      const createIpaBoundLicenseRequest = {
        ipOrgId: "0xb422E54932c1dae83E78267A4DD2805aa64A8061",
        isCommercial: false,
        ipaId: 1,
        preHooksCalldata: [],
        postHooksCalldata: [],
        txOptions: {
          waitForTransaction,
        },
      };

      const response = await expect(client.license.create(createIpaBoundLicenseRequest)).to.not.be
        .rejected;

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.empty;

      expect(response.licenseId).to.be.a("string");
      expect(response.licenseId).not.empty;
    });
  });
});
