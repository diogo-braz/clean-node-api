import { LoadAccountByEmailRepository } from "../../../data/protocols/db/account/load-account-by-email-repository";
import { AccountEntity } from "../../../domain/entities/account";
import { MockProxy, mock } from "jest-mock-extended";
import { DbAuthentication } from "./db-authentication";
import { AuthenticationModel } from "../../../data/protocols/authentication";
import { HashComparer } from "../../../data/protocols/cryptography/hash-comparer";
import { Encrypter } from "../../protocols/cryptography/encrypter";
import { UpdateAccessTokenRepository } from "../../protocols/db/account/update-access-token-repository";

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
  let encrypterStub: MockProxy<Encrypter>;
  let updateAccessTokenRepositoryStub: MockProxy<UpdateAccessTokenRepository>;
  let sut: DbAuthentication;

  beforeEach(() => {
    loadAccountByEmailRepositoryStub = mock();
    loadAccountByEmailRepositoryStub.loadByEmail.mockResolvedValue(makeFakeAccount());
    hashComparerStub = mock();
    hashComparerStub.compare.mockResolvedValue(true);
    encrypterStub = mock();
    encrypterStub.encrypt.mockResolvedValue("any_token");
    updateAccessTokenRepositoryStub = mock();
    updateAccessTokenRepositoryStub.updateAccessToken.mockResolvedValue();
    sut = new DbAuthentication(
      loadAccountByEmailRepositoryStub,
      hashComparerStub,
      encrypterStub,
      updateAccessTokenRepositoryStub,
    );
  });

  it("should call LoadAccountByEmailRepository with correct email", async () => {
    await sut.auth(makeFakeAuthentication());
    expect(loadAccountByEmailRepositoryStub.loadByEmail).toHaveBeenCalledWith(
      "any_email@mail.com",
    );
  });

  it("should throw if LoadAccountByEmailRepository throws", async () => {
    loadAccountByEmailRepositoryStub.loadByEmail.mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  it("should return null if LoadAccountByEmailRepository returns null", async () => {
    loadAccountByEmailRepositoryStub.loadByEmail.mockResolvedValueOnce(null);
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

  it("should call Encrypter with correct id", async () => {
    await sut.auth(makeFakeAuthentication());
    expect(encrypterStub.encrypt).toHaveBeenCalledWith("any_id");
  });

  it("should throw if Encrypter throws", async () => {
    encrypterStub.encrypt.mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });

  it("should return a token on success", async () => {
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBe("any_token");
  });

  it("should call UpdateAccessTokenRepository with correct values", async () => {
    updateAccessTokenRepositoryStub.updateAccessToken.mockResolvedValueOnce();
    await sut.auth(makeFakeAuthentication());
    expect(updateAccessTokenRepositoryStub.updateAccessToken).toHaveBeenCalledWith("any_id", "any_token");
  });

  it("should throw if UpdateAccessTokenRepository throws", async () => {
    updateAccessTokenRepositoryStub.updateAccessToken.mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.auth(makeFakeAuthentication());
    expect(promise).rejects.toThrow();
  });
});
