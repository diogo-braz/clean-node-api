import { LoginController } from "./login";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamError } from "../../../presentation/errors";
import { EmailValidator } from "../signup/signup-protocols";
import { MockProxy, mock } from "jest-mock-extended";

describe("Login Controller", () => {
  let emailValidatorStub: MockProxy<EmailValidator>;
  let sut: LoginController;

  beforeEach(() => {
    emailValidatorStub = mock();
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

  it("should call EmailValidator with correct email", async () => {
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password"
      }
    };
    await sut.handle(httpRequest);
    expect(emailValidatorStub.isValid).toHaveBeenCalledWith("any_email@mail.com");
  });
});
