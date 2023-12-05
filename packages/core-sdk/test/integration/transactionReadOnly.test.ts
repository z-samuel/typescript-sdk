import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  StoryClient,
  StoryReadOnlyConfig,
  ReadOnlyClient,
  ListTransactionRequest,
  ResourceType,
} from "../../src";
import * as dotenv from "dotenv";

dotenv.config();
chai.use(chaiAsPromised);

describe("Transaction client integration tests", () => {
  let client: ReadOnlyClient;

  beforeEach(function () {
    const config: StoryReadOnlyConfig = {};

    client = StoryClient.newReadOnlyClient(config);
  });

  describe("List Transactions", async function () {
    it("should return array of transactions", async () => {
      const req = {
        options: {
          limit: 10,
          offset: 0,
        },
      } as ListTransactionRequest;

      const response = await client.transaction.list(req);
      expect(response).to.have.property("transactions");
      expect(response.transactions).to.be.an("array"); // Collection[]

      const transaction = response.transactions[0];
      expect(transaction).to.have.property("id");
      expect(transaction).to.have.property("txHash");
      expect(transaction).to.have.property("createdAt");
      expect(transaction).to.have.property("initiator");
      expect(transaction).to.have.property("resourceType");
      expect(transaction).to.have.property("resourceId");
      if (transaction.resourceType !== ResourceType.Relationship.valueOf()) {
        expect(transaction).to.have.property("ipOrgId");
        expect(transaction.ipOrgId).to.be.a("string");
      }
      expect(transaction.id).to.be.a("string");
      expect(transaction.txHash).to.be.a("string");
      expect(transaction.createdAt).to.be.a("string");
      expect(transaction.initiator).to.be.a("string");
      expect(transaction.resourceType).to.be.a("string");
      expect(transaction.resourceId).to.be.a("string");

      const transaction2 = response.transactions[1];
      expect(transaction2).to.have.property("id");
      expect(transaction2).to.have.property("txHash");
      expect(transaction2).to.have.property("createdAt");
      expect(transaction2).to.have.property("initiator");
      expect(transaction2).to.have.property("resourceType");
      expect(transaction2).to.have.property("resourceId");
      if (transaction.resourceType !== ResourceType.Relationship.valueOf()) {
        expect(transaction2).to.have.property("ipOrgId");
        expect(transaction2.ipOrgId).to.be.a("string");
      }
      expect(transaction2.id).to.be.a("string");
      expect(transaction2.txHash).to.be.a("string");
      expect(transaction2.createdAt).to.be.a("string");
      expect(transaction2.initiator).to.be.a("string");
      expect(transaction2.resourceType).to.be.a("string");
      expect(transaction2.resourceId).to.be.a("string");
    });

    it("should return a list of transactions successfully without options", async () => {
      const response = await client.transaction.list();
      expect(response).is.not.null;
      expect(response.transactions.length).to.gt(0);
    });

    it("should return a list of transactions if the options are invalid", async () => {
      const options = {
        options: {},
      } as ListTransactionRequest;
      const response = await client.transaction.list(options);
      expect(response).is.not.null;
      expect(response.transactions.length).to.gt(0);
    });
  });

  describe("Get Transaction", async function () {
    it("should return transaction from request transaction id", async () => {
      const response = await client.transaction.get({
        transactionId: "0x07da84387bbd29bf5476b0684677628f95d6b551fdb145c4fccb27b6342cdfd12e000000",
      });
      expect(response).to.have.property("transaction");

      const transaction = response.transaction;
      expect(transaction).to.have.property("id");
      expect(transaction).to.have.property("txHash");
      expect(transaction).to.have.property("createdAt");
      expect(transaction).to.have.property("initiator");
      expect(transaction).to.have.property("resourceType");
      expect(transaction).to.have.property("resourceId");
      expect(transaction).to.have.property("ipOrgId");
      expect(transaction.id).to.be.a("string");
      expect(transaction.txHash).to.be.a("string");
      expect(transaction.createdAt).to.be.a("string");
      expect(transaction.initiator).to.be.a("string");
      expect(transaction.resourceType).to.be.a("string");
      expect(transaction.resourceId).to.be.a("string");
      expect(transaction.ipOrgId).to.be.a("string");
    });
  });
});
