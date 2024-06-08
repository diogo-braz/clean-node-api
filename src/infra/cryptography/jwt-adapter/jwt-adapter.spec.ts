import jwt from "jsonwebtoken";
import { JwtAdapter } from "./jwt-adapter";

jest.mock("jsonwebtoken", () => ({
  async sign (): Promise<string> {
    return "any_token";
  }
}));

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

  it("should return a token on sign success", async () => {
    const accessToken = await sut.encrypt("any_id");
    expect(accessToken).toBe("any_token");
  });

  it("should throw if sign throws", async () => {
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.encrypt("any_id");
    await expect(promise).rejects.toThrow();
  });
});
