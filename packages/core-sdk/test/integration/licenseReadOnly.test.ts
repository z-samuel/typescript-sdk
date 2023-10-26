import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryReadOnlyConfig, Environment } from "../../src/index";
import * as dotenv from "dotenv";
import { ReadOnlyClient } from "../../src/types/client";

dotenv.config();
chai.use(chaiAsPromised);

describe("License Read Only Functions", () => {
  let client: ReadOnlyClient;

  before(async function () {
    const config: StoryReadOnlyConfig = {
      environment: Environment.TEST,
    };

    client = StoryClient.newReadOnlyClient(config);
  });

  describe("Get License", async function () {
    it("should return a license when the license id is valid", async () => {
      await expect(
        client.license.get({
          licenseId: "49", // Provide a valid license ID
        }),
      ).to.not.be.rejected;
    });

    it("should handle errors when retrieving a license", async () => {
      try {
        await client.license.get({
          licenseId: "invalid_id", // Provide an invalid license ID
        });
        expect.fail("Function should have thrown an error");
      } catch (error) {}
    });
  });

  describe("List Licenses", async function () {
    const mockListLicenseRequest = {
      franchiseId: "66",
      ipAssetId: "49",
    };

    it("should list all licenses", async () => {
      await expect(client.license.list(mockListLicenseRequest)).to.not.be.rejected;
    });

    it("should handle errors when listing licenses", async () => {
      try {
        await client.license.list(mockListLicenseRequest);
        expect.fail("Function should have thrown an error");
      } catch (error) {}
    });
  });
});
