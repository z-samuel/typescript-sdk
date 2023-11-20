import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, Environment, IPAssetType } from "../../src";
import * as dotenv from "dotenv";
import { Client } from "../../src/types/client";
import { sepolia } from "viem/chains";
import { Hex, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

dotenv.config();
chai.use(chaiAsPromised);

describe("IP Asset Functions", () => {
  let client: Client;
  let senderAddress: string;

  before(function () {
    const config: StoryConfig = {
      environment: Environment.TEST,
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
        client.ipAsset.register({
          name: "Test",
          type: IPAssetType.STORY,
          ipOrgId: "0xFe4141e179811326274E5bc1173C61E6Be5a6A11",
          owner: senderAddress,
          hash: "",
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
  });
});
