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
  it("returns empty object when given empty array", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("when passed an array returns an object with a key of each of the the objects titles and value of  article_id", () => {
    const input = [{ title: "bungling", article_id: 17 }];
    const expected = { bungling: 17 };
    expect(makeRefObj(input)).to.eql(expected);
  });
  it("when passed multiple objects in array the ref object contains key pairs for all titles and ids", () => {
    const input = [
      { title: "banjo", article_id: 25 },
      { title: "business", article_id: 80 },
      { title: "breakfast", article_id: 2 }
    ];
    const expected = { banjo: 25, business: 80, breakfast: 2 };
    expect(makeRefObj(input)).to.eql(expected);
  });
});

describe("formatComments", () => {
  const input = [
    {
      body: "I hate streaming noses",
      belongs_to: "Living in the shadow of a great man",
      created_by: "icellusedkars",
      votes: 0,
      created_at: 1385210163389
    },
    {
      body: "I hate streaming eyes even more",
      belongs_to: "Living in the shadow of a great man",
      created_by: "bananaman",
      votes: 0,
      created_at: 1353674163389
    },
    {
      body: "Lobster pot",
      belongs_to: "Living in the shadow of a great man",
      created_by: "wombat_pete",
      votes: 0,
      created_at: 1322138163389
    }
  ];
  it("when passed an array returns new array", () => {
    const input2 = [];
    expect(formatComments(input2, { a: "b" })).to.not.equal(input);
    expect(formatComments(input2, { a: "b" })).to.eql([]);
  });
  it("changes created_by key in objects to author", () => {
    const output = formatComments(input);
    expect(output[0].author).to.eql("icellusedkars");
    expect(output[1].author).to.eql("bananaman");
  });
});
