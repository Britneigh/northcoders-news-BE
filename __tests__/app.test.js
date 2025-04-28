const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const app = require("../app.js");
const request = require("supertest");

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
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
        expect(topics).toEqual([
          {
            slug: 'mitch',
            description: 'The man, the Mitch, the legend',
            img_url: ''
          },
          { slug: 'cats', description: 'Not dogs', img_url: '' },
          { slug: 'paper', description: 'what books are made of', img_url: '' }
        ]);
        topics.forEach((topic)=>{
          expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String)
          });
        });
      });
  });
  test("404: Responds with \"Not found\" when attempting to access a non-existent endpoint", () =>{
    return request(app)
    .get("/api/topiks")
    .expect(404)
    .then((response) =>{
        expect(response.body.msg).toBe("Endpoint not found");
    })
  })
});

describe.only("GET /api/articles/:article_id", () => {
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
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
      });
      test("404: Responds with \"No article found under article_id ${article_id}\" when attempting to GET an article ID that is out of range (does not exist in the database)", () =>{
        return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then((response) =>{
            expect(response.body.msg).toBe("No article found under article_id 99999");
        })
      });
      test("400: Responds with \"Bad request\" when attempting to GET an invalid article ID", () =>{
        return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then((response) =>{
            expect(response.body.msg).toBe("Bad request");
        })
      })
});