import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryReadOnlyConfig } from "../../src";
import * as dotenv from "dotenv";
import { ReadOnlyClient } from "../../src/types/client";
import { ListIPOrgRequest } from "../../src/types/resources/IPOrg";

dotenv.config();
chai.use(chaiAsPromised);

describe("IPOrg Read Only Functions", () => {
  let client: ReadOnlyClient;

  before(function () {
    const config: StoryReadOnlyConfig = {};

    client = StoryClient.newReadOnlyClient(config);
  });

  describe("Get IPOrg", async function () {
    it("should return ipOrg when the ipOrg id is valid", async () => {
      const response = await client.ipOrg.get({
        ipOrgId: "0x1eBb43775fCC45CF05eaa96182C8762220e17941",
      });

      // Only assert the immutable fields
      expect(response.ipOrg.id).to.equal("0x1ebb43775fcc45cf05eaa96182c8762220e17941");
    });
  });

  describe("List IPOrgs", async function () {
    it("should return a list of ipOrgs successfully upon query", async () => {
      const options = {
        options: {
          pagination: {
            limit: 10,
            offset: 0,
          },
        },
      } as ListIPOrgRequest;
      const response = await client.ipOrg.list(options);
      expect(response).is.not.null;
      expect(response.ipOrgs.length).to.gt(0);
    });

    it("should return a list of ipOrgs successfully without options", async () => {
      const response = await client.ipOrg.list();
      expect(response).is.not.null;
      expect(response.ipOrgs.length).to.gt(0);
    });

    it("should return a list of ipOrgs with pagination", async () => {
      const options = {
        options: {
          pagination: {
            limit: 1,
            offset: 0,
          },
        },
      } as ListIPOrgRequest;
      const response = await client.ipOrg.list(options);

      expect(response).is.not.null;
      expect(response.ipOrgs.length).to.equal(1);
    });

    it("should return a list of ipOrgs if the options are invalid", async () => {
      const options = {
        options: {},
      } as ListIPOrgRequest;
      const response = await client.ipOrg.list(options);
      expect(response).is.not.null;
      expect(response.ipOrgs.length).to.gt(0);
    });
  });
});
