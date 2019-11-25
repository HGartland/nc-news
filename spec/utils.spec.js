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
  it("when given an array containing a single object converts the timestamp to js date object without affecting other properties", () => {
    const input = [{ created_at: 1511354163389, name: "barry" }];
    expect(formatDates(input)).to.eql([
      { created_at: "2017-11-22 12:36:03", name: "barry" }
    ]);
  });
  it("when given an array containing multiple objects converts the timestamps to js date object", () => {
    const input = [
      { created_at: 1511354163389 },
      { created_at: 1512355163389 }
    ];
    expect(formatDates(input)).to.eql([
      { created_at: "2017-11-22 12:36:03" },
      { created_at: "2017-12-04 02:39:23" }
    ]);
  });
});

describe("makeRefObj", () => {
  it("returns empty objet when given empty array", () => {
    expect(makeRefObj([])).to.eql({});
  });
});

describe("formatComments", () => {});
