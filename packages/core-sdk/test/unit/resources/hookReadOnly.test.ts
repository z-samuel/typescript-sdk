import { expect } from "chai";
import { HookReadOnlyClient } from "../../../src/resources/hookReadOnly";
import { AxiosInstance } from "axios";
import { createMock } from "../testUtils";
import * as sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { PublicClient } from "viem";

chai.use(chaiAsPromised);

describe("Test HookReadOnlyClient", function () {
  let hookClient: HookReadOnlyClient;
  let axiosMock: AxiosInstance;
  let rpcMock: PublicClient;

  beforeEach(function () {
    axiosMock = createMock<AxiosInstance>();
    rpcMock = createMock<PublicClient>();
    hookClient = new HookReadOnlyClient(axiosMock, rpcMock);
  });

  afterEach(function () {
    sinon.restore();
  });

  describe("Test hookClient.get", function () {
    it("should return hook when the hook id is valid", async function () {
      axiosMock.get = sinon.stub().returns({
        data: {
          hook: {
            id: "1",
            moduleId: "0x1234514e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
            interface: "(uint,uint)",
            registeredAt: "0001-01-01T00:00:00Z",
            txHash: "0x00a1a14e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
          },
        },
      });

      const response = await hookClient.get({
        hookId: "0x1234514e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
      });

      expect(response.hook.id).to.equal("1");
      expect(response.hook.moduleId).to.equal(
        "0x1234514e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
      );
    });

    it("should throw error", async function () {
      axiosMock.get = sinon.stub().rejects(new Error("http 500"));
      await expect(
        hookClient.get({
          hookId: "0x1234514e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
        }),
      ).to.be.rejectedWith("http 500");
    });

    it("should throw error if asset id is invalid", async function () {
      try {
        await hookClient.get({
          hookId: "fake hook id",
        });
        expect.fail(`Function should not get here, it should throw an error `);
      } catch (error) {
        // function is expected to throw.
      }
    });
  });

  describe("Test hookClient.list", async function () {
    it("should return hooks on a successful query", async function () {
      axiosMock.post = sinon.stub().returns({
        data: {
          hooks: [
            {
              id: "1",
              moduleId: "0x1234514e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
              interface: "(uint,uint)",
              registeredAt: "0001-01-01T00:00:00Z",
              txHash: "0x00a1a14e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
            },
            {
              id: "2",
              moduleId: "0x1234514e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
              interface: "(uint,uint)",
              registeredAt: "0001-01-01T00:00:00Z",
              txHash: "0x00a1a14e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
            },
          ],
        },
      });

      const response = await hookClient.list({
        moduleId: "0x1234514e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
      });

      expect(response.hooks[0].id).to.equal("1");
      expect(response.hooks[0].moduleId).to.equal(
        "0x1234514e0193144e1d7024428ee242c44e5cacdbd7458c629d17c6366f6c5cb6",
      );
    });

    it("should throw error", async function () {
      axiosMock.post = sinon.stub().rejects(new Error("HTTP 500"));
      await expect(
        hookClient.list({
          moduleId: "fake module id",
        }),
      ).to.be.rejectedWith("HTTP 500");
    });
  });
});
