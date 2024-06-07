import bcrypt from "bcrypt";

import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash (): Promise<string> {
    return "hash";
  }
}));

describe("Bcrypt Adapter", () => {
  const salt = 12;
  let sut: BcryptAdapter;

  beforeEach(() => {
    sut = new BcryptAdapter(salt);
  });

  it("should call bcrypt with correct values", async () => {
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  it("should return a hash on success", async () => {
    const result = await sut.hash("any_value");
    expect(result).toBe("hash");
  });

  it("should throws if bcrypt throws", async () => {
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => { throw new Error(); });
    const promise = sut.hash("any_value");
    await expect(promise).rejects.toThrow();
  });
});
