import { BcryptAdapter } from "@/infra/cryptography/bcrypt-adapter";

import bcrypt from "bcrypt";
import { MockProxy, mock } from "jest-mock-extended";

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
});
