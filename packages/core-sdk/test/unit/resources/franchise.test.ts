import { expect } from "chai";
import { mock, instance, when, anything } from 'ts-mockito';
import { FranchiseClient } from "../../../src/resources/franchise";
import { FranchiseRegistry } from "../../../src/abi/generated/FranchiseRegistry";
import { AxiosInstance, AxiosHeaders } from "axios";
import { ContractTransaction } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

describe("Franchise Functions", function() {
  describe("Get Franchise", function() {
    let franchise: FranchiseClient;
    let franchiseRegistryMock: FranchiseRegistry;
    let axiosMock: AxiosInstance;

    beforeEach(function() {
        franchiseRegistryMock = mock<FranchiseRegistry>();
        axiosMock = mock<AxiosInstance>();
        franchise = new FranchiseClient(instance(axiosMock), instance(franchiseRegistryMock)); 
    });

    it("should return franchise when the franchise id is valid", async function() {
      const headersMock = mock<AxiosHeaders>();
      when(axiosMock.get(anything())).thenResolve({
        data: {
            franchiseId: "6",
            franchiseName: "AAA",
            franchiseSymbol: "A",
            tokenUri: "asfddsf",
        },
        status: 200,
        statusText: "OK",
        headers: {}, 
        config: {
            headers: instance(headersMock),
        },
      });

      const response = await franchise.get({
        franchiseId: "6",
      });
      expect(response.franchise.franchiseId).to.equal("6");
      expect(response.franchise.franchiseName).to.equal("AAA");
    });
  });
  /* 
  describe("Create Franchise", async function () {
    let franchise: FranchiseClient;
    let franchiseRegistryMock: FranchiseRegistry;
    let axiosMock: AxiosInstance;

    beforeEach(function() {
        franchiseRegistryMock = mock<FranchiseRegistry>();
        axiosMock = mock<AxiosInstance>();
        franchise = new FranchiseClient(instance(axiosMock), instance(franchiseRegistryMock)); 
    });

    it("should not throw error when creating a franchise", async function() {
      try {
        const contractResponseMock = mock<ContractTransaction>();
        when(franchiseRegistryMock.registerFranchise(anything())).thenResolve(instance(contractResponseMock))
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
  });
  */
});