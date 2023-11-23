import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryReadOnlyConfig, Environment } from "../../src/index";
import * as dotenv from "dotenv";
import { ReadOnlyClient } from "../../src/types/client";
import { ListRelationshipRequest } from "../../src/types/resources/relationship";

dotenv.config();
chai.use(chaiAsPromised);

describe("Relationship Read Only Functions", () => {
  let client: ReadOnlyClient;

  before(async function () {
    const config: StoryReadOnlyConfig = {
      environment: Environment.TEST,
    };

    client = StoryClient.newReadOnlyClient(config);
  });

  describe("Get Relationship", () => {
    it("should retrieve a relationship by its ID", async () => {
      await expect(
        client.relationship.get({
          relationshipId: "1", // Provide a valid license ID
        }),
      ).to.not.be.rejected;

      const response = await client.relationship.get({
        relationshipId: "1",
      });
      expect(response.relationship).is.not.null;
    });

    it("should handle errors when retrieving a license", async () => {
      try {
        await client.relationship.get({
          relationshipId: "invalid_id", // Provide an invalid license ID
        });
        expect.fail("Function should have thrown an error");
      } catch (error) {}
    });
  });

  describe("List Relationships", async function () {
    const mockListRelationshipRequest: ListRelationshipRequest = {
      tokenId: "2",
      options: {
        pagination: {
          limit: 10,
          offset: 0,
        },
      },
    };

    it("should list all licenses", async () => {
      await expect(client.relationship.list(mockListRelationshipRequest)).to.not.be.rejected;

      const response = await expect(client.relationship.list(mockListRelationshipRequest)).to.not.be
        .rejected;

      expect(response.relationships).is.not.null;
    });

    it("should handle errors when listing licenses", async () => {
      try {
        await client.relationship.list(mockListRelationshipRequest);
        expect.fail("Function should have thrown an error");
      } catch (error) {}
    });
  });
});
