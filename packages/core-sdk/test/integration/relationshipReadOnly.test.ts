import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  StoryClient,
  StoryReadOnlyConfig,
  ReadOnlyClient,
  ListRelationshipRequest,
} from "../../src";
import * as dotenv from "dotenv";

dotenv.config();
chai.should();
chai.use(chaiAsPromised);

describe("Relationship Read Only Functions", () => {
  let client: ReadOnlyClient;

  before(async function () {
    const config: StoryReadOnlyConfig = {};

    client = StoryClient.newReadOnlyClient(config);
  });

  describe.only("Get Relationship", async function () {
    it("should retrieve a relationship by its ID", async function () {
      return client.relationship
        .get({
          relationshipId: "1", // Provide a valid ID
        })
        .should.eventually.have.property("relationship");
    });

    it("should throw errors when retrieving an invalid relationship", async function () {
      return client.relationship
        .get({
          relationshipId: "invalid_id", // Provide an invalid ID
        })
        .should.be.rejectedWith(Error);
    });
  });

  describe.only("List Relationships", async function () {
    it("should list all relationships", async function () {
      const mockListRelationshipRequest: ListRelationshipRequest = {
        tokenId: "2",
        contract: "0x309c205347e3826472643f9b7ebd8a50d64ccd9e",
        options: {
          pagination: {
            limit: 1,
            offset: 0,
          },
        },
      };
      return client.relationship
        .list(mockListRelationshipRequest)
        .should.eventually.have.property("relationships")
        .lengthOf(1);
    });

    it("should handle errors when listing licenses with invalid id", async function () {
      const mockInvalidListRelationshipRequest: ListRelationshipRequest = {
        tokenId: "aaa",
        contract: "0x309c205347e3826472643f9b7ebd8a50d64ccd9e",
        options: {
          pagination: {
            limit: 1,
            offset: 0,
          },
        },
      };
      return client.relationship
        .list(mockInvalidListRelationshipRequest)
        .should.eventually.be.rejectedWith(Error);
    });
  });
});
