import { EmailValidatorAdapter } from "../../src/utils/email-validator-adapter";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail (): boolean {
    return true;
  }
}));

describe("EmailValidator Adapter", () => {
  let sut: EmailValidatorAdapter;

  beforeEach(() => {
    sut = new EmailValidatorAdapter();
  });

  it("should return false if validator returns false", () => {
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid({ email: "invalid_email@mail.com" });
    expect(isValid).toBe(false);
  });

  it("should return true if validator returns true", () => {
    const isValid = sut.isValid({ email: "valid_email@mail.com" });
    expect(isValid).toBe(true);
  });

  it("should call validator with correct params", () => {
    const isEmailSpy = jest.spyOn(validator, "isEmail");
    sut.isValid({ email: "any_email@mail.com" });
    expect(isEmailSpy).toHaveBeenCalledWith("any_email@mail.com");
  });
});
