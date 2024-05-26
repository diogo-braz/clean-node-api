import { InvalidParamError } from "../../../presentation/errors";
import { CompareFieldsValidation } from "./compare-fields-validation";

describe("CompareFields Validation", () => {
  let sut: CompareFieldsValidation;

  beforeEach(() => {
    sut = new CompareFieldsValidation("field", "fieldToCompare");
  });

  it("should return a InvalidParamError if validation fails", () => {
    const error = sut.validate({ field: "any_field", fieldToCompare: "other_field" });
    expect(error).toEqual(new InvalidParamError("fieldToCompare"));
  });

  it("should return null if validation succeeds", () => {
    const error = sut.validate({ field: "any_field", fieldToCompare: "any_field" });
    expect(error).toBeFalsy();
  });
});
