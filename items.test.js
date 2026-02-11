const request = require("supertest");
const app = require("../app");
let items = require("../fakeDb");

beforeEach(function () {
  items.length = 0; // clear array
  items.push({ name: "popsicle", price: 1.45 });
});

describe("GET /items", function () {
  test("Gets a list of items", async function () {
    const resp = await request(app).get("/items");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual([{ name: "popsicle", price: 1.45 }]);
  });
});

describe("POST /items", function () {
  test("Creates a new item", async function () {
    const resp = await request(app)
      .post("/items")
      .send({ name: "cheerios", price: 3.4 });

    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({
      added: { name: "cheerios", price: 3.4 },
    });

    // verify it actually got added
    const getResp = await request(app).get("/items");
    expect(getResp.body.length).toBe(2);
  });

  test("400 if missing name or price", async function () {
    const resp = await request(app).post("/items").send({ name: "milk" });
    expect(resp.statusCode).toBe(400);
  });
});

describe("GET /items/:name", function () {
  test("Gets a single item", async function () {
    const resp = await request(app).get("/items/popsicle");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
  });

  test("404 if item not found", async function () {
    const resp = await request(app).get("/items/notreal");
    expect(resp.statusCode).toBe(404);
  });
});

describe("PATCH /items/:name", function () {
  test("Updates an item", async function () {
    const resp = await request(app)
      .patch("/items/popsicle")
      .send({ name: "new popsicle", price: 2.45 });

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      updated: { name: "new popsicle", price: 2.45 },
    });
  });

  test("Can update just price", async function () {
    const resp = await request(app)
      .patch("/items/popsicle")
      .send({ price: 9.99 });

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      updated: { name: "popsicle", price: 9.99 },
    });
  });

  test("404 if item not found", async function () {
    const resp = await request(app)
      .patch("/items/notreal")
      .send({ name: "x" });

    expect(resp.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", function () {
  test("Deletes an item", async function () {
    const resp = await request(app).delete("/items/popsicle");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: "Deleted" });

    const getResp = await request(app).get("/items");
    expect(getResp.body).toEqual([]);
  });

  test("404 if item not found", async function () {
    const resp = await request(app).delete("/items/notreal");
    expect(resp.statusCode).toBe(404);
  });
});

