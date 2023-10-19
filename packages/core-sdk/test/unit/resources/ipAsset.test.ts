import { expect } from "chai";
import { IPAssetClient } from "../../../src/resources/ipAsset";
import { FranchiseRegistry } from "../../../src/abi/generated/FranchiseRegistry";
import { AxiosInstance } from "axios";
import { createMock } from "../testUtils";
import * as sinon from "sinon";
import { Wallet } from "ethers";
import { IPAssetType } from "../../../src/enums/IPAssetType";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { IpAssetRegistry, IpAssetRegistry__factory } from "../../../src/abi/generated";

chai.use(chaiAsPromised);

describe("Test IpAssetClient", function () {
  let ipAssetClient: IPAssetClient;
  let axiosMock: AxiosInstance;
  let franchiseRegistryMock: FranchiseRegistry;
  let ipAssetRegistryMock: IpAssetRegistry;

  beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    franchiseRegistryMock = createMock<FranchiseRegistry>();
    ipAssetClient = new IPAssetClient(axiosMock, franchiseRegistryMock, Wallet.createRandom());
    ipAssetRegistryMock = createMock<IpAssetRegistry>();
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("Test ipAssetClient.get", function () {
    it("should return asset when the franchise id is valid", async function () {
      axiosMock.get = sinon.stub().returns({
        data: {
          data: {
            franchiseId: "6",
            ipAssetId: "6",
            ipAssetName: "test",
            ipAssetType: IPAssetType.CHARACTER,
          },
        },
      });

      const response = await ipAssetClient.get({
        ipAssetId: "6",
        franchiseId: "78",
      });

      expect(response.data.franchiseId).to.equal("6");
      expect(response.data.ipAssetName).to.equal("test");
      expect(response.data.ipAssetType).to.equal(IPAssetType.CHARACTER);
    });

    it("should throw error", async function () {
      axiosMock.get = sinon.stub().rejects(new Error("http 500"));
      await expect(
        ipAssetClient.get({
          ipAssetId: "6",
          franchiseId: "78",
        }),
      ).to.be.rejectedWith("http 500");
    });

    it("should throw error if asset id is invalid", async function () {
      try {
        ipAssetClient.get({ ipAssetId: "Bogus ID", franchiseId: "78" });
        expect.fail(`Function should not get here, it should throw an error `);
      } catch (error) {
        // function is expected to throw.
      }
    });
  });

  describe("Test ipAssetClient.create", async function () {
    it("should not throw error when creating a franchise", async function () {
      try {
        franchiseRegistryMock.ipAssetRegistryForId = sinon.stub().returns("6");
        IpAssetRegistry__factory.connect = sinon.stub().returns(ipAssetRegistryMock);
        ipAssetRegistryMock.createIPAsset = sinon.stub().returns({
          hash: "0x129f7dd802200f096221dd89d5b086e4bd3ad6eafb378a0c75e3b04fc375f997",
        });

        await ipAssetClient.create({
          franchiseId: "78",
          ipAssetType: IPAssetType.CHARACTER,
          ipAssetName: "Darth Vader",
          description: "fake desc",
          mediaUrl: "/",
          to: "0x2a5A2cFd49AF297f830A3b6659EA8abdFEF83b7A",
          parentIpAssetId: "7",
        });
      } catch (error) {
        expect.fail(`Function should not have thrown any error, but it threw: ${error}`);
      }
    });

    it("should throw error when request fails", async function () {
      franchiseRegistryMock.ipAssetRegistryForId = sinon.stub().returns("6");
      IpAssetRegistry__factory.connect = sinon.stub().returns(ipAssetRegistryMock);
      ipAssetRegistryMock.createIPAsset = sinon.stub().rejects(new Error("http 500"));
      await expect(
        ipAssetClient.create({
          franchiseId: "78",
          ipAssetType: IPAssetType.CHARACTER,
          ipAssetName: "Darth Vader",
          description: "fake desc",
          mediaUrl: "/",
          to: "0x2a5A2cFd49AF297f830A3b6659EA8abdFEF83b7A",
          parentIpAssetId: "7",
        }),
      ).to.be.rejectedWith("http 500");
    });

    it("should throw error when invalid franchise ID is provided", async function () {
      try {
        await expect(
          ipAssetClient.create({
            franchiseId: "invalid ID",
            ipAssetType: IPAssetType.CHARACTER,
            ipAssetName: "Darth Vader",
            description: "fake desc",
            mediaUrl: "/",
            to: "0x2a5A2cFd49AF297f830A3b6659EA8abdFEF83b7A",
            parentIpAssetId: "7",
          }),
        );
      } catch (error) {
        // successfully thrown
      }
    });
  });

  describe("Test ipAssetClient.getRegistry", async function () {
    it("should throw an error if retrieving the registry fails", async function () {
      try {
        franchiseRegistryMock.ipAssetRegistryForId = sinon.stub().returns("0xacbdef");
        IpAssetRegistry__factory.connect = sinon.stub().throws("no registry for you.");
        await ipAssetClient["getRegistry"]("6");
        expect.fail(`Function should not get here, it should throw an error `);
      } catch (error) {
        // function is expected to fail
      }
    });
  });

  describe("Test ipAssetRegistry.list", async function () {
    it("should return franchises on a successful query", async function () {
      axiosMock.get = sinon.stub().returns({
        data: {
          data: [
            {
              franchiseId: "6",
              ipAssetType: IPAssetType.CHARACTER,
              ipAssetName: "Darth Vader",
              description: "fake desc",
              mediaUrl: "/",
            },
            {
              franchiseId: "6",
              ipAssetType: IPAssetType.CHARACTER,
              ipAssetName: "Luke Skywalker",
              description: "fake desc",
              mediaUrl: "/",
            },
          ],
        },
      });

      const response = await ipAssetClient.list({
        franchiseId: "78",
      });

      expect(response.data[0].franchiseId).to.equal("6");
      expect(response.data[1].ipAssetName).to.equal("Luke Skywalker");
    });

    it("should throw error", async function () {
      axiosMock.get = sinon.stub().rejects(new Error("HTTP 500"));
      await expect(
        ipAssetClient.list({
          franchiseId: "78",
        }),
      ).to.be.rejectedWith("HTTP 500");
    });
  });
});
