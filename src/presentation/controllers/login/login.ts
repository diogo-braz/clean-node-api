import { badRequest, serverError } from "../../../presentation/helpers/http-helper";
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../signup/signup-protocols";
import { InvalidParamError, MissingParamError } from "../../../presentation/errors";
import { Authentication } from "@/data/protocols/authentication";

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      if (!email) {
        return badRequest(new MissingParamError("email"));
      }

      const validEmail = this.emailValidator.isValid(email);
      if (!validEmail) {
        return badRequest(new InvalidParamError("email"));
      }

      await this.authentication.auth(email, password);

      return badRequest(new MissingParamError("password"));
    } catch (error) {
      return serverError(error as Error);
    }

  }
}
