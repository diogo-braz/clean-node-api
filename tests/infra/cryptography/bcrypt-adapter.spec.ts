import bcrypt from "bcrypt";

import { BcryptAdapter } from "@/infra/cryptography/bcrypt-adapter";

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
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  it("should return a hash on success", async () => {
    const result = await sut.encrypt("any_value");
    expect(result).toBe("hash");
  });
});
