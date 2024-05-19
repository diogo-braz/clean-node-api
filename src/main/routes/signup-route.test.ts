import request from "supertest";
import app from "../config/app";

describe("SignUp Routes", () => {
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
