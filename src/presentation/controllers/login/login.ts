import { badRequest, ok, serverError } from "../../../presentation/helpers/http-helper";
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
      const requiredFields = ["email", "password"];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const validEmail = this.emailValidator.isValid(email);
      if (!validEmail) {
        return badRequest(new InvalidParamError("email"));
      }

      await this.authentication.auth(email, password);

      return ok("");
    } catch (error) {
      return serverError(error as Error);
    }

  }
}
