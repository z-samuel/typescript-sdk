import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, IPAssetType, Client } from "../../src";
import * as dotenv from "dotenv";
import { sepolia } from "viem/chains";
import { getAddress, Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config();
chai.use(chaiAsPromised);
chai.config.truncateThreshold = 0;

describe("IPOrg Functions", () => {
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

  describe("Create IPOrg", async function () {
    it("should not throw error when creating a ipOrg", async () => {
      const waitForTransaction: boolean = true;
      const response = await expect(
        client.ipOrg.create({
          name: "Alice In Wonderland",
          symbol: "AIW",
          owner: senderAddress,
          ipAssetTypes: [IPAssetType.STORY.toString(), IPAssetType.CHARACTER.toString()],
          txOptions: {
            waitForTransaction: waitForTransaction,
          },
        }),
      ).to.not.be.rejected;

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.empty;

      if (waitForTransaction) {
        expect(response.ipOrgId).to.be.a("string");
        expect(response.ipOrgId).not.empty;
      }
    });

    it("should not throw error when creating a ipOrg without the owner field", async () => {
      const waitForTransaction: boolean = true;
      const response = await expect(
        client.ipOrg.create({
          name: "Alice In Wonderland",
          symbol: "AIW",
          ipAssetTypes: [IPAssetType.STORY.toString(), IPAssetType.CHARACTER.toString()],
          txOptions: {
            waitForTransaction: waitForTransaction,
          },
        }),
      ).to.not.be.rejected;

      expect(response.txHash).to.be.a("string");
      expect(response.txHash).not.empty;

      if (waitForTransaction) {
        expect(response.ipOrgId).to.be.a("string");
        expect(response.ipOrgId).not.empty;
      }
    });
  });
});
