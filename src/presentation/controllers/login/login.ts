import { badRequest } from "../../../presentation/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../signup/signup-protocols";
import { MissingParamError } from "../../../presentation/errors";

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError("email"));
    }

    return badRequest(new MissingParamError("password"));
  }
}
