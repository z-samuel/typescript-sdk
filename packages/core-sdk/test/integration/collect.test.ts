import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, Environment } from "../../src/index";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();
chai.use(chaiAsPromised);

describe("Collect client integration tests", () => {
  let client: StoryClient;

  beforeEach(function () {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

    const config: StoryConfig = {
      environment: Environment.TEST,
      signer: wallet,
    };

    client = new StoryClient(config);
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

  describe("List Collections", async function () {
    it("should return array of collections from the Collect Module", async () => {
      const response = await client.collect.list({
        franchiseId: "78",
      });
      expect(response).to.have.property("data");
      expect(response.data).to.be.an("array"); // Collection[]

      const collection = response.data[0];
      expect(collection).to.have.property("ipAssetId");
      expect(collection).to.have.property("franchiseId");
      expect(collection).to.have.property("totalCollected");

      expect(collection.ipAssetId).to.be.a("string");
      expect(collection.franchiseId).to.be.a("string");
      expect(collection.totalCollected).to.be.a("number");
    });
  });
});
