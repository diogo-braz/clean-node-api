import { LoadAccountByEmailRepository } from "../../../data/protocols/load-account-by-email-repository";
import { AccountEntity } from "../../../domain/entities/account";
import { MockProxy, mock } from "jest-mock-extended";
import { DbAuthentication } from "./db-authentication";

describe("DbAuthentication UseCase", () => {
  let loadAccountByEmailRepositoryStub: MockProxy<LoadAccountByEmailRepository>;
  let sut: DbAuthentication;

  beforeEach(() => {
    const account: AccountEntity = {
      id: "any_id",
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password"
    };
    loadAccountByEmailRepositoryStub = mock();
    loadAccountByEmailRepositoryStub.load.mockResolvedValue(account);
    sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
  });

  it("should call LoadAccountByEmailRepository with correct email", async () => {
    await sut.auth({ email: "any_email@mail.com", password: "any_password" });
    expect(loadAccountByEmailRepositoryStub.load).toHaveBeenCalledWith("any_email@mail.com");
  });
});
