import { LoadAccountByEmailRepository } from "../../../data/protocols/db/load-account-by-email-repository";
import { AccountEntity } from "../../../domain/entities/account";
import { MockProxy, mock } from "jest-mock-extended";
import { DbAuthentication } from "./db-authentication";
import { AuthenticationModel } from "../../../data/protocols/authentication";
import { HashComparer } from "../../../data/protocols/cryptography/hash-comparer";
import { TokenGenerator } from "../../../data/protocols/cryptography/token-generator";

const makeFakeAccount = (): AccountEntity => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "hashed_password"
});

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "any_email@mail.com",
  password: "any_password"
});

describe("DbAuthentication UseCase", () => {
  let loadAccountByEmailRepositoryStub: MockProxy<LoadAccountByEmailRepository>;
  let hashComparerStub: MockProxy<HashComparer>;
  let tokenGeneratorStub: MockProxy<TokenGenerator>;
  let sut: DbAuthentication;

  beforeEach(() => {
    loadAccountByEmailRepositoryStub = mock();
    loadAccountByEmailRepositoryStub.load.mockResolvedValue(makeFakeAccount());
    hashComparerStub = mock();
    hashComparerStub.compare.mockResolvedValue(true);
    tokenGeneratorStub = mock();
    tokenGeneratorStub.generate.mockResolvedValue("any_token");
    sut = new DbAuthentication(
      loadAccountByEmailRepositoryStub,
      hashComparerStub,
      tokenGeneratorStub
    );
  });

  it("should call LoadAccountByEmailRepository with correct email", async () => {
    await sut.auth(makeFakeAuthentication());
    expect(loadAccountByEmailRepositoryStub.load).toHaveBeenCalledWith(
      "any_email@mail.com",
    );
  });

  it("should throw if LoadAccountByEmailRepository throws", async () => {
    loadAccountByEmailRepositoryStub.load.mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  it("should return null if LoadAccountByEmailRepository returns null", async () => {
    loadAccountByEmailRepositoryStub.load.mockResolvedValueOnce(null);
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  it("should call HashComparer with correct values", async () => {
    await sut.auth(makeFakeAuthentication());
    expect(hashComparerStub.compare).toHaveBeenCalledWith(
      "any_password",
      "hashed_password"
    );
  });

  it("should throw if HashComparer throws", async () => {
    hashComparerStub.compare.mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  it("should return null if HashComparer returns false", async () => {
    hashComparerStub.compare.mockResolvedValueOnce(false);
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
  });

  it("should call TokenGenerator with correct id", async () => {
    await sut.auth(makeFakeAuthentication());
    expect(tokenGeneratorStub.generate).toHaveBeenCalledWith("any_id");
  });
});
