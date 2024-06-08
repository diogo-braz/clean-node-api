import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

describe("Jwt Adapter", () => {
  let sut: JwtAdapter;

  beforeEach(() => {
    sut = new JwtAdapter("secret");
  });

  it("should call sign with correct values", async () => {
    const signSpy = jest.spyOn(jwt, "sign");
    await sut.encrypt("any_id");
    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret");
  });
});
