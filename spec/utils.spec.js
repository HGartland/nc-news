const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("when given an empty array returns a new empty array", () => {
    const input = [];
    const expected = [];
    expect(formatDates(input)).to.eql(expected);
    expect(formatDates(input)).to.not.equal(input);
  });
  it("when given an array containing a single object converts the timestamp to js date object", () => {
    const input = [{ created_at: 1511354163389 }];
    // const expected = [{ created_at: 1511354163389 }];
    expect(formatDates(input)).to.eql([{ created_at: "2017-11-22 12:36:03" }]);
  });
});

describe("makeRefObj", () => {});

describe("formatComments", () => {});
