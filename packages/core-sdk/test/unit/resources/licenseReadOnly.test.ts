import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { LicenseReadOnlyClient } from "../../../src/resources/licenseReadOnly";
import { AxiosInstance } from "axios";
import { createMock } from "../testUtils";
import * as sinon from "sinon";
import { PublicClient } from "viem";
import { ListLicenseRequest } from "../../../src";

chai.use(chaiAsPromised);

describe("Test LicenseReadOnlyClient", function () {
  let licenseClient: LicenseReadOnlyClient;
  let axiosMock: AxiosInstance;
  let rpcMock: PublicClient;

  beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    rpcMock = createMock<PublicClient>();
    licenseClient = new LicenseReadOnlyClient(axiosMock, rpcMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("Test license.get", function () {
    it("should return a license when the license ID is valid", async function () {
      axiosMock.get = sinon.stub().returns({
        data: {
          license: {
            id: "24",
            status: 3,
            licensor: "0xf398c12a45bc409b6c652e25bb0a3e702492a4ab",
            revoker: "0xf398c12a45bc409b6c652e25bb0a3e702492a4ab",
            ipOrgId: "0xb422e54932c1dae83e78267a4dd2805aa64a8061",
            licenseeType: 1,
            ipAssetId: "1",
            parentLicenseId: "0",
            termIds: [
              "0x4e46545f53484152455f414c494b45000000000000000000000000000000000f",
              "0x4c4943454e534f525f415050524f56414c000000000000000000000000000011",
              "0x4c4943454e534f525f49504f52475f4f525f504152454e540000000000000018",
            ],
            termsData: [
              "0x0000000000000000000000000000000000000000000000000000000000000001",
              "0x0000000000000000000000000000000000000000000000000000000000000001",
              "0x0000000000000000000000000000000000000000000000000000000000000001",
            ],
            createdAt: "2023-11-23T02:55:36Z",
            txHash: "0x000645882d175d1facd646f3ecca0bbf31a9b9697d3d3f3a564ce9c885d7eeb2",
          },
        },
      });

      const response = await licenseClient.get({
        licenseId: "49",
      });

      expect(response.license).to.be.an("object");
      expect(response.license.id).to.be.a("string");
      expect(response.license.status).to.be.a("number");
      expect(response.license.licensor).to.be.a("string");
      expect(response.license.revoker).to.be.a("string");
      expect(response.license.ipOrgId).to.be.a("string");
      expect(response.license.licenseeType).to.be.a("number");
      expect(response.license.ipAssetId).to.be.a("string");
      expect(response.license.parentLicenseId).to.be.a("string");
      expect(response.license.termIds).to.be.an("array");
      expect(response.license.termIds[0]).to.be.a("string");
      expect(response.license.termsData).to.be.an("array");
      expect(response.license.termsData[0]).to.be.a("string");
      expect(response.license.createdAt).to.be.a("string");
      expect(response.license.txHash).to.be.a("string");
    });

    it("should throw an error", async function () {
      axiosMock.get = sinon.stub().rejects(new Error("HTTP 500"));

      await expect(
        licenseClient.get({
          licenseId: "123",
        }),
      ).to.be.rejectedWith("HTTP 500");
    });

    it("should throw an error when the license ID is invalid", async function () {
      await expect(
        licenseClient.get({
          licenseId: "abc",
        }),
      ).to.be.rejectedWith(`Invalid licenseId. Must be an integer. But got: abc`);
    });
  });

  describe("Test license.list", function () {
    const mockListLicenseRequest: ListLicenseRequest = {
      ipOrgId: "0xb422e54932c1dae83e78267a4dd2805aa64a8061",
      ipAssetId: "5",
    };
    const mockResponse = sinon.stub().returns({
      data: {
        licenses: [
          {
            id: "24",
            status: 3,
            licensor: "0xf398c12a45bc409b6c652e25bb0a3e702492a4ab",
            revoker: "0xf398c12a45bc409b6c652e25bb0a3e702492a4ab",
            ipOrgId: "0xb422e54932c1dae83e78267a4dd2805aa64a8061",
            licenseeType: 1,
            ipAssetId: "1",
            parentLicenseId: "0",
            termIds: [
              "0x4e46545f53484152455f414c494b45000000000000000000000000000000000f",
              "0x4c4943454e534f525f415050524f56414c000000000000000000000000000011",
              "0x4c4943454e534f525f49504f52475f4f525f504152454e540000000000000018",
            ],
            termsData: [
              "0x0000000000000000000000000000000000000000000000000000000000000001",
              "0x0000000000000000000000000000000000000000000000000000000000000001",
              "0x0000000000000000000000000000000000000000000000000000000000000001",
            ],
            createdAt: "2023-11-23T02:55:36Z",
            txHash: "0x000645882d175d1facd646f3ecca0bbf31a9b9697d3d3f3a564ce9c885d7eeb2",
          },
          {
            id: "13",
            status: 3,
            licensor: "0xf398c12a45bc409b6c652e25bb0a3e702492a4ab",
            revoker: "0xf398c12a45bc409b6c652e25bb0a3e702492a4ab",
            ipOrgId: "0xb422e54932c1dae83e78267a4dd2805aa64a8061",
            licenseeType: 2,
            ipAssetId: "0",
            parentLicenseId: "0",
            termIds: [
              "0x4e46545f53484152455f414c494b45000000000000000000000000000000000f",
              "0x4c4943454e534f525f415050524f56414c000000000000000000000000000011",
              "0x4c4943454e534f525f49504f52475f4f525f504152454e540000000000000018",
            ],
            termsData: [
              "0x0000000000000000000000000000000000000000000000000000000000000001",
              "0x0000000000000000000000000000000000000000000000000000000000000001",
              "0x0000000000000000000000000000000000000000000000000000000000000001",
            ],
            createdAt: "2023-11-23T02:12:24Z",
            txHash: "0x08c49125f2f91f8eda0b2a799424a41a825e6051541fd620727a96bdc4bc7a8a",
          },
        ],
      },
    });

    it("should return a list of licenses", async function () {
      axiosMock.post = mockResponse;

      const response = await licenseClient.list(mockListLicenseRequest);
      expect(response.licenses).to.be.an("array");
      expect(response.licenses[0].id).to.be.a("string");
      expect(response.licenses[0].status).to.be.a("number");
      expect(response.licenses[0].licensor).to.be.a("string");
      expect(response.licenses[0].revoker).to.be.a("string");
      expect(response.licenses[0].ipOrgId).to.be.a("string");
      expect(response.licenses[0].licenseeType).to.be.a("number");
      expect(response.licenses[0].ipAssetId).to.be.a("string");
      expect(response.licenses[0].parentLicenseId).to.be.a("string");
      expect(response.licenses[0].termIds).to.be.an("array");
      expect(response.licenses[0].termIds[0]).to.be.a("string");
      expect(response.licenses[0].termsData).to.be.an("array");
      expect(response.licenses[0].termsData[0]).to.be.a("string");
      expect(response.licenses[0].createdAt).to.be.a("string");
      expect(response.licenses[0].txHash).to.be.a("string");
    });

    it("should return a list of licenses without the request object", async function () {
      axiosMock.post = mockResponse;

      const response = await licenseClient.list();
      expect(response.licenses).to.be.an("array");
      expect(response.licenses[0].id).to.be.a("string");
      expect(response.licenses[0].status).to.be.a("number");
      expect(response.licenses[0].licensor).to.be.a("string");
      expect(response.licenses[0].revoker).to.be.a("string");
      expect(response.licenses[0].ipOrgId).to.be.a("string");
      expect(response.licenses[0].licenseeType).to.be.a("number");
      expect(response.licenses[0].ipAssetId).to.be.a("string");
      expect(response.licenses[0].parentLicenseId).to.be.a("string");
      expect(response.licenses[0].termIds).to.be.an("array");
      expect(response.licenses[0].termIds[0]).to.be.a("string");
      expect(response.licenses[0].termsData).to.be.an("array");
      expect(response.licenses[0].termsData[0]).to.be.a("string");
      expect(response.licenses[0].createdAt).to.be.a("string");
      expect(response.licenses[0].txHash).to.be.a("string");
    });

    it("should throw an error if wrong request object", async function () {
      axiosMock.post = sinon.stub().rejects(new Error("HTTP 500"));

      //@ts-ignore
      await expect(licenseClient.list({ foo: "bar" })).to.be.rejectedWith("HTTP 500");
    });
  });
});
