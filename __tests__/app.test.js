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