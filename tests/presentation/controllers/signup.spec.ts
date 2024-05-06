import { SignUpController } from "@/presentation/controllers/signup";
import { InvalidParamError } from "@/presentation/errors/invalid-param-error";
import { MissingParamError } from "@/presentation/errors/missing-param-error";
import { EmailValidator } from "@/presentation/protocols/email-validator";

import { mock, MockProxy } from "jest-mock-extended";

describe("SignUp Controller", () => {
  let emailValidatorStub: MockProxy<EmailValidator>;
  let sut: SignUpController;

  beforeEach(() => {
    emailValidatorStub = mock();
    emailValidatorStub.isValid.mockReturnValue(true);
    sut = new SignUpController(emailValidatorStub);
  });

  it("should return status code 400 if no name is provided", () => {
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  it("should return status code 400 if no email is provided", () => {
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  it("should return status code 400 if no password is provided", () => {
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  it("should return status code 400 if no password confirmation is provided", () => {
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password"
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"));
  });

  it("should return status code 400 if an invalid email is provided", () => {
    emailValidatorStub.isValid.mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
});
