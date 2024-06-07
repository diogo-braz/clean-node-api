import { AddAccount } from "../../../domain/usecases/add-account";
import { Hasher } from "../../protocols/cryptography/hasher";
import { AddAccountRepository } from "../../protocols/db/add-account-repository";

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    const hashedPassword = await this.hasher.hash(account.password);
    const accountData = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    });
    return accountData;
  }
}
