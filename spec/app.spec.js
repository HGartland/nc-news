process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const { expect } = require("chai");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    describe("GET", () => {
      it("status:200 with array of all rows in topics table", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics.length).to.eql(3);
            expect(topics[0]).to.include.keys(["description", "slug"]);
          });
      });
    });
  });
  describe("/users", () => {
    describe("/:username", () => {
      describe("GET", () => {
        it("status:200 with single row matching users.username", () => {
          return request(app)
            .get("/api/users/rogersop")
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user).to.include.keys(["avatar_url", "name", "username"]);
            });
        });
      });
    });
  });
});
