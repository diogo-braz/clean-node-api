import { MissingParamError } from "../../../presentation/errors";
import { ValidationComposite } from "./validation-composite";
import { MockProxy, mock } from "jest-mock-extended";
import { Validation } from "./validation";

describe("Validation Composite", () => {
  let validationStub: MockProxy<Validation>;
  let sut: ValidationComposite;

  beforeEach(() => {
    validationStub = mock();
    validationStub.validate.mockReturnValue(null);
    sut = new ValidationComposite([validationStub]);
  });

  it("should return an error if any validation fails", () => {
    validationStub.validate.mockReturnValueOnce(new MissingParamError("field"));
    const error = sut.validate({ field: "any_value" });
    expect(error).toEqual(new MissingParamError("field"));
  });
});
