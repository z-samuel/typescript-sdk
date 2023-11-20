import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryReadOnlyConfig, Environment } from "../../src";
import * as dotenv from "dotenv";
import { ReadOnlyClient } from "../../src/types/client";

dotenv.config();
chai.use(chaiAsPromised);

describe("IPOrg Read Only Functions", () => {
  let client: ReadOnlyClient;

  before(function () {
    const config: StoryReadOnlyConfig = {
      environment: Environment.TEST,
    };

    client = StoryClient.newReadOnlyClient(config);
  });

  describe("Get IPOrg", async function () {
    it("should return ipOrg when the ipOrg id is valid", async () => {
      const response = await client.ipOrg.get({
        ipOrgId: "0xB32BdE3fBfddAd30a8d824178F00F0adB43DF2e7",
      });

      // Only assert the immutable fields
      expect(response.ipOrg.id).to.equal("7");
    });
  });

  describe("List IPOrgs", async function () {
    it("should return a list of ipOrgs successfully upon query", async () => {
      const response = await client.ipOrg.list();
      expect(response).is.not.null;
    });
  });
});
