import chai, { expect } from "chai";
import { FranchiseClient } from "../../../src/resources/franchise";
import { FranchiseRegistry, LicensingModule } from "../../../src/abi/generated";
import { AxiosInstance } from "axios";
import { createMock } from "../testUtils";
import * as sinon from "sinon";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe(`Test FranchiseClient`, function () {
  let franchise: FranchiseClient;
  let axiosMock: AxiosInstance;
  let franchiseRegistryMock: FranchiseRegistry;
  let licenseModuleMock: LicensingModule;

  beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    franchiseRegistryMock = createMock<FranchiseRegistry>();
    licenseModuleMock = createMock<LicensingModule>();
    franchise = new FranchiseClient(axiosMock, franchiseRegistryMock, licenseModuleMock);
  });

  afterEach(function () {
    sinon.restore();
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

    it("should throw error when registerFranchise reverts", async function () {
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

  describe("Test franchise.list", async function () {
    it("should return franchises on a successful query", async function () {
      axiosMock.get = sinon.stub().returns({
        data: {
          data: [
            {
              franchiseId: "6",
              franchiseName: "AAA",
            },
          ],
        },
      });

      const response = await franchise.list();

      expect(response.data[0].franchiseId).to.equal("6");
      expect(response.data[0].franchiseName).to.equal("AAA");
    });

    it("should throw error", async function () {
      axiosMock.get = sinon.stub().rejects(new Error("HTTP 500"));
      await expect(franchise.list()).to.be.rejectedWith("HTTP 500");
    });
  });

  describe("Test franchise.configure", async function () {
    it("should not throw error when configuring a franchise", async function () {
      licenseModuleMock.configureFranchiseLicensing = sinon.stub().returns({});
      await expect(
        franchise.configure({
          franchiseId: "66",
        }),
      ).not.to.be.rejected;
    });

    it("should throw error when configureFranchiseLicensing reverts", async function () {
      licenseModuleMock.configureFranchiseLicensing = sinon.stub().rejects(new Error("revert"));
      await expect(
        franchise.configure({
          franchiseId: "66",
        }),
      ).to.be.rejectedWith("revert");
    });
  });
});
