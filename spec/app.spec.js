process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const { expect } = require("chai");

after(() => {
  connection.destroy();
});

describe("/api", () => {
  describe("/topics", () => {
    describe("GET", () => {
      it("status:200 with array of all rows in topics table", () => {
        return request(app)
          .get("/api/topics")
          .expect(200);
      });
    });
  });
});
