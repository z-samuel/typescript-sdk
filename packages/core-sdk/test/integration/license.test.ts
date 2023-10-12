import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, Environment } from "../../src/index";
import { BigNumber, ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();
chai.use(chaiAsPromised);

describe("License Functions", () => {
  let client: StoryClient;

  before(async function () {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY as string, provider);

    const config: StoryConfig = {
      environment: Environment.TEST,
      signer: wallet,
    };

    client = new StoryClient(config);
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

  describe("Create License", async function () {
    it("should create a license", async () => {
      await expect(
        client.license.create({
          franchiseId: "66",
          ipAssetId: "1000000000001",
          licenseURI:
            "https://project-nova-content-staging.s3.us-east-2.amazonaws.com/kbw/movie.png",
        }),
      ).to.not.be.rejected;
    });
  });
});
