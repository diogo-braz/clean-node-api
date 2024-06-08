import request from "supertest";
import app from "../config/app";
import { MongoDbHelper } from "../../infra/db/mongodb/helpers/mongodb-helper";
import { Collection } from "mongodb";
import { hash } from "bcrypt";

describe("Login Routes", () => {
  let accountCollection: Collection;

  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL!);
  });

  afterAll(async () => {
    await MongoDbHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = MongoDbHelper.getCollection("accounts");
    await accountCollection.deleteMany();
  });

  describe("POST /signup", () => {
    it("should return an 200 on signup", async () => {
      await request(app)
        .post("/api/signup")
        .send({
          name: "John Doe",
          email: "john@doe.com",
          password: "123",
          passwordConfirmation: "123"
        })
        .expect(200);
    });
  });


  describe("POST /login", () => {
    it("should return an 200 on login", async () => {
      const password = await hash("123", 12);
      await accountCollection.insertOne({
        name: "John Doe",
        email: "john@doe.com",
        password
      });

      await request(app)
        .post("/api/login")
        .send({
          email: "john@doe.com",
          password: "123"
        })
        .expect(200);
    });

    it("should return an 401 on login", async () => {
      await request(app)
        .post("/api/login")
        .send({
          email: "john@doe.com",
          password: "123"
        })
        .expect(401);
    });
  });
});
