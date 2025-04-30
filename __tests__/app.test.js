const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const app = require("../app.js");
const request = require("supertest");

jest.setTimeout(10000);

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

describe("404: For any attempt to access a non-existent endpoint", () => {
  test("404: Responds with \"Not found\" when attempting to access a non-existent endpoint", () =>{
    return request(app)
    .get("/api/topiks")
    .expect(404)
    .then((response) =>{
        expect(response.body.msg).toBe("Endpoint not found");
    })
  })
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic)=>{
          expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String)
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object of an article by article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        });
      })
  });
  test("404: Responds with \"No article found under article_id ${article_id}\" when attempting to GET an article ID that is out of range (does not exist in the database)", () =>{
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then((response) =>{
        expect(response.body.msg).toBe("Not found");
      })
  });
  test("400: Responds with \"Bad request\" when attempting to GET an invalid article ID", () =>{
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then((response) =>{
        expect(response.body.msg).toBe("Bad request");
      })
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of all articles as objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", {descending: true});
        articles.forEach((article)=>{
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments by article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        comments.forEach((comment)=>{
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number)
          });
          expect(comments).toBeSortedBy("created_at", {descending: false});
      });
    });
  });
  test("404: Responds with \"No comments found under article_id ${article_id}\" when attempting to GET an article ID that is out of range", () =>{
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then((response) =>{
        expect(response.body.msg).toBe("Not found");
      })
  });
  test("400: Responds with \"Bad request\" when attempting to GET an invalid article ID", () =>{
    return request(app)
      .get("/api/articles/notAnId/comments")
      .expect(400)
      .then((response) =>{
        expect(response.body.msg).toBe("Bad request");
      })
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the newly added comment by article_id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Apple pie with custard"
    }

    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(({ body: { comment } }) => {
      expect(comment).toEqual({
        comment_id: expect.any(Number),
        article_id: 1,
        author: "icellusedkars",
        body: "Apple pie with custard",
        votes: expect.any(Number),
        created_at: expect.any(String)
      })
    })
  });
  test("400: Responds with \"Bad request\" when the request body does not contain the all of the neccessary fields", () =>{
    const newComment = {
      body: "Apple pie with custard"
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      })
  });
  test("400: Responds with \"Bad request\" when the request body has valid fields but invalid field values", () =>{
    const newComment = {
      username: 3, 
      body: 20000
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      })
  });
  test("404: Responds with \"Not found\" when the username does not exist", () =>{
    const newComment = {
      username: "fakeUsername",
      body: "Apple pie with custard"
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      })
  });
  test("404: Responds with \"Not found\" when POSTing to a non-existent ID", () =>{
    const newComment = {
      username: "icellusedkars",
      body: "Apple pie with custard"
    }
    return request(app)
    .post("/api/articles/99999/comments")
    .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      })
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the updated article's vote incremented properly", () => {
   const updatedArticle = {
    inc_votes: 10
    }
    return request(app)
    .patch("/api/articles/1")
    .send(updatedArticle)
    .expect(200)
    .then(({ body: { updatedArticle } }) => {
      expect(updatedArticle).toMatchObject({
        article_id: 1,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: 110,
        article_img_url: expect.any(String)
      });
    })
  });
  test("200: Responds with the updated article's vote decremented properly", () => {
    const updatedArticle = {
     inc_votes: -10
     }
     return request(app)
     .patch("/api/articles/1")
     .send(updatedArticle)
     .expect(200)
     .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 90,
          article_img_url: expect.any(String)
      });
     })
   });
   test("Responds with 400 \"Bad request\" when attempting to PATCH an article that does not contain the necessary field", () => {
    const updatedArticle = {}

    return request(app)
    .patch("/api/articles/1")
    .send(updatedArticle)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toEqual("Bad request");
    })
  })
  test("Responds with 400 \"Bad request\" when attempting to update with an invalid field value", () => {
    const updatedArticle = {inc_votes: 'word'}

    return request(app)
    .patch("/api/articles/1")
    .send(updatedArticle)
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toEqual("Bad request");
    })
  });
  test("Responds with 404 if the article_id is out of range", () => {
    const updatedArticle = {inc_votes: 15}

    return request(app)
    .patch("/api/articles/99999")
    .send(updatedArticle)
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toEqual("Not found");
    })
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("Responds with 204 and no content", () => {
    return request(app)
    .delete("/api/comments/2")
    .expect(204)
    .then((response) => {
      expect(response.body).toEqual({});
    });
  });
  test("404: Responds with \"Not found\" when attempting to DELETE a non-existent comment", () => {
    return request(app)
    .delete("/api/comments/99999")
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Not found");
    })
  });
  test("400: Responds with \"Bad request\" when attempting to DELETE a comment referenced by an invalid comment_id", () => {
    return request(app)
    .delete("/api/comments/notAnId")
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad request");
    })
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
          });
        });
      });
  });
});

describe("GET /api/articles?sort_by", () => {
  test("200: Responds with an array of articles sorted by title", () => {
      return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("title", {descending: true});
        articles.forEach((article)=>{
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
      });
    });
  });
  test("200: Responds with an array of articles sorted by votes", () => {
    return request(app)
    .get("/api/articles?sort_by=votes")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles).toHaveLength(13);
      expect(articles).toBeSortedBy("votes", {descending: true});
      articles.forEach((article)=>{
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
    });
  });
});
  test("200: Responds with an array of articles sorted by author", () => {
    return request(app)
    .get("/api/articles?sort_by=author")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles).toHaveLength(13);
      expect(articles).toBeSortedBy("author", {descending: true});
      articles.forEach((article)=>{
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        });
    });
  });
});
  test("404: Responds with \"Not found\" when given an invalid sort_by query", ()=>{
    return request(app)
    .get("/api/articles?sort_by=invalidQuery")
    .expect(404)
    .then((response) =>{
      expect(response.body.msg).toEqual("Not found");
    })
  });
});