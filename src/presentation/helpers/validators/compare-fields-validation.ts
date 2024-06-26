import { InvalidParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldNameToCompare: string
  ) {}

  validate (input: any): Error | null {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldNameToCompare);
    }

    return null;
  }
}
