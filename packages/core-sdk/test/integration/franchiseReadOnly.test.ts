import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryReadOnlyConfig, Environment } from "../../src/index";
import * as dotenv from "dotenv";
import { ReadOnlyClient } from "../../src/types/client";

dotenv.config();
chai.use(chaiAsPromised);

describe("Franchise Read Only Functions", () => {
  let client: ReadOnlyClient;

  before(function () {
    const config: StoryReadOnlyConfig = {
      environment: Environment.TEST,
    };

    client = StoryClient.newReadOnlyClient(config);
  });

  describe("Get Franchise", async function () {
    it("should return franchise when the franchise id is valid", async () => {
      const response = await client.franchise.get({
        franchiseId: "78",
      });
      // Only assert the immutable fields
      expect(response.data.franchiseId).to.equal("78");
    });
  });
});
