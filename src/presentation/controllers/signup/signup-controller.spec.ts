import { SignUpController } from "./signup-controller";
import { EmailValidator, AddAccount, AccountEntity, Validation } from "./signup-controller-protocols";
import { MissingParamError, ServerError } from "../../errors";
import { badRequest, ok, serverError } from "../../helpers/http/http-helper";

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
  let validationStub: MockProxy<Validation>;
  let sut: SignUpController;

  beforeEach(() => {
    emailValidatorStub = mock();
    emailValidatorStub.isValid.mockReturnValue(true);
    addAccountStub = mock();
    addAccountStub.add.mockResolvedValue(makeFakeAccount());
    validationStub = mock();
    validationStub.validate.mockReturnValue(null);
    sut = new SignUpController(addAccountStub, validationStub);
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
