import { LoginController } from "./login";
import { badRequest, serverError } from "../../helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../../../presentation/errors";
import { EmailValidator, HttpRequest } from "../signup/signup-protocols";
import { MockProxy, mock } from "jest-mock-extended";
import { Authentication } from "../../../data/protocols/authentication";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password"
  }
});

describe("Login Controller", () => {
  let emailValidatorStub: MockProxy<EmailValidator>;
  let authenticationStub: MockProxy<Authentication>;
  let sut: LoginController;

  beforeEach(() => {
    emailValidatorStub = mock();
    emailValidatorStub.isValid.mockReturnValue(true);
    authenticationStub = mock();
    authenticationStub.auth.mockResolvedValue("any_token");
    sut = new LoginController(emailValidatorStub, authenticationStub);
  });

  it("should return 400 if no email is provided", async () => {
    const httpRequest = {
      body: {
        password: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  it("should return 400 if no password is provided", async () => {
    const httpRequest = {
      body: {
        email: "any_email"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  it("should return 400 if an invalid email is provided", async () => {
    emailValidatorStub.isValid.mockReturnValueOnce(false);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  it("should call EmailValidator with correct email", async () => {
    await sut.handle(makeFakeRequest());
    expect(emailValidatorStub.isValid).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("should return 500 if EmailValidator throws", async () => {
    emailValidatorStub.isValid.mockImplementationOnce(() => { throw new Error(); });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should call Authentication with correct values", async () => {
    await sut.handle(makeFakeRequest());
    expect(authenticationStub.auth).toHaveBeenCalledWith("any_email@mail.com", "any_password");
  });
});
