import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { LicenseClient } from "../../../src/resources/license";
import { FranchiseRegistry } from "../../../src/abi/generated/FranchiseRegistry";
import { AxiosInstance } from "axios";
import { createMock } from "../testUtils";
import * as sinon from "sinon";
import { BigNumber, Wallet } from "ethers";
import { IpAssetRegistry__factory } from "../../../src/abi/generated";

chai.use(chaiAsPromised);

describe("Test LicenseClient", function () {
  let licenseClient: LicenseClient;
  let axiosMock: AxiosInstance;
  let franchiseRegistryMock: FranchiseRegistry;

  beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    franchiseRegistryMock = createMock<FranchiseRegistry>();
    licenseClient = new LicenseClient(axiosMock, Wallet.createRandom(), franchiseRegistryMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("Test license.get", function () {
    it("should return a license when the license ID is valid", async function () {
      axiosMock.get = sinon.stub().returns({
        data: {
          data: {
            licenseId: "49",
            ipAssetId: "5",
            franchiseId: "7",
            ownerAddress: "0xd84316a1b6f40902c17b8177854cdaeb3c957daf",
            uri: "https://arweave.net/R7-xPDAMqOhUSw3CM_UwXI7zdpQkzCCCUq3smzxyAaU",
            txHash: "0x00a1a14e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
          },
        },
      });

      const response = await licenseClient.get({
        licenseId: "49",
      });

      expect(response.data.licenseId).to.equal("49");
      expect(response.data.ipAssetId).to.equal("5");
      expect(response.data.franchiseId).to.equal("7");
      expect(response.data.ownerAddress).to.equal("0xd84316a1b6f40902c17b8177854cdaeb3c957daf");
      expect(response.data.uri).to.equal(
        "https://arweave.net/R7-xPDAMqOhUSw3CM_UwXI7zdpQkzCCCUq3smzxyAaU",
      );
      expect(response.data.txHash).to.equal(
        "0x00a1a14e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
      );
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
    const mockListLicenseRequest = { franchiseId: "7", ipAssetId: "5" };

    it("should return a list of licenses", async function () {
      axiosMock.get = sinon.stub().returns({
        data: {
          data: [
            {
              licenseId: "49",
              ipAssetId: "5",
              franchiseId: "7",
              ownerAddress: "0xd84316a1b6f40902c17b8177854cdaeb3c957daf",
              uri: "https://arweave.net/R7-xPDAMqOhUSw3CM_UwXI7zdpQkzCCCUq3smzxyAaU",
              txHash: "0x00a1a14e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
            },
            {
              licenseId: "50",
              ipAssetId: "5",
              franchiseId: "7",
              ownerAddress: "0xd84316a1b6f40902c17b8177854cdaeb3c957daf",
              uri: "https://arweave.net/R7-xPDAMqOhUSw3CM_UwXI7zdpQkzCCCUq3smzxyAaU",
              txHash: "0x00a1a14e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
            },
          ],
        },
      });

      const response = await licenseClient.list(mockListLicenseRequest);

      expect(response.data).to.be.an("array");
      expect(response.data).to.have.lengthOf(2);

      expect(response.data[0].licenseId).to.equal("49");
      expect(response.data[0].ipAssetId).to.equal("5");
      expect(response.data[0].franchiseId).to.equal("7");
      expect(response.data[0].ownerAddress).to.equal("0xd84316a1b6f40902c17b8177854cdaeb3c957daf");
      expect(response.data[0].uri).to.equal(
        "https://arweave.net/R7-xPDAMqOhUSw3CM_UwXI7zdpQkzCCCUq3smzxyAaU",
      );
      expect(response.data[0].txHash).to.equal(
        "0x00a1a14e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
      );

      expect(response.data[1].licenseId).to.equal("50");
      expect(response.data[1].ipAssetId).to.equal("5");
      expect(response.data[1].franchiseId).to.equal("7");
      expect(response.data[1].ownerAddress).to.equal("0xd84316a1b6f40902c17b8177854cdaeb3c957daf");
      expect(response.data[1].uri).to.equal(
        "https://arweave.net/R7-xPDAMqOhUSw3CM_UwXI7zdpQkzCCCUq3smzxyAaU",
      );
      expect(response.data[1].txHash).to.equal(
        "0x00a1a14e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
      );
    });

    it("should throw an error", async function () {
      axiosMock.get = sinon.stub().rejects(new Error("HTTP 500"));

      await expect(licenseClient.list(mockListLicenseRequest)).to.be.rejectedWith("HTTP 500");
    });
  });

  describe("Test license.create", async function () {
    it("should not throw an error when creating a license", async function () {
      try {
        franchiseRegistryMock.ipAssetRegistryForId = sinon
          .stub()
          .returns("0xIpAssetRegistryAddress");

        const getLicenseIdByTokenIdStub = sinon.stub();
        getLicenseIdByTokenIdStub.returns("999");

        const createLicenseStub = sinon.stub();
        createLicenseStub.returns({
          hash: "0xHashValue",
        });

        IpAssetRegistry__factory.connect = sinon.stub().returns({
          getLicenseIdByTokenId: getLicenseIdByTokenIdStub,
          createLicense: createLicenseStub,
        } as any);

        const franchiseId = "123";
        const ipAssetId = "456";
        const licenseURI = "https://example.com/license";

        const response = await licenseClient.create({
          franchiseId,
          ipAssetId,
          licenseURI,
          options: {
            ownerAddress: "0xOwnerAddress",
            revoker: "0xRevokerAddress",
            isCommercial: true,
            isSublicensable: true,
            terms: {
              processor: "ProcessorName",
              data: "0xabcdef",
            },
          },
        });

        expect(response.txHash).to.equal("0xHashValue");
      } catch (error) {
        expect.fail(`Function should not have thrown any error, but it threw: ${error}`);
      }
    });

    it("should throw an error", async function () {
      franchiseRegistryMock.ipAssetRegistryForId = sinon.stub().returns("0xIpAssetRegistryAddress");
      const getLicenseIdByTokenIdStub = sinon.stub();
      getLicenseIdByTokenIdStub.returns("999");

      const createLicenseStub = sinon.stub().rejects(new Error("revert"));

      IpAssetRegistry__factory.connect = sinon.stub().returns({
        getLicenseIdByTokenId: getLicenseIdByTokenIdStub,
        createLicense: createLicenseStub,
      } as any);

      const franchiseId = "123";
      const ipAssetId = "456";
      const licenseURI = "https://example.com/license";

      await expect(
        licenseClient.create({
          franchiseId,
          ipAssetId,
          licenseURI,
        }),
      ).to.be.rejectedWith("revert");
    });
  });
});
