import { SignUpController } from "@/presentation/controllers/signup/signup";
import { EmailValidator, AddAccount } from "@/presentation/controllers/signup/signup-protocols";
import { InvalidParamError, MissingParamError, ServerError } from "@/presentation/errors";

import { mock, MockProxy } from "jest-mock-extended";

describe("SignUp Controller", () => {
  let emailValidatorStub: MockProxy<EmailValidator>;
  let addAccountStub: MockProxy<AddAccount>;
  let sut: SignUpController;

  beforeEach(() => {
    emailValidatorStub = mock();
    emailValidatorStub.isValid.mockReturnValue(true);
    addAccountStub = mock();
    addAccountStub.add.mockResolvedValue({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password"
    });
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"));
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
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("passwordConfirmation"));
  });

  it("should return status code 400 if an invalid email is provided", async () => {
    emailValidatorStub.isValid.mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "any_name",
        email: "invalid_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  it("should call email validator with correct email", async () => {
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    await sut.handle(httpRequest);
    expect(emailValidatorStub.isValid).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("should return status code 500 if email validator throws", async () => {
    emailValidatorStub.isValid.mockImplementationOnce(() => { throw new Error(); });
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it("should call AddAccount with correct values", async () => {
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    await sut.handle(httpRequest);
    expect(addAccountStub.add).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password"
    });
    expect(addAccountStub.add).toHaveBeenCalledTimes(1);
  });

  it("should return status code 500 if AddAccount throws", async () => {
    addAccountStub.add.mockImplementationOnce(() => { throw new Error(); });
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it("should return status code 200 if AddAccount is provided", async () => {
    const httpRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password"
    });
  });
});
