import { SignUpController } from "@/presentation/controllers/signup";

describe("SignUp Controller", () => {
  it("should return status code 400 if no name is provided", () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});