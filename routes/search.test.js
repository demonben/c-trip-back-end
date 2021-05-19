require("../lib/config");
const supertest = require("supertest");
const { createProduct, deleteProduct } = require("../data/products");
const {
  addUser,
  hashPassword,
  generateUserToken,
  deleteUser,
} = require("../data/users");
const app = require("../server");
const faker = require("faker");

describe("Products routes", () => {
  describe("GET /products/:id", () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const product = {
      name: faker.commerce.product(),
      price: 12,
      category: "Category 1",
    };
    let token;
    beforeAll(async () => {
      const passwordHash = await hashPassword(user.password);
      const userId = await addUser(user.email, passwordHash);
      user.id = userId;
      token = generateUserToken(user);
      const { id, createdDate } = await createProduct(
        product.name,
        product.price,
        product.category,
        userId
      );
      product.id = id;
      product.created_date = createdDate.toISOString();
    });

    afterAll(async () => {
      await deleteProduct(product.id);
      await deleteUser(user.id);
    });

    it("Should return a product", async () => {
      const response = await supertest(app)
        .get(`/products/${product.id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        product: {
          ...product,
          userId: user.id,
        },
      });
    });
    it("Should return not found", async () => {
      const response = await supertest(app)
        .get(`/products/12asdaw`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(404);
    });
    it("Should return unauthorized", async () => {
      const response = await supertest(app).get(`/products/${product.id}`);
      expect(response.statusCode).toBe(401);
    });
  });
  describe("POST /products", () => {});
  describe("GET /products", () => {});
});
