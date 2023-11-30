import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryReadOnlyConfig } from "../../src/index";
import * as dotenv from "dotenv";
import { ReadOnlyClient } from "../../src/types/client";
import { ListRelationshipTypesRequest } from "../../src/types/resources/relationshipType";

dotenv.config();
chai.use(chaiAsPromised);

describe("Relationship Type Read Only Functions", () => {
  let client: ReadOnlyClient;

  before(async function () {
    const config: StoryReadOnlyConfig = {};

    client = StoryClient.newReadOnlyClient(config);
  });

  describe("Get RelationshipType", () => {
    it("should retrieve a relationship type by both ipOrgId and relType", async () => {
      await expect(
        client.relationshipType.get({
          ipOrgId: "0x1ebb43775fcc45cf05eaa96182c8762220e17941",
          relType: "0xc12a5f0d1e5a95f4fc32ff629c53defa11273a372e29ae51ab24323e4af84fc3",
        }),
      ).to.not.be.rejected;

      const response = await client.relationshipType.get({
        ipOrgId: "0x1ebb43775fcc45cf05eaa96182c8762220e17941",
        relType: "0xc12a5f0d1e5a95f4fc32ff629c53defa11273a372e29ae51ab24323e4af84fc3",
      });
      expect(response.relationshipType.ipOrgId).is.not.null;
    });

    it("should handle errors when retrieving a license", async () => {
      try {
        await client.relationshipType.get({
          ipOrgId: "0xde493e03d2de1cd7820b4f580beced57296b0009", // invalid ipOrgId
          relType: "0xc12a5f0d1e5a95f4fc32ff629c53defa11273a372e29ae51ab24323e4af84fc3",
        });
        expect.fail("Function should have thrown an error");
      } catch (error) {}
    });
  });

  describe("List Relationships", async function () {
    const mockListRelationshipTypeRequest: ListRelationshipTypesRequest = {
      ipOrgId: "0xb422e54932c1dae83e78267a4dd2805aa64a8061",
      options: {
        pagination: {
          limit: 10,
          offset: 0,
        },
      },
    };

    it("should list all relationship types", async () => {
      await expect(client.relationshipType.list(mockListRelationshipTypeRequest)).to.not.be
        .rejected;

      const response = await expect(client.relationshipType.list(mockListRelationshipTypeRequest))
        .to.not.be.rejected;

      expect(response.relationshipTypes).is.not.null;
    });

    it("should handle errors when listing relationship types", async () => {
      try {
        await client.relationshipType.list(mockListRelationshipTypeRequest);
        expect.fail("Function should have thrown an error");
      } catch (error) {}
    });
  });
});
