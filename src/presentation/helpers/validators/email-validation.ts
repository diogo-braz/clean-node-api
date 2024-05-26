import { EmailValidator } from "presentation/protocols/email-validator";
import { InvalidParamError, MissingParamError } from "../../errors";
import { Validation } from "./validation";

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | null {
    const isValid = this.emailValidator.isValid({ email: input[this.fieldName] });
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }

    return null;
  }
}
