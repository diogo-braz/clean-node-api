import { MissingParamError } from "../../../presentation/errors";
import { ValidationComposite } from "./validation-composite";
import { Validation } from "../../protocols/validation";

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null;
    }
  }
  return new ValidationStub();
};

describe("Validation Composite", () => {
  let validationStubs: Validation[];
  let sut: ValidationComposite;

  beforeEach(() => {
    validationStubs = [makeValidation(), makeValidation()];
    sut = new ValidationComposite(validationStubs);
  });

  it("should return an error if any validation fails", () => {
    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });

  it("should return first error if more then one validation fails", () => {
    jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce(new Error());
    jest.spyOn(validationStubs[1], "validate").mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new Error());
  });

  it("should not return if validation succeeds", () => {
    const error = sut.validate({ field: "any_value" });
    expect(error).toBeFalsy();
  });
});
