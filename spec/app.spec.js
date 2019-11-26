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
        it("status: 404 msg: data not found for username not in db", () => {
          return request(app)
            .get("/api/users/bananas")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("data not found");
            });
        });
      });
    });
  });
  describe("/articles", () => {
    describe("/:article_id", () => {
      describe("GET", () => {
        it("status: 200 & article object with valid article id", () => {
          return request(app)
            .get("/api/articles/4")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.include.keys([
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at"
              ]);
            });
        });
        it("status 404 data not found for article id not in db", () => {
          return request(app)
            .get("/api/articles/420")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("data not found");
            });
        });
        it("status 400 bad request for non valid article_id", () => {
          return request(app)
            .get("/api/articles/banana")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("bad request");
            });
        });
      });
      describe("PATCH", () => {
        it("status: 200 with patched article object", () => {
          return request(app)
            .patch("/api/articles/1")
            .expect(200)
            .send({ body: "I hate mondays" })
            .then(({ body: { body } }) => {
              expect(body).to.eql("I hate mondays");
            });
        });
      });
    });
  });
  describe("invalid url", () => {
    it("status: 404 with msg: invalid url", () => {
      return request(app)
        .get("/bananas")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.eql("invalid url");
        });
    });
  });
});
