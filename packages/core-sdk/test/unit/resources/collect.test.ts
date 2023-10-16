import { AxiosInstance } from "axios";
import * as sinon from "sinon";
import { CollectClient } from "../../../src/resources/collect";
import { CollectModule } from "../../../src/abi/generated/CollectModule";
import { createMock } from "../testUtils";
import { Signer } from "ethers";
import chai from "chai";
import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("Test CollectClient", function () {
  let collectClient: CollectClient;
  let axiosMock: AxiosInstance;
  let collectModuleMock: CollectModule;
  let signerMock: Signer;

  beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    collectModuleMock = createMock<CollectModule>();
    signerMock = createMock<Signer>();
    collectClient = new CollectClient(axiosMock, signerMock, collectModuleMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("Test collect.collect", function () {
    it("should return txHash when the collect transaction is successful", async function () {
      // Stub the CollectModule collect transaction call
      collectModuleMock.collect = sinon.stub().resolves({
        hash: "0x129f7dd802200f096221dd89d5b086e4bd3ad6eafb378a0c75e3b04fc375f997",
      });

      const response = await collectClient.collect({
        franchiseId: "6",
        ipAssetId: "1",
        collector: "0x1234567890123456789012345678901234567890",
      });

      expect(response.txHash).to.equal(
        "0x129f7dd802200f096221dd89d5b086e4bd3ad6eafb378a0c75e3b04fc375f997",
      );
    });

    it("should throw error", async function () {
      collectModuleMock.collect = sinon.stub().rejects(new Error("revert"));

      await expect(
        collectClient.collect({
          franchiseId: "0",
          ipAssetId: "0",
          collector: "0x0000000000000000000000000000000000000000",
        }),
      ).to.be.rejectedWith("revert");
    });
  });

  describe("Test collect.list", function () {
    it("should return list of collections", async function () {
      axiosMock.get = sinon.stub().resolves({
        data: {
          data: [
            {
              franchiseId: "1",
              ipAssetId: "1",
              totalCollected: 100,
            },
            {
              franchiseId: "100",
              ipAssetId: "5000",
              totalCollected: 1,
            },
          ],
        },
      });

      const response = await collectClient.list({
        franchiseId: "78",
      });

      expect(response.data).to.be.an("array");
      expect(response.data).to.have.lengthOf(2);
      expect(response.data[0].franchiseId).to.equal("1");
      expect(response.data[0].ipAssetId).to.equal("1");
      expect(response.data[0].totalCollected).to.equal(100);
      expect(response.data[1].franchiseId).to.equal("100");
      expect(response.data[1].ipAssetId).to.equal("5000");
      expect(response.data[1].totalCollected).to.equal(1);
    });

    it("should throw an error", async function () {
      axiosMock.get = sinon.stub().rejects(new Error("HTTP 500"));
      await expect(
        collectClient.list({
          franchiseId: "78",
        }),
      ).to.be.rejectedWith("HTTP 500");
    });
  });
});
