import chai, { expect } from "chai";
import { FranchiseClient } from "../../../src/resources/franchise";
import { FranchiseRegistry } from "../../../src/abi/generated/FranchiseRegistry";
import { AxiosInstance } from "axios";
import { createMock } from "../testUtils";
import * as sinon from "sinon";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("Test FranchiseClient", function () {
  let franchise: FranchiseClient;
  let axiosMock: AxiosInstance;
  let franchiseRegistryMock: FranchiseRegistry;

  beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    franchiseRegistryMock = createMock<FranchiseRegistry>();
    franchise = new FranchiseClient(axiosMock, franchiseRegistryMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("Test franchise.get", function () {
    it("should return franchise when the franchise id is valid", async function () {
      axiosMock.get = sinon.stub().returns({
        data: {
          franchiseId: "6",
          franchiseName: "AAA",
          franchiseSymbol: "A",
          tokenUri: "asfddsf",
        },
      });

      const response = await franchise.get({
        franchiseId: "6",
      });

      expect(response.franchise.franchiseId).to.equal("6");
      expect(response.franchise.franchiseName).to.equal("AAA");
    });

    it("should throw error", async function () {
      axiosMock.get = sinon.stub().rejects(new Error("http 500"));
      await expect(
        franchise.get({
          franchiseId: "6",
        }),
      ).to.be.rejectedWith("http 500");
    });

    it("should throw error when the franchise id is invalid", async function () {
      await expect(
        franchise.get({
          franchiseId: "abc",
        }),
      ).to.be.rejectedWith(`Invalid franchise id. Must be an integer. But got: abc`);
    });
  });

  describe("Test franchise.create", async function () {
    it("should not throw error when creating a franchise", async function () {
      franchiseRegistryMock.registerFranchise = sinon.stub().returns({
        hash: "0x129f7dd802200f096221dd89d5b086e4bd3ad6eafb378a0c75e3b04fc375f997",
      });
      await expect(
        franchise.create({
          franchiseName: "Star War",
          franchiseSymbol: "star",
          franchiseDescription:
            "A timeless space opera franchise created by George Lucas, depicting the battle between the heroic Rebel Alliance and the evil Galactic Empire, entwined with themes of hope, destiny, and the enduring struggle between light and dark.",
        }),
      ).not.to.be.rejected;
    });

    it("should throw error", async function () {
      franchiseRegistryMock.registerFranchise = sinon.stub().rejects(new Error("revert"));
      await expect(
        franchise.create({
          franchiseName: "Star War",
          franchiseSymbol: "star",
          franchiseDescription:
            "A timeless space opera franchise created by George Lucas, depicting the battle between the heroic Rebel Alliance and the evil Galactic Empire, entwined with themes of hope, destiny, and the enduring struggle between light and dark.",
        }),
      ).to.be.rejectedWith("revert");
    });
  });
});
