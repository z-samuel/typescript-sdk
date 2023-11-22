import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig, Environment } from "../../src/index";
import * as dotenv from "dotenv";
import { Client } from "../../src/types/client";
import { privateKeyToAccount } from "viem/accounts";
import { getAddress, Hex, http } from "viem";
import { sepolia } from "viem/chains";
import {
  RelationshipRegisterRequest,
  RelationshipRegisterTypeRequest,
} from "../../src/types/resources/relationship";

dotenv.config();
chai.use(chaiAsPromised);
chai.config.truncateThreshold = 0;

describe("Relationship Functions", () => {
  let client: Client;

  // TODO: need actually IPAsset data for it to work
  const mockRegisterRequest: RelationshipRegisterRequest = {
    ipOrgId: "0xb422E54932c1dae83E78267A4DD2805aa64A8061",
    relType: "appears_in",
    srcContract: "0x177175a4b26f6EA050676F8c9a14D395F896492C",
    srcTokenId: "4",
    dstContract: "0x177175a4b26f6EA050676F8c9a14D395F896492C",
    dstTokenId: "5",
    preHookData: [],
    postHookData: [],
    txOptions: {
      waitForTransaction: false,
    },
  };

  const mockRegisterTypeRequest: RelationshipRegisterTypeRequest = {
    ipOrgId: "0xb422E54932c1dae83E78267A4DD2805aa64A8061",
    relType: "appears_in",
    relatedElements: {
      src: 1,
      dst: 1,
    },
    allowedSrcs: ["1"],
    allowedDsts: ["1"],
    preHooksConfig: [],
    postHooksConfig: [],
    txOptions: {
      waitForTransaction: false,
    },
  };

  before(function () {
    const config: StoryConfig = {
      environment: Environment.TEST,
      chain: sepolia,
      transport: http(process.env.RPC_PROVIDER_URL),
      account: privateKeyToAccount((process.env.WALLET_PRIVATE_KEY || "0x") as Hex),
    };

    client = StoryClient.newClient(config);
  });

  describe("Register", async function () {
    it("should create a relationship and return txHash", async () => {
      await client.relationship.register(mockRegisterRequest);
      await expect(client.relationship.register(mockRegisterRequest)).to.not.be.rejected;
    });
  });

  describe("RegisterType", async function () {
    it("should create a relationship type and return txHash", async () => {
      await client.relationship.registerRelationshipType(mockRegisterTypeRequest);
      await expect(client.relationship.registerRelationshipType(mockRegisterTypeRequest)).to.not.be
        .rejected;
    });
  });
});
