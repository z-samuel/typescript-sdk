import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryReadOnlyConfig, Environment } from "../../src/index";
import * as dotenv from "dotenv";
import { ReadOnlyClient } from "../../src/types/client";

dotenv.config();
chai.use(chaiAsPromised);

describe("IP Asset Read Only Functions", () => {
  let client: ReadOnlyClient;

  before(function () {
    const config: StoryReadOnlyConfig = {
      environment: Environment.TEST,
    };

    client = StoryClient.newReadOnlyClient(config);
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

  describe("List IP assets", async function () {
    it("should return a list of IP assets successfully upon query", async () => {
      const response = await client.ipAsset.list({
        franchiseId: "78",
      });
      expect(response).is.not.null;
    });
  });
});
