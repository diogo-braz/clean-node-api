import { EmailValidator } from "@/presentation/protocols/email-validator";
import validator from "validator";

export class EmailValidatorAdapter implements EmailValidator {
  isValid (params: EmailValidator.Params): boolean {
    return validator.isEmail(params.email);
  }
}
