import { AddAccountRepository } from "../../protocols/db/account/add-account-repository";
import { Hasher } from "../../protocols/cryptography/hasher";
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
  let hasherStub: MockProxy<Hasher>;
  let addAccountRepositoryStub: MockProxy<AddAccountRepository>;
  let sut: DbAddAccount;

  beforeEach(() => {
    hasherStub = mock();
    hasherStub.hash.mockResolvedValue("hashed_password");
    addAccountRepositoryStub = mock();
    addAccountRepositoryStub.add.mockResolvedValue(makeFakeAccount());
    sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);
  });

  it("should call Hasher with correct password", async () => {
    await sut.add(makeFakeAccountData());
    expect(hasherStub.hash).toHaveBeenCalledWith("valid_password");
  });

  it("should throw if Hasher throws", async () => {
    hasherStub.hash.mockImplementationOnce(() => { throw new Error(); });
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
