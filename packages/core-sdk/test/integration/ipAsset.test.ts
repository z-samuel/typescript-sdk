import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, Environment } from "../../src/index";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { ipAssetType } from "../../src/enums/ipAssetType";

dotenv.config();
chai.use(chaiAsPromised);

describe("IP Asset Functions", () => {
  let client: StoryClient;

  before(function () {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

    const config: StoryConfig = {
      environment: Environment.TEST,
      signer: wallet,
    };

    client = new StoryClient(config);
  });

  describe("Get IP Asset", async function () {
    it("should return asset when the asset id is valid", async () => {
      const response = await client.ipAsset.get({
        ipAssetId: "1",
        franchiseId: "78",
      });
      expect(response.data).is.not.null;
    });
  });

  describe("Create IP Asset", async function () {
    it("should not throw error when creating an IP Asset", async () => {
      await expect(
        client.ipAsset.create({
          franchiseId: "78",
          ipAssetType: ipAssetType.CHARACTER,
          ipAssetName: "Darth Vader",
          description: "fake desc",
          mediaUrl: "/",
          to: "0xf398C12A45Bc409b6C652E25bb0a3e702492A4ab",
          parentIpAssetId: "0",
        }),
      ).to.not.be.rejected;
    });
  });

  describe("List IP assets", async function () {
    it("should return a list of IP assets successfully upon query", async () => {
      const response = await client.ipAsset.list({
        franchiseId: "78",
      });
      expect(response).is.not.null;
    });
  });
});
