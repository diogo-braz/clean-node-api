import { Controller } from "@/presentation/protocols";
import { LogControllerDecorator } from "./log";

import { mock, MockProxy } from "jest-mock-extended";

describe("LogController Decorator", () => {
  let sut: LogControllerDecorator;
  let controllerStub: MockProxy<Controller>;

  beforeEach(() => {
    controllerStub = mock();
    controllerStub.handle.mockResolvedValue({ statusCode: 200, body: { success: true } });
    sut = new LogControllerDecorator(controllerStub);
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
});
