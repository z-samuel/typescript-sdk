import { expect } from "chai";
import { FranchiseClient } from "../../../src/resources/franchise";
import { FranchiseRegistry } from "../../../src/abi/generated/FranchiseRegistry";
import { AxiosInstance } from "axios";
import { createMock } from "../testUtils";
import * as sinon from "sinon";

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
      try {
        axiosMock.get = sinon.stub().throws(new Error("http 500"));

        await franchise.get({
          franchiseId: "6",
        });

        expect.fail(`Function should not get here, it should throw an error `);
      } catch (error) {}
    });

    it("should throw error when the franchise id is invalid", async function () {
      try {
        await franchise.get({
          franchiseId: "abc",
        });

        expect.fail(`Function should not get here, it should throw an error `);
      } catch (error) {}
    });
  });

  describe("Test franchise.create", async function () {
    it("should not throw error when creating a franchise", async function () {
      try {
        franchiseRegistryMock.registerFranchise = sinon.stub().returns({
          hash: "0x129f7dd802200f096221dd89d5b086e4bd3ad6eafb378a0c75e3b04fc375f997",
        });

        await franchise.create({
          franchiseName: "Star War",
          franchiseSymbol: "star",
          franchiseDescription:
            "A timeless space opera franchise created by George Lucas, depicting the battle between the heroic Rebel Alliance and the evil Galactic Empire, entwined with themes of hope, destiny, and the enduring struggle between light and dark.",
        });
      } catch (error) {
        expect.fail(`Function should not have thrown any error, but it threw: ${error}`);
      }
    });

    it("should throw error", async function () {
      try {
        franchiseRegistryMock.registerFranchise = sinon.stub().throws(new Error("revert"));

        await franchise.create({
          franchiseName: "Star War",
          franchiseSymbol: "star",
          franchiseDescription:
            "A timeless space opera franchise created by George Lucas, depicting the battle between the heroic Rebel Alliance and the evil Galactic Empire, entwined with themes of hope, destiny, and the enduring struggle between light and dark.",
        });

        expect.fail(`Function should not get here, it should throw an error `);
      } catch (error) {}
    });
  });
});
