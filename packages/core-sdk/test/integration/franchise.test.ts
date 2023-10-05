import { expect } from "chai";
import { StoryClient, StoryConfig, Environment } from "../../src/index";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

describe("Franchise Functions", () => {
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

  describe("Get Franchise", async function () {
    it("should return franchise when the franchise id is valid", async () => {
      const response = await client.franchise.get({
        franchiseId: "7",
      });
      expect(response.franchise.franchiseId).to.equal("7");
      expect(response.franchise.franchiseName).to.equal("Star Wars");
    });
  });

  describe("Create Franchise", async function () {
    it("should not throw error when creating a franchise", async () => {
      try {
        await client.franchise.create({
          franchiseName: "Star War",
          franchiseSymbol: "star",
          franchiseDescription:
            "A timeless space opera franchise created by George Lucas, depicting the battle between the heroic Rebel Alliance and the evil Galactic Empire, entwined with themes of hope, destiny, and the enduring struggle between light and dark.",
        });
      } catch (error) {
        expect.fail(`Function should not have thrown any error, but it threw: ${error}`);
      }
    });
  });
});
