import request from "supertest";
import app from "../config/app";
import { MongoDbHelper } from "../../infra/db/mongodb/helpers/mongodb-helper";

describe("SignUp Routes", () => {
  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL!);
  });

  afterAll(async () => {
    await MongoDbHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoDbHelper.getCollection("accounts");
    await accountCollection.deleteMany();
  });

  it("should return an account on sucess", async () => {
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
