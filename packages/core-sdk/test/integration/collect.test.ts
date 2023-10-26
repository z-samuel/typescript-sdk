import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, Environment } from "../../src/index";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Client } from "../../src/types/client";

dotenv.config();
chai.use(chaiAsPromised);

describe("Collect client integration tests", () => {
  let client: Client;

  beforeEach(function () {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

    const config: StoryConfig = {
      environment: Environment.TEST,
      signer: wallet,
    };

    client = StoryClient.newClient(config);
  });

  describe("Collect an IP Asset", async function () {
    it("should return txHash when the collect transaction is successful", async () => {
      const response = await client.collect.collect({
        franchiseId: "78",
        ipAssetId: "1",
        collector: "0xe17aA3E4BFe9812b64354e5275A211216F1dee2a",
      });

      expect(response).to.have.property("txHash");
      expect(response.txHash).to.be.a("string");
    });
  });
});
