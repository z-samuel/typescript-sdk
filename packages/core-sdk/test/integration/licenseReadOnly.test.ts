import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryReadOnlyConfig, ListLicenseRequest } from "../../src/index";
import * as dotenv from "dotenv";
import { ReadOnlyClient } from "../../src/types/client";

dotenv.config();
chai.use(chaiAsPromised);

describe("License Read Only Functions", () => {
  let client: ReadOnlyClient;

  before(async function () {
    const config: StoryReadOnlyConfig = {};

    client = StoryClient.newReadOnlyClient(config);
  });

  describe("Get License", async function () {
    it("should return a license when the license id is valid", async () => {
      await expect(
        client.license.get({
          licenseId: "5", // Provide a valid license ID
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
    const mockListLicenseRequest: ListLicenseRequest = {
      ipOrgId: "0xb422E54932c1dae83E78267A4DD2805aa64A8061",
      ipAssetId: "1",
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

    it("should return a list of licenses successfully without options", async () => {
      const response = await client.license.list();
      expect(response).is.not.null;
      expect(response.licenses.length).to.gt(0);
    });

    it("should return a list of ipAssets if the options are invalid", async () => {
      const options = {
        options: {},
      } as ListLicenseRequest;
      const response = await client.license.list(options);
      expect(response).is.not.null;
      expect(response.licenses.length).to.gt(0);
    });
  });
});
