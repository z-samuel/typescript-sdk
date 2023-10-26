import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryReadOnlyConfig, Environment } from "../../src/index";
import * as dotenv from "dotenv";
import { ReadOnlyClient } from "../../src/types/client";

dotenv.config();
chai.use(chaiAsPromised);

describe("Collect Read Only client integration tests", () => {
  let client: ReadOnlyClient;

  beforeEach(function () {
    const config: StoryReadOnlyConfig = {
      environment: Environment.TEST,
    };

    client = StoryClient.newReadOnlyClient(config);
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
