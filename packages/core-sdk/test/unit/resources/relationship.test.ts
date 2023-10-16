import chai, { expect } from "chai";
import { RelationshipClient } from "../../../src/resources/relationship";
import { RelationshipModule } from "../../../src/abi/generated/RelationshipModule";
import { createMock } from "../testUtils";
import * as sinon from "sinon";

import chaiAsPromised from "chai-as-promised";
import { handleError } from "../../../src/utils/errors";
import { FranchiseRegistry } from "../../../src/abi/generated";

chai.use(chaiAsPromised);

describe("Test RelationshipClient", function () {
  let relationshipClient: RelationshipClient;
  let relationshipModuleMock: RelationshipModule;
  let franchiseRegistryMock: FranchiseRegistry;

  beforeEach(function () {
    relationshipModuleMock = createMock<RelationshipModule>();
    franchiseRegistryMock = createMock<FranchiseRegistry>();
    relationshipClient = new RelationshipClient(relationshipModuleMock, franchiseRegistryMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("Test RelationshipClient.relate", function () {
    const mockRelateRequest = {
      sourceIPAsset: {
        franchiseId: "6",
        ipAssetId: "1",
      },
      destIPAsset: {
        franchiseId: "6",
        ipAssetId: "2",
      },
      ttl: "123",
    };

    const mockResponse = {
      hash: "transactionHash",
    };

    it("should create a relationship and return txHash", async function () {
      franchiseRegistryMock.ipAssetRegistryForId = sinon
        .stub()
        .returns("0x75fe76f35A0A4e33d924c4cDAF5dE58C3D42922c");

      // Stub the relationshipModule's relate method to return the mock response
      relationshipModuleMock.getRelationshipId = sinon
        .stub()
        .returns("0x472511bc397e46b55b56292ba067168f2f5ceb640570883cadf0daafda894c1d");
      relationshipModuleMock.relate = sinon.stub().returns(mockResponse);

      // Call the relate method and check the response
      const response = await relationshipClient.relate(mockRelateRequest);

      expect(response.txHash).to.equal(mockResponse.hash);
    });

    it("should handle errors during relationship creation", async function () {
      franchiseRegistryMock.ipAssetRegistryForId = sinon
        .stub()
        .returns("0x75fe76f35A0A4e33d924c4cDAF5dE58C3D42922c");

      // Stub the relationshipModule's relate method to throw an error
      relationshipModuleMock.relate = sinon
        .stub()
        .rejects(new Error("Failed to create relationship"));

      // Call the relate method and check that it handles the error
      await expect(relationshipClient.relate(mockRelateRequest)).to.be.rejectedWith(
        "Failed to create relationship",
      );
    });
  });

  describe("Test RelationshipClient.unrelate", function () {
    const mockUnrelateRequest = {
      sourceIPAsset: {
        franchiseId: "6",
        ipAssetId: "1",
      },
      destIPAsset: {
        franchiseId: "6",
        ipAssetId: "2",
      },
      ttl: "123",
    };
    const mockResponse = {
      hash: "transactionHash",
    };

    it("should unrelate and return txHash", async function () {
      franchiseRegistryMock.ipAssetRegistryForId = sinon
        .stub()
        .returns("0x75fe76f35A0A4e33d924c4cDAF5dE58C3D42922c");

      relationshipModuleMock.getRelationshipId = sinon
        .stub()
        .returns("0x472511bc397e46b55b56292ba067168f2f5ceb640570883cadf0daafda894c1d");
      relationshipModuleMock.unrelate = sinon.stub().returns(mockResponse);

      const response = await relationshipClient.unrelate(mockUnrelateRequest);

      expect(response.txHash).to.equal(mockResponse.hash);
    });

    it("should handle errors during unrelation", async function () {
      franchiseRegistryMock.ipAssetRegistryForId = sinon
        .stub()
        .returns("0x75fe76f35A0A4e33d924c4cDAF5dE58C3D42922c");

      const mockError = new Error("Failed to unrelate relationship");
      relationshipModuleMock.unrelate = sinon.stub().rejects(mockError);

      await expect(relationshipClient.unrelate(mockUnrelateRequest)).to.be.rejectedWith(
        "Failed to unrelate relationship",
      );
    });
  });

  describe("Test RelationshipClient.isRelationshipExpired", function () {
    const mockIsRelationshipExpiredRequest = {
      sourceIPAsset: {
        franchiseId: "6",
        ipAssetId: "1",
      },
      destIPAsset: {
        franchiseId: "6",
        ipAssetId: "2",
      },
      ttl: "123",
    };

    it("should check if relationship is expired and return result", async function () {
      const mockResponse = true;

      franchiseRegistryMock.ipAssetRegistryForId = sinon
        .stub()
        .returns("0x75fe76f35A0A4e33d924c4cDAF5dE58C3D42922c");

      relationshipModuleMock.getRelationshipId = sinon
        .stub()
        .returns("0x472511bc397e46b55b56292ba067168f2f5ceb640570883cadf0daafda894c1d");
      relationshipModuleMock.isRelationshipExpired = sinon.stub().returns(mockResponse);

      const response = await relationshipClient.isRelationshipExpired(
        mockIsRelationshipExpiredRequest,
      );

      expect(response.result).to.equal(mockResponse);
    });

    it("should handle errors when checking if relationship is expired", async function () {
      franchiseRegistryMock.ipAssetRegistryForId = sinon
        .stub()
        .returns("0x75fe76f35A0A4e33d924c4cDAF5dE58C3D42922c");

      relationshipModuleMock.isRelationshipExpired = sinon
        .stub()
        .rejects(new Error("Failed to get isRelationshipExpired"));

      await expect(
        relationshipClient.isRelationshipExpired(mockIsRelationshipExpiredRequest),
      ).to.be.rejectedWith("Failed to get isRelationshipExpired");
    });
  });

  describe("Test RelationshipClient.isRelated", function () {
    const mockIsRelatedRequest = {
      sourceIPAsset: {
        franchiseId: "6",
        ipAssetId: "1",
      },
      destIPAsset: {
        franchiseId: "6",
        ipAssetId: "2",
      },
      ttl: "123",
    };

    it("should check if two entities are related and return result", async function () {
      const mockResponse = true;

      franchiseRegistryMock.ipAssetRegistryForId = sinon
        .stub()
        .returns("0x75fe76f35A0A4e33d924c4cDAF5dE58C3D42922c");

      relationshipModuleMock.getRelationshipId = sinon
        .stub()
        .returns("0x472511bc397e46b55b56292ba067168f2f5ceb640570883cadf0daafda894c1d");
      relationshipModuleMock.areTheyRelated = sinon.stub().returns(mockResponse);

      const response = await relationshipClient.isRelated(mockIsRelatedRequest);

      expect(response.result).to.equal(mockResponse);
    });

    it("should handle errors when checking if two entities are related", async function () {
      franchiseRegistryMock.ipAssetRegistryForId = sinon
        .stub()
        .returns("0x75fe76f35A0A4e33d924c4cDAF5dE58C3D42922c");

      relationshipModuleMock.areTheyRelated = sinon
        .stub()
        .rejects(new Error("Failed to get isRelated"));

      await expect(relationshipClient.isRelated(mockIsRelatedRequest)).to.be.rejectedWith(
        "Failed to get isRelated",
      );
    });
  });
});
