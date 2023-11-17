import { expect } from "chai";
import { isIntegerString, parseToBigInt } from "../../../src/utils/utils";

describe("Test isIntegerString", function () {
  it("should return true when passing in an integer string", function () {
    expect(isIntegerString("7")).to.be.true;
  });

  it("should return false when passing in a non-integer string", function () {
    expect(isIntegerString("a")).to.be.false;
  });

  it("should parse string to big int", function () {
    expect(parseToBigInt("7")).to.be.equal(7n);
  });
});
