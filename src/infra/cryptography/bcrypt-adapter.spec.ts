import bcrypt from "bcrypt";

import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash (): Promise<string> {
    return "hash";
  },

  async compare (): Promise<boolean> {
    return true;
  }
}));

describe("Bcrypt Adapter", () => {
  const salt = 12;
  let sut: BcryptAdapter;

  beforeEach(() => {
    sut = new BcryptAdapter(salt);
  });

  it("should call hash with correct values", async () => {
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  it("should return a valid hash on hash success", async () => {
    const result = await sut.hash("any_value");
    expect(result).toBe("hash");
  });

  it("should throws if hash throws", async () => {
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => { throw new Error(); });
    const promise = sut.hash("any_value");
    await expect(promise).rejects.toThrow();
  });

  it("should call compare with correct values", async () => {
    const compareSpy = jest.spyOn(bcrypt, "compare");
    await sut.compare("any_value", "any_hash");
    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });

  it("should return true when compare succeeds", async () => {
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBe(true);
  });

  it("should return false when compare fails", async () => {
    jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false as never);
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBe(false);
  });
});
