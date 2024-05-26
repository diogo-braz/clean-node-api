import { MissingParamError } from "../../../presentation/errors";
import { RequiredFieldValidation } from "./required-field-validation";

describe("RequiredField Validation", () => {
  let sut: RequiredFieldValidation;

  beforeEach(() => {
    sut = new RequiredFieldValidation("field");
  });

  it("should return a MissingParamError if validation fails", () => {
    const error = sut.validate({ name: "any_name" });
    expect(error).toEqual(new MissingParamError("field"));
  });

  it("should return null if validation succeeds", () => {
    const error = sut.validate({ field: "any_field" });
    expect(error).toBeFalsy();
  });
});
