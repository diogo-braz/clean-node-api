import { LoginController } from "./login";
import { badRequest } from "../../helpers/http-helper";
import { InvalidParamError, MissingParamError } from "../../../presentation/errors";
import { EmailValidator, HttpRequest } from "../signup/signup-protocols";
import { MockProxy, mock } from "jest-mock-extended";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password"
  }
});

describe("Login Controller", () => {
  let emailValidatorStub: MockProxy<EmailValidator>;
  let sut: LoginController;

  beforeEach(() => {
    emailValidatorStub = mock();
    emailValidatorStub.isValid.mockReturnValue(true);
    sut = new LoginController(emailValidatorStub);
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
});
