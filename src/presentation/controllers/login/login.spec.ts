import { LoginController } from "./login";
import { badRequest, ok, serverError, unauthorized } from "../../helpers/http/http-helper";
import { MissingParamError } from "../../../presentation/errors";
import { HttpRequest, Validation } from "../signup/signup-protocols";
import { MockProxy, mock } from "jest-mock-extended";
import { Authentication } from "../../../data/protocols/authentication";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: "any_email@mail.com",
    password: "any_password"
  }
});

describe("Login Controller", () => {
  let authenticationStub: MockProxy<Authentication>;
  let validationStub: MockProxy<Validation>;
  let sut: LoginController;

  beforeEach(() => {
    authenticationStub = mock();
    authenticationStub.auth.mockResolvedValue("any_token");
    validationStub = mock();
    validationStub.validate.mockReturnValue(null);
    sut = new LoginController(authenticationStub, validationStub);
  });

  it("should call Authentication with correct values", async () => {
    await sut.handle(makeFakeRequest());
    expect(authenticationStub.auth).toHaveBeenCalledWith({ email: "any_email@mail.com", password: "any_password" });
  });

  it("should return 401 if invalid credentials are provided", async () => {
    authenticationStub.auth.mockResolvedValueOnce("");
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  it("should return 500 if Authentication throws", async () => {
    authenticationStub.auth.mockImplementationOnce(() => { throw new Error(); });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it("should return 200 if valid credentials are provided", async () => {
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok({ accessToken: "any_token" }));
  });

  it("should call Validation with correct values", async () => {
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validationStub.validate).toHaveBeenCalledWith(httpRequest.body);
  });

  it("should return 400 if Validation returns an error", async () => {
    validationStub.validate.mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")));
  });
});
