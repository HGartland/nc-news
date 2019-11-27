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
    describe.only("GET", () => {
      it("status:200 return array of all articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]).keys([
              "article_id",
              "title",
              "body",
              "votes",
              "topic",
              "author",
              "created_at"
            ]);
            expect(articles.length).to.eql(12);
          });
      });
    });
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
            .then(({ body: { updated_article } }) => {
              expect(updated_article.body).to.eql("I hate mondays");
            });
        });
        it("status: 404 data not found for non matching id", () => {
          return request(app)
            .patch("/api/articles/420")
            .expect(404)
            .send({ body: "I love mondays" })
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("data not found");
            });
        });
        it("status: 400 bad request for invalid id", () => {
          return request(app)
            .patch("/api/articles/banana")
            .expect(400)
            .send({ body: "I love mondays" })
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("bad request");
            });
        });
        it("status: 400 bad request for updated article with wrong data type", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ vote: "200" })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("bad request");
            });
        });
        it("status: 422 on added date not matching reference", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ author: 221133 })
            .expect(422)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("unprocessable entry");
            });
        });
      });
      describe("/comments", () => {
        describe("GET", () => {
          it("status:200 with array length equal to comments for article", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles.length).to.eql(13);
              });
          });
          it("status: 404 data not found for no matching comments", () => {
            return request(app)
              .get("/api/articles/7/comments")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("data not found");
              });
          });
        });
        describe("POST", () => {
          it("status:201 new comment posted on success ", () => {
            return request(app)
              .post("/api/articles/2/comments")
              .expect(201)
              .send({ username: "rogersop", body: "This is fine" })
              .then(({ body: { comment } }) => {
                expect(comment).to.include.keys([
                  "author",
                  "body",
                  "article_id",
                  "comment_id"
                ]);
              });
          });
          it("status: 400 if given post request with missing column", () => {
            return request(app)
              .post("/api/articles/2/comments")
              .send({ body: "This is fine" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("bad request");
              });
          });
          it("status: 422 for post request with reference key not matching info in db ", () => {
            return request(app)
              .post("/api/articles/2/comments")
              .send({ username: "banandrew", body: "This is fine" })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("unprocessable entry");
              });
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
