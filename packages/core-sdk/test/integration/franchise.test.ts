import { Client } from "../../src/types/client";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, Environment } from "../../src/index";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();
chai.use(chaiAsPromised);

describe("Franchise Functions", () => {
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

  describe("Create Franchise", async function () {
    it("should not throw error when creating a franchise", async () => {
      await expect(
        client.franchise.create({
          franchiseName: "Star War",
          franchiseSymbol: "star",
          franchiseDescription:
            "A timeless space opera franchise created by George Lucas, depicting the battle between the heroic Rebel Alliance and the evil Galactic Empire, entwined with themes of hope, destiny, and the enduring struggle between light and dark.",
        }),
      ).to.not.be.rejected;
    });
  });

  describe("List Franchises", async function () {
    it("should return a list of franchises successfully upon query", async () => {
      const response = await client.franchise.list();
      expect(response).is.not.null;
    });
  });

  // This test requires the wallet to be the same as the franchise owner.
  describe("Configure Franchise", async function () {
    it("should not throw error when configuring a franchise", async () => {
      await expect(
        client.franchise.configure({
          franchiseId: "78",
        }),
      ).to.not.be.rejected;
    });
  });
});
