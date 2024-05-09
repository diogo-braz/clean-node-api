import { AddAccountRepository } from "@/data/protocols/add-account-repository";
import { Encrypter } from "@/data/protocols/encrypter";
import { DbAddAccount } from "@/data/usecases/db-add-account";
import { MockProxy, mock } from "jest-mock-extended";

describe("DbAddAccount Usecase", () => {
  let encrypterStub: MockProxy<Encrypter>;
  let addAccountRepositoryStub: MockProxy<AddAccountRepository>;
  let sut: DbAddAccount;

  beforeEach(() => {
    encrypterStub = mock();
    encrypterStub.encrypt.mockResolvedValue("hashed_password");
    addAccountRepositoryStub = mock();
    addAccountRepositoryStub.add.mockResolvedValue({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password"
    });
    sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  });

  it("should call Encrypter with correct password", async () => {
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password"
    };
    await sut.add(accountData);
    expect(encrypterStub.encrypt).toHaveBeenCalledWith("valid_password");
  });

  it("should throw if Encrypter throws", async () => {
    encrypterStub.encrypt.mockImplementationOnce(() => { throw new Error(); });
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password"
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it("should call AddAccountRepository with correct values", async () => {
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password"
    };
    await sut.add(accountData);
    expect(addAccountRepositoryStub.add).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password"
    });
  });

  it("should throw if AddAccountRepository throws", async () => {
    addAccountRepositoryStub.add.mockImplementationOnce(() => { throw new Error(); });
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password"
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  it("should return an account on success", async () => {
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password"
    };
    const account = await sut.add(accountData);
    expect(account).toEqual({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password"
    });
  });
});
