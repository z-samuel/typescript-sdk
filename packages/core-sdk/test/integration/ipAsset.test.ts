import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, Client } from "../../src";
import * as dotenv from "dotenv";
import { sepolia } from "viem/chains";
import { Account, Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config();
chai.use(chaiAsPromised);
chai.config.truncateThreshold = 0;

describe("IP Asset Functions", () => {
  let client: Client;
  let senderAddress: string;

  before(function () {
    const config: StoryConfig = {
      chain: sepolia,
      transport: http(process.env.RPC_PROVIDER_URL),
      account: privateKeyToAccount((process.env.WALLET_PRIVATE_KEY || "0x") as Hex),
    };

    senderAddress = config.account.address;
    client = StoryClient.newClient(config);
  });

  describe("Create IP Asset", async function () {
    it("should not throw error when creating an IP Asset", async () => {
      const waitForTransaction: boolean = true;
      const response = await expect(
        client.ipAsset.create({
          name: "Test",
          type: 0,
          ipOrgId: "0x1eBb43775fCC45CF05eaa96182C8762220e17941",
          owner: senderAddress,
          contentHash: "",
          mediaUrl: "",
          txOptions: {
            waitForTransaction: waitForTransaction,
          },
        }),
      ).to.not.be.rejected;

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.empty;

      if (waitForTransaction) {
        expect(response.ipAssetId).to.be.a("string");
        expect(response.ipAssetId).not.empty;
      }
    });

    it("should not throw error when creating an IP Asset without owner field", async () => {
      const waitForTransaction: boolean = true;
      const response = await expect(
        client.ipAsset.create({
          name: "Test",
          type: 0,
          ipOrgId: "0x1eBb43775fCC45CF05eaa96182C8762220e17941",
          contentHash: "",
          mediaUrl: "",
          txOptions: {
            waitForTransaction: waitForTransaction,
          },
        }),
      ).to.not.be.rejected;

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.empty;

      if (waitForTransaction) {
        expect(response.ipAssetId).to.be.a("string");
        expect(response.ipAssetId).not.empty;
      }
    });

    it("should not throw error when creating an IP Asset with a hook", async () => {
      const waitForTransaction: boolean = true;
      const response = await expect(
        client.ipAsset.create({
          name: "Test",
          type: 0,
          ipOrgId: "0x2554E198752d0F086c8b885CbCc5d663365673C2",
          owner: senderAddress,
          contentHash: "",
          mediaUrl: "",
          preHookData: [
            {
              interface: "address",
              data: ["0xf398C12A45Bc409b6C652E25bb0a3e702492A4ab"],
            },
          ],
          txOptions: {
            waitForTransaction: waitForTransaction,
          },
        }),
      ).to.not.be.rejected;

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.empty;

      if (waitForTransaction) {
        expect(response.ipAssetId).to.be.a("string");
        expect(response.ipAssetId).not.empty;
      }
    });

    it("should throw error when creating an IP Asset with a hook, without hook data", async () => {
      const waitForTransaction: boolean = true;
      const response = await expect(
        client.ipAsset.create({
          name: "Test",
          type: 0,
          ipOrgId: "0x2554E198752d0F086c8b885CbCc5d663365673C2",
          owner: senderAddress,
          contentHash: "",
          mediaUrl: "",
          txOptions: {
            waitForTransaction: waitForTransaction,
          },
        }),
      ).to.be.rejected;
    });
  });
});
