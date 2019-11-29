process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const chai = require("chai");
const expect = chai.expect;
const chaiSorted = require("chai-sorted");
chai.use(chaiSorted);

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe("app", () => {
  describe("/api", () => {
    describe("GET", () => {
      it("status:200 with endpoints.json", () => {
        return request(app)
          .get("/api")
          .expect(200);
        // .then(({ body: { endpoints } }) => {
        //   expect(endpoints).keys([
        //     "GET /api",
        //     "GET /api/topics",
        //     "GET /api/articles"
        //   ]);
        // });
      });
    });
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
      describe("INVALID METHODS", () => {
        it("status:405 on patch, put, delete", () => {
          const invalidMethods = ["patch", "put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
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
                expect(user).to.include.keys([
                  "avatar_url",
                  "name",
                  "username"
                ]);
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
        describe("INVALID METHODS", () => {
          it("status:405 on post, patch, put, delete", () => {
            const invalidMethods = ["post", "patch", "put", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/users/rogersop")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
      describe("INVALID METHODS", () => {
        it("status:405 on patch, put, delete", () => {
          const invalidMethods = ["patch", "put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe("/articles", () => {
      describe("GET", () => {
        it("status:200 return array of all articles with comments_count column added", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0]).keys([
                "article_id",
                "title",
                "votes",
                "topic",
                "author",
                "created_at",
                "comments_count"
              ]);
              expect(articles.length).to.eql(12);
            });
        });
        it("sorts by date(created_at), descending by default", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy("created_at");
            });
        });
        it("accepts queries order & sort_by ", () => {
          return request(app)
            .get("/api/articles?sort_by=topic&&order=asc")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.ascendingBy("topic");
            });
        });
        it("accepts author query as a filter", () => {
          return request(app)
            .get("/api/articles?author=rogersop")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.eql(3);
            });
        });
        it("accepts topic query as a filter", () => {
          return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.eql(1);
            });
        });
        it("status: 404 if topic query does not exist", () => {
          return request(app)
            .get("/api/articles?topic=bananas")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("data not found");
            });
        });
        it("accepts limit query as filter", () => {
          return request(app)
            .get("/api/articles?limit=5")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.eql(5);
            });
        });
        it("accepts p query which affects response from limit", () => {
          return request(app)
            .get("/api/articles?limit=5&&p=3")
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles.length).to.eql(2);
            });
        });
      });
      describe("POST", () => {
        it("status:200 and responds with added article", () => {
          return request(app)
            .post("/api/articles")
            .expect(200)
            .send({
              title: "ahoy",
              topic: "cats",
              author: "rogersop",
              body: "I have a cat called Rasputin"
            })
            .then(({ body: { article } }) => {
              expect(article.title).to.eql("ahoy");
            });
        });
        it("status: 422 on non matching author", () => {
          return request(app)
            .post("/api/articles")
            .expect(422)
            .send({
              title: "ahoy",
              topic: "cats",
              author: "bananas",
              body: "I have a cat called Rasputin"
            })
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("unprocessable entry");
            });
        });
        it("status: 422 on non matching topic", () => {
          return request(app)
            .post("/api/articles")
            .expect(422)
            .send({
              title: "ahoy",
              topic: "soup",
              author: "rogersop",
              body: "I have a cat called Rasputin"
            })
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("unprocessable entry");
            });
        });
        it("status: 400 if article exists on that topic", () => {
          return request(app)
            .post("/api/articles")
            .expect(400)
            .send({
              title: "A",
              topic: "mitch",
              author: "rogersop",
              body: "I have a cat called Rasputin"
            })
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("bad request");
            });
        });
        it("status: 400 on missing column", () => {
          return request(app)
            .post("/api/articles")
            .expect(400)
            .send({
              title: "ahoy",
              topic: "cats",
              author: "rogersop"
            })
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("bad request");
            });
        });
        it("status: 400 on extra column", () => {
          return request(app)
            .post("/api/articles")
            .expect(400)
            .send({
              title: "ahoy",
              topic: "cats",
              author: "rogersop",
              body: "I have a cat called Rasputin",
              reason: "I just wanted one"
            })
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("bad request");
            });
        });
      });
      describe("INVALID METHODS", () => {
        it("status:405 on patch, put, delete", () => {
          const invalidMethods = ["patch", "put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
      describe("/:article_id", () => {
        describe("GET", () => {
          it("status: 200 & article object with valid article id", () => {
            return request(app)
              .get("/api/articles/1")
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.include.keys([
                  "article_id",
                  "title",
                  "body",
                  "votes",
                  "topic",
                  "author",
                  "created_at",
                  "comments_count"
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
          it("status: 200 with patched article votes", () => {
            return request(app)
              .patch("/api/articles/1")
              .expect(200)
              .send({ inc_votes: 5 })
              .then(({ body: { article } }) => {
                expect(article.votes).to.eql(105);
              });
          });
          it("status: 404 data not found for non matching id", () => {
            return request(app)
              .patch("/api/articles/420")
              .expect(404)
              .send({ inc_votes: 5 })
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("data not found");
              });
          });
          it("status: 400 bad request for invalid id", () => {
            return request(app)
              .patch("/api/articles/banana")
              .expect(400)
              .send({ inc_votes: 5 })
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("bad request");
              });
          });
          it("status: 400 bad request for updated article with wrong data type", () => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: "five" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("bad request");
              });
          });
        });
        describe("DELETE", () => {
          it("status:204 on success", () => {
            return request(app)
              .delete("/api/articles/1")
              .expect(204);
          });
          it("status: 404 on no matching article_id", () => {
            return request(app)
              .delete("/api/articles/50000")
              .expect(404);
          });
        });
        describe("INVALID METHODS", () => {
          it("status:405 on put, post", () => {
            const invalidMethods = ["put", "post"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/articles/1")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
        describe("/comments", () => {
          describe("GET", () => {
            it("status:200 with array length equal to comments for article", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).to.eql(13);
                  expect(comments[0]).keys([
                    "comment_id",
                    "votes",
                    "created_at",
                    "author",
                    "body"
                  ]);
                });
            });
            it("status: 404 data not found for no matching article", () => {
              return request(app)
                .get("/api/articles/13/comments")
                .expect(404)
                .then(({ body: { msg } }) => {
                  expect(msg).to.eql("data not found");
                });
            });
            it("status: 200 on no comments found but article exists", () => {
              return request(app)
                .get("/api/articles/7/comments")
                .expect(200);
            });
            it("default sorted by asc: created_at", () => {
              return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy("created_at");
                });
            });
            it("accepts sort_by query", () => {
              return request(app)
                .get("/api/articles/1/comments?sort_by=votes")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.descendingBy("votes");
                });
            });
            it("accepts order query", () => {
              return request(app)
                .get("/api/articles/1/comments?order=asc")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.ascendingBy("created_at");
                });
            });
            it("accepts limit query", () => {
              return request(app)
                .get("/api/articles/1/comments?limit=5")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).to.eql(5);
                });
            });
            it("accepts p query with limit", () => {
              return request(app)
                .get("/api/articles/1/comments?limit=5&&p=3")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments.length).to.eql(3);
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
          describe("INVALID METHODS", () => {
            it("status:405 on patch, put, delete", () => {
              const invalidMethods = ["patch", "put", "delete"];
              const methodPromises = invalidMethods.map(method => {
                return request(app)
                  [method]("/api/articles/1/comments")
                  .expect(405)
                  .then(({ body: { msg } }) => {
                    expect(msg).to.equal("method not allowed");
                  });
              });
              return Promise.all(methodPromises);
            });
          });
        });
      });
    });
    describe("/comments", () => {
      describe("INVALID METHODS", () => {
        it("status:405 on all methods", () => {
          const invalidMethods = ["patch", "put", "delete", "get", "post"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/comments")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
      describe("/:comment_id", () => {
        describe("PATCH", () => {
          it("status:200 updates votes and sends updated comment", () => {
            return request(app)
              .patch("/api/comments/1")
              .expect(200)
              .send({ inc_votes: 4 })
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.eql(20);
              });
          });
          it("status: 404 for non matching comment ID", () => {
            return request(app)
              .patch("/api/comments/1000")
              .expect(404)
              .send({ inc_votes: 4 })
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("data not found");
              });
          });
          it("status: 400 for invalid comment ID", () => {
            return request(app)
              .patch("/api/comments/bananas")
              .expect(400)
              .send({ inc_votes: 4 })
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("bad request");
              });
          });
          it("status 400 for invalid vote", () => {
            return request(app)
              .patch("/api/comments/1")
              .expect(400)
              .send({ inc_votes: "four" })
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("bad request");
              });
          });
        });
        describe("DELETE", () => {
          it("status: 204 msg: successfully deleted", () => {
            return request(app)
              .del("/api/comments/1")
              .expect(204);
          });
          it("status:404 with non matching id", () => {
            return request(app)
              .delete("/api/comments/100")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("data not found");
              });
          });
          it("status:400 in invalid id", () => {
            return request(app)
              .delete("/api/comments/ten")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.eql("bad request");
              });
          });
        });
        describe("INVALID METHODS", () => {
          it("status:405 on post, put, get", () => {
            const invalidMethods = ["put", "post", "get"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/comments/1")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
    describe("INVALID METHODS", () => {
      it("status:405 on post, patch, put, delete", () => {
        const invalidMethods = ["post", "patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
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
