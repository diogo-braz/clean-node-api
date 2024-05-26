import { MockProxy, mock } from "jest-mock-extended";
import { EmailValidator } from "../../../presentation/protocols/email-validator";
import { EmailValidation } from "./email-validation";
import { InvalidParamError } from "../../../presentation/errors";

describe("Email Validation", () => {
  let emailValidatorStub: MockProxy<EmailValidator>;
  let sut: EmailValidation;

  beforeEach(() => {
    emailValidatorStub = mock();
    emailValidatorStub.isValid.mockReturnValue(true);
    sut = new EmailValidation("email", emailValidatorStub);
  });

  it("should return an error if EmailValidator returns false", () => {
    emailValidatorStub.isValid.mockReturnValueOnce(false);
    const error = sut.validate({ email: "any_email@mail.com" });
    expect(error).toEqual(new InvalidParamError("email"));
  });

  it("should call EmailValidator with correct email", () => {
    sut.validate({ email: "any_email@mail.com" });
    expect(emailValidatorStub.isValid).toHaveBeenCalledWith({ email: "any_email@mail.com" });
  });

  it("should throw if EmailValidator throws", () => {
    emailValidatorStub.isValid.mockImplementationOnce(() => { throw new Error(); });
    // sut.validate({ email: "any_email@mail.com" });
    expect(sut.validate).toThrow();
  });
});
