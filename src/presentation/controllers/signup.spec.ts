import { SignUpController } from "./signup/signup";
import { EmailValidator, AddAccount, AccountEntity } from "./signup/signup-protocols";
import { InvalidParamError, MissingParamError, ServerError } from "../errors";
import { badRequest, ok, serverError } from "../helpers/http-helper";

import { mock, MockProxy } from "jest-mock-extended";

const makeFakeRequest = () => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password"
  }
});

const makeFakeAccount = (): AccountEntity => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password"
});

describe("SignUp Controller", () => {
  let emailValidatorStub: MockProxy<EmailValidator>;
  let addAccountStub: MockProxy<AddAccount>;
  let sut: SignUpController;

  beforeEach(() => {
    emailValidatorStub = mock();
    emailValidatorStub.isValid.mockReturnValue(true);
    addAccountStub = mock();
    addAccountStub.add.mockResolvedValue(makeFakeAccount());
    sut = new SignUpController(emailValidatorStub, addAccountStub);
  });

  it("should return status code 400 if no name is provided", async () => {
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("name")));
  });

  it("should return status code 400 if no email is provided", async () => {
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });

  it("should return status code 400 if no password is provided", async () => {
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("password")));
  });

  it("should return status code 400 if no password confirmation is provided", async () => {
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("passwordConfirmation")));
  });

  it("should return status code 400 if password confirmation fails", async () => {
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "different_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("passwordConfirmation")));
  });

  it("should return status code 400 if an invalid email is provided", async () => {
    emailValidatorStub.isValid.mockReturnValueOnce(false);
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError("email")));
  });

  it("should call email validator with correct email", async () => {
    await sut.handle(makeFakeRequest());
    expect(emailValidatorStub.isValid).toHaveBeenCalledWith({ email: "any_email@mail.com" });
  });

  it("should return status code 500 if email validator throws", async () => {
    emailValidatorStub.isValid.mockImplementationOnce(() => { throw new Error(); });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  it("should call AddAccount with correct values", async () => {
    await sut.handle(makeFakeRequest());
    expect(addAccountStub.add).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password"
    });
    expect(addAccountStub.add).toHaveBeenCalledTimes(1);
  });

  it("should return status code 500 if AddAccount throws", async () => {
    addAccountStub.add.mockImplementationOnce(() => { throw new Error(); });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  it("should return status code 200 if AddAccount is provided", async () => {
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });
});
