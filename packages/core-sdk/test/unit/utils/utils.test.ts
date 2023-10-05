import { expect } from "chai";
import { isIntegerString } from "../../../src/utils/utils";

describe("Test isIntegerString", function () {
  it("should return true when passing in an integer string", function () {
    expect(isIntegerString("7")).to.be.true;
  });

  it("should return false when passing in a non-integer string", function () {
    expect(isIntegerString("a")).to.be.false;
  });
});
