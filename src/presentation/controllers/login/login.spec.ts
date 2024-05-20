import { LoginController } from "./login";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamError } from "../../../presentation/errors";

describe("Login Controller", () => {
  let sut: LoginController;

  beforeEach(() => {
    sut = new LoginController();
  });

  it("should return 400 if no email is provided", async () => {
    const httpRequest = {
      body: {
        password: ""
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("email")));
  });
});
