import { AddAccountRepository } from "../../protocols/db/add-account-repository";
import { Encrypter } from "../../protocols/cryptography/encrypter";
import { DbAddAccount } from "./db-add-account";
import { AccountEntity } from "../../../domain/entities/account";
import { AddAccount } from "../../../domain/usecases/add-account";
import { MockProxy, mock } from "jest-mock-extended";

const makeFakeAccount = (): AccountEntity => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password"
});

const makeFakeAccountData = (): AddAccount.Params => ({
  name: "valid_name",
  email: "valid_email",
  password: "valid_password"
});

describe("DbAddAccount Usecase", () => {
  let encrypterStub: MockProxy<Encrypter>;
  let addAccountRepositoryStub: MockProxy<AddAccountRepository>;
  let sut: DbAddAccount;

  beforeEach(() => {
    encrypterStub = mock();
    encrypterStub.encrypt.mockResolvedValue("hashed_password");
    addAccountRepositoryStub = mock();
    addAccountRepositoryStub.add.mockResolvedValue(makeFakeAccount());
    sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  });

  it("should call Encrypter with correct password", async () => {
    await sut.add(makeFakeAccountData());
    expect(encrypterStub.encrypt).toHaveBeenCalledWith("valid_password");
  });

  it("should throw if Encrypter throws", async () => {
    encrypterStub.encrypt.mockImplementationOnce(() => { throw new Error(); });
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  it("should call AddAccountRepository with correct values", async () => {
    await sut.add(makeFakeAccountData());
    expect(addAccountRepositoryStub.add).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password"
    });
  });

  it("should throw if AddAccountRepository throws", async () => {
    addAccountRepositoryStub.add.mockImplementationOnce(() => { throw new Error(); });
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });

  it("should return an account on success", async () => {
    const account = await sut.add(makeFakeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });
});
