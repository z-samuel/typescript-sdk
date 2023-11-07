import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, Environment } from "../../src/index";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { IPAssetType } from "../../src/enums/IPAssetType";

import { Client } from "../../src/types/client";

dotenv.config();
chai.use(chaiAsPromised);

describe("IP Asset Functions", () => {
  let client: Client;

  before(function () {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

    const config: StoryConfig = {
      environment: Environment.TEST,
      signer: wallet,
    };

    client = StoryClient.newClient(config);
  });

  describe("Create IP Asset", async function () {
    it("should not throw error when creating an IP Asset", async () => {
      await expect(
        client.ipAsset.create({
          franchiseId: "78",
          ipAssetType: IPAssetType.CHARACTER,
          ipAssetName: "Darth Vader",
          description: "fake desc",
          mediaUrl: "/",
          to: "0xf398C12A45Bc409b6C652E25bb0a3e702492A4ab",
          parentIpAssetId: "0",
        }),
      ).to.not.be.rejected;
    });
  });
});
