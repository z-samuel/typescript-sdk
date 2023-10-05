import { expect } from "chai";
import { StoryClient } from "../../src/client";
import { StoryConfig } from "../../src/interfaces/config";
import { Environment } from "../../src/enums/environment";
import { Wallet } from "ethers";
import { createMock } from "./testUtils";

describe("Test StoryClient", function () {
  describe("Test constructor", function () {
    it("should throw error when environment is not test", function () {
      try {
        new StoryClient({
          environment: Environment.PROD,
          signer: Wallet.createRandom(),
        });
        expect.fail(`Function should not get here, it should throw an error `);
      } catch (error) {}
    });

    it("should succeed when passing in valid params", function () {
      try {
        new StoryClient({
          environment: Environment.TEST,
          signer: Wallet.createRandom(),
        });
      } catch (error) {
        expect.fail(`Function should not have thrown any error, but it threw: ${error}`);
      }
    });
  });

  describe("Test franchise getter", function () {
    let client: StoryClient;

    beforeEach(function () {
      client = new StoryClient({
        environment: Environment.TEST,
        signer: Wallet.createRandom(),
      });
    });

    it("should return the same franchise when every time it's called", function () {
      const franchise1 = client.franchise;
      const franchise2 = client.franchise;
      expect(franchise1).to.be.equal(franchise2);
    });
  });
});
