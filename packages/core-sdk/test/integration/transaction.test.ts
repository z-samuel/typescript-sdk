import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { StoryClient, StoryReadOnlyConfig, Environment } from "../../src/index";
import * as dotenv from "dotenv";
import { ReadOnlyClient } from "../../src/types/client";

dotenv.config();
chai.use(chaiAsPromised);

describe("Collect client integration tests", () => {
  let client: ReadOnlyClient;

  beforeEach(function () {
    const config: StoryReadOnlyConfig = {
      environment: Environment.TEST,
    };

    client = StoryClient.newReadOnlyClient(config);
  });

  describe("List Transactions", async function () {
    it("should return array of transactions", async () => {
      const response = await client.transaction.list();
      expect(response).to.have.property("data");
      expect(response.data).to.be.an("array"); // Collection[]

      const transaction = response.data[0];
      expect(transaction).to.have.property("txId");
      expect(transaction).to.have.property("txHash");
      expect(transaction).to.have.property("createdAt");
      expect(transaction).to.have.property("creatorAddress");
      expect(transaction).to.have.property("type");
      expect(transaction).to.have.property("resourceId");
      expect(transaction).to.have.property("franchiseId");
      expect(transaction.txId).to.be.a("string");
      expect(transaction.txHash).to.be.a("string");
      expect(transaction.createdAt).to.be.a("string");
      expect(transaction.creatorAddress).to.be.a("string");
      expect(transaction.type).to.be.a("string");
      expect(transaction.resourceId).to.be.a("string");
      expect(transaction.franchiseId).to.be.a("string");

      const transaction2 = response.data[1];
      expect(transaction2).to.have.property("txId");
      expect(transaction2).to.have.property("txHash");
      expect(transaction2).to.have.property("createdAt");
      expect(transaction2).to.have.property("creatorAddress");
      expect(transaction2).to.have.property("type");
      expect(transaction2).to.have.property("resourceId");
      expect(transaction2).to.have.property("franchiseId");
      expect(transaction2.txId).to.be.a("string");
      expect(transaction2.txHash).to.be.a("string");
      expect(transaction2.createdAt).to.be.a("string");
      expect(transaction2.creatorAddress).to.be.a("string");
      expect(transaction2.type).to.be.a("string");
      expect(transaction2.resourceId).to.be.a("string");
      expect(transaction2.franchiseId).to.be.a("string");
    });
  });

  describe("Get Transaction", async function () {
    it("should return transaction from request transaction id", async () => {
      const response = await client.transaction.get({
        txId: "0x00c62c845575624b335c705b783e174a426fdec472a532e00a42ea36c86c2ace0d000000",
      });
      expect(response).to.have.property("data");

      const transaction = response.data;
      expect(transaction).to.have.property("txId");
      expect(transaction).to.have.property("txHash");
      expect(transaction).to.have.property("createdAt");
      expect(transaction).to.have.property("creatorAddress");
      expect(transaction).to.have.property("type");
      expect(transaction).to.have.property("resourceId");
      expect(transaction).to.have.property("franchiseId");
      expect(transaction.txId).to.be.a("string");
      expect(transaction.txHash).to.be.a("string");
      expect(transaction.createdAt).to.be.a("string");
      expect(transaction.creatorAddress).to.be.a("string");
      expect(transaction.type).to.be.a("string");
      expect(transaction.resourceId).to.be.a("string");
      expect(transaction.franchiseId).to.be.a("string");
    });
  });
});
