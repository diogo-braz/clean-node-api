import { Encrypter } from "@/data/protocols/encrypter";
import { DbAddAccount } from "@/data/usecases/db-add-account";
import { MockProxy, mock } from "jest-mock-extended";

describe("DbAddAccount Usecase", () => {
  let encrypterStub: MockProxy<Encrypter>;
  let sut: DbAddAccount;

  beforeEach(() => {
    encrypterStub = mock();
    sut = new DbAddAccount(encrypterStub);
  });

  it("should call Encrypter with correct password", () => {
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password"
    };
    sut.add(accountData);
    expect(encrypterStub.encrypt).toHaveBeenCalledWith("valid_password");
  });
});
