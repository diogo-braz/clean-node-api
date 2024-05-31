import { LoadAccountByEmailRepository } from "../../../data/protocols/db/load-account-by-email-repository";
import { AccountEntity } from "../../../domain/entities/account";
import { MockProxy, mock } from "jest-mock-extended";
import { DbAuthentication } from "./db-authentication";
import { AuthenticationModel } from "data/protocols/authentication";

const makeFakeAccount = (): AccountEntity => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password"
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "any_email@mail.com",
  password: "any_password"
});

describe("DbAuthentication UseCase", () => {
  let loadAccountByEmailRepositoryStub: MockProxy<LoadAccountByEmailRepository>;
  let sut: DbAuthentication;

  beforeEach(() => {
    loadAccountByEmailRepositoryStub = mock();
    loadAccountByEmailRepositoryStub.load.mockResolvedValue(makeFakeAccount());
    sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
  });

  it("should call LoadAccountByEmailRepository with correct email", async () => {
    await sut.auth(makeFakeAuthentication());
    expect(loadAccountByEmailRepositoryStub.load).toHaveBeenCalledWith("any_email@mail.com");
  });

  it("should throw if LoadAccountByEmailRepository throws", async () => {
    loadAccountByEmailRepositoryStub.load.mockImplementationOnce(() => { throw new Error(); });
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });
});
