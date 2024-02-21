const request = require("supertest");
const app = require("./src/app");
const syncSeed = require("./seed");
const { User, Fruit } = require("./models/index");
let userQuantity;
let fruitQuantity;

const { describe, test, expect, beforeAll } = require("@jest/globals");

// // clear db before tests
beforeAll(async () => {
  await syncSeed();
  const users = await User.findAll({});
  const fruits = await Fruit.findAll({});
  userQuantity = users.length;
  fruitQuantity = fruits.length;
});

//Users tests
describe("tests for /users", () => {
  test("GET /users returns 200 status code", async () => {
    const response = await request(app).get("/users");

    expect(response.statusCode).toBe(200);
  });

  test("GET /users returns correct length of users", async () => {
    const response = await request(app).get("/users");

    expect(response.body).toHaveLength(userQuantity);
  });

  test("GET /users returns array of users", async () => {
    const response = await request(app).get("/users");
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0]).toHaveProperty("age");
  });

  test("GET /users returns correct users data", async () => {
    const response = await request(app).get("/users");
    expect(response.body).toContainEqual(
      expect.objectContaining({
        name: "User 1",
      })
    );
  });

  test("GET /users/:id returns correct user", async () => {
    const response = await request(app).get("/users/1");

    expect(response.body).toEqual(
      expect.objectContaining({
        name: "User 1",
      })
    );
  });

  test("POST /users", async () => {
    const response = await request(app).post("/users").send({
      name: "User 5",
      age: 31,
    });

    const actual = await request(app).get("/users");

    expect(actual.body).toContainEqual(
      expect.objectContaining({ name: "User 5" })
    );
  });

  test("POST returns error obj when name field is empty", async () => {
    const response = await request(app).post("/users").send({
      name: "",
      age: "location",
    });

    expect(response.body.error).toEqual(
      expect.arrayContaining([
        {
          value: "",
          msg: "Invalid value",
          param: "name",
          location: "body",
        },
      ])
    );
  });

  test("POST returns error obj when age field is empty", async () => {
    const response = await request(app).post("/users").send({
      name: "Test",
      age: "",
    });

    expect(response.body.error).toEqual(
      expect.arrayContaining([
        {
          value: "",
          msg: "Invalid value",
          param: "age",
          location: "body",
        },
      ])
    );
  });

  test("PUT /users/:id", async () => {
    const response = await request(app)
      .put("/users/1")
      .send({ name: "User 1.2", age: 45 });

    const foundUser = await User.findByPk(1);

    expect(foundUser.name).toBe("User 1.2");
  });

  test("DELETE /users/:id", async () => {
    const response = await request(app).delete("/users/1");

    const users = await User.findAll({});
    expect(users).toHaveLength(userQuantity);
    expect(users[0].id).not.toEqual(1);
  });
});

//Fruit tests
describe("tests for /fruits", () => {
  test("GET /fruits returns 200 status code", async () => {
    const response = await request(app).get("/fruits");

    expect(response.statusCode).toBe(200);
  });

  test("GET /fruits returns correct length of fruits", async () => {
    const response = await request(app).get("/fruits");

    expect(response.body).toHaveLength(fruitQuantity);
  });

  test("GET /fruits returns array of fruits", async () => {
    const response = await request(app).get("/fruits");
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0]).toHaveProperty("color");
  });

  test("GET /fruits returns correct fruits data", async () => {
    const response = await request(app).get("/fruits");
    expect(response.body).toContainEqual(
      expect.objectContaining({
        name: "Apple",
      })
    );
  });

  test("GET /fruits/:id returns correct fruit", async () => {
    const response = await request(app).get("/fruits/1");

    expect(response.body).toEqual(
      expect.objectContaining({
        name: "Apple",
      })
    );
  });

  test("POST /fruits", async () => {
    const response = await request(app).post("/fruits").send({
      name: "Mango",
      color: "yellow",
    });

    const actual = await request(app).get("/fruits");

    expect(actual.body).toContainEqual(
      expect.objectContaining({ name: "Mango" })
    );
  });

  test("PUT /fruits/:id", async () => {
    const response = await request(app)
      .put("/fruits/1")
      .send({ name: "Red Grape", color: "purple" });

    const foundFruit = await Fruit.findByPk(1);

    expect(foundFruit.name).toBe("Red Grape");
  });

  test("DELETE /fruits/:id", async () => {
    const response = await request(app).delete("/fruits/1");

    const fruits = await Fruit.findAll({});
    expect(fruits).toHaveLength(fruitQuantity);
    expect(fruits[0].id).not.toEqual(1);
  });
});
