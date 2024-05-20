import { Controller } from "@/presentation/protocols";
import { LogControllerDecorator } from "./log";

import { mock, MockProxy } from "jest-mock-extended";
import { serverError } from "@/presentation/helpers/http-helper";
import { LogErrorRepository } from "@/data/protocols/log-error-repository";

describe("LogController Decorator", () => {
  let sut: LogControllerDecorator;
  let controllerStub: MockProxy<Controller>;
  let logErrorRepositoryStub: MockProxy<LogErrorRepository>;

  beforeEach(() => {
    controllerStub = mock();
    logErrorRepositoryStub = mock();
    controllerStub.handle.mockResolvedValue({ statusCode: 200, body: { success: true } });
    sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);
  });

  it("should call controller handle", async () => {
    const httpRequest = {
      body: {
        email: "any_email",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    await sut.handle(httpRequest);
    expect(controllerStub.handle).toHaveBeenCalledWith(httpRequest);
    expect(controllerStub.handle).toHaveBeenCalledTimes(1);
  });

  it("should return the same result of the controller", async () => {
    const httpRequest = {
      body: {
        email: "any_email",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({ statusCode: 200, body: { success: true } });
  });

  it("should call LogErrorRepository with correct error if controller returns a server error", async () => {
    const fakeError = new Error();
    fakeError.stack = "any_stack";
    const error = serverError(fakeError);
    controllerStub.handle.mockResolvedValueOnce(error);
    const httpRequest = {
      body: {
        email: "any_email",
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password"
      }
    };
    await sut.handle(httpRequest);
    expect(logErrorRepositoryStub.log).toHaveBeenCalledWith("any_stack");
  });
});
