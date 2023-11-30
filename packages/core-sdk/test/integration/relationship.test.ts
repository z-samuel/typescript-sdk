import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryConfig } from "../../src/index";
import * as dotenv from "dotenv";
import { Client } from "../../src/types/client";
import { privateKeyToAccount } from "viem/accounts";
import { getAddress, Hex, http } from "viem";
import { sepolia } from "viem/chains";
import {
  RegisterRelationshipRequest,
  RegisterRelationshipTypeRequest,
} from "../../src/types/resources/relationship";

dotenv.config();
chai.use(chaiAsPromised);
chai.config.truncateThreshold = 0;

describe("Relationship Functions", () => {
  let client: Client;

  // TODO: need actually IPAsset data for it to work
  const mockRegisterRequest: RegisterRelationshipRequest = {
    ipOrgId: "0x1eBb43775fCC45CF05eaa96182C8762220e17941",
    relType: "appears_in",
    srcContract: "0x309C205347E3826472643f9B7EbD8A50D64CCd9e",
    srcTokenId: "1",
    dstContract: "0x309C205347E3826472643f9B7EbD8A50D64CCd9e",
    dstTokenId: "2",
    preHookData: [],
    postHookData: [],
    txOptions: {
      waitForTransaction: false,
    },
  };

  const mockRegisterTypeRequest: RegisterRelationshipTypeRequest = {
    ipOrgId: "0x1eBb43775fCC45CF05eaa96182C8762220e17941",
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
