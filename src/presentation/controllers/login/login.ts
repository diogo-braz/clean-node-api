import { badRequest } from "../../../presentation/helpers/http-helper";
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../signup/signup-protocols";
import { MissingParamError } from "../../../presentation/errors";

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body;

    if (!email) {
      return badRequest(new MissingParamError("email"));
    }

    this.emailValidator.isValid(email);

    return badRequest(new MissingParamError("password"));
  }
}
