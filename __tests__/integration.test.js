const request = require("supertest")
const app = require("../app")
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data/index")
const endpoints = require("../endpoints.json")
const { convertTimestampToDate } = require("../db/seeds/utils")


beforeEach(()=>{
    return seed(data)
  })

afterAll(() => db.end())

// GET /api/topics
describe("GET /api/topics", () => {
    
    test("Status 200: responds with an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const topics = body.topics
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toEqual(
                  expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                    })
                )
            })
          })
    })
})


// GET /api/not-an-endpoint
describe("GET /api/not-an-endpoint", () => {    
    test("Status 404: responds with an error message for a route that doesn't exist", () => {
        return request(app)
          .get("/api/stories")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Route Non Found")
            })
    })
})


// GET /api
describe("GET /api", () => {
    
    test("Status 200: responds with an object describing all the available endpoints on the API", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual(endpoints)
            })
    })    
})



// GET /api/articles/:article_id
describe("GET /api/articles/:article_id", () => {
    
  test("Status 200: responds with an individual object", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
            expect(body.article).toMatchObject({
              author: "icellusedkars",
              title: "Sony Vaio; or, The Laptop",
              article_id: 2,
              body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
              topic: "mitch",
              created_at: "2020-10-16 06:03:00",
              votes: 0,
              article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            })
        })
  })

  test("Status 400: responds with an error message when article_id is an invalid type", () => {
    return request(app)
        .get("/api/articles/notAnID")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request")
            })
  })

  test("Status 404: responds with an error message when article_id is valid but doesn't exist", () => {
    return request(app)
        .get("/api/articles/1000")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Not Found")
            })
  })

})


// GET /api/articles
describe("GET /api/articles", () => {
    
  test("Status 200: responds with an array of all the articles sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles
          expect(articles).toHaveLength(13)
          articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  article_img_url: expect.any(String),
                  comment_count: expect.any(Number),
                  })
              )
          })
          expect(articles).toBeSortedBy("created_at", { descending: true })
        })

  })

  test("Status 400: responds with an error message when a field in a query doesn't exist", () => {
    return request(app)
        .get("/api/articles?sort_by=strawberry")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request")
            })
  })
})