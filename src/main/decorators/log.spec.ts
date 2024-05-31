import { Controller, HttpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

import { mock, MockProxy } from "jest-mock-extended";
import { ok, serverError } from "../../presentation/helpers/http/http-helper";
import { LogErrorRepository } from "../../data/protocols/db/log-error-repository";
import { AccountEntity } from "../../domain/entities/account";

const makeFakeRequest = () => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password"
  }
});

const makeFakeAccount = (): AccountEntity => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@mail.com",
  password: "valid_password"
});

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = "any_stack";
  const error = serverError(fakeError);
  return error;
};

describe("LogController Decorator", () => {
  let sut: LogControllerDecorator;
  let controllerStub: MockProxy<Controller>;
  let logErrorRepositoryStub: MockProxy<LogErrorRepository>;

  beforeEach(() => {
    controllerStub = mock();
    logErrorRepositoryStub = mock();
    controllerStub.handle.mockResolvedValue(ok(makeFakeAccount()));
    sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);
  });

  it("should call controller handle", async () => {
    await sut.handle(makeFakeRequest());
    expect(controllerStub.handle).toHaveBeenCalledWith(makeFakeRequest());
    expect(controllerStub.handle).toHaveBeenCalledTimes(1);
  });

  it("should return the same result of the controller", async () => {
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  it("should call LogErrorRepository with correct error if controller returns a server error", async () => {
    controllerStub.handle.mockResolvedValueOnce(makeFakeServerError());
    await sut.handle(makeFakeRequest());
    expect(logErrorRepositoryStub.logError).toHaveBeenCalledWith("any_stack");
  });
});
