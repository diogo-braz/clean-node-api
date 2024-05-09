import { AddAccount } from "@/domain/usecases/add-acount";
import { Encrypter } from "../protocols/encrypter";
import { AddAccountRepository } from "@/data/protocols/add-account-repository";

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    const hashedPassword = await this.encrypter.encrypt(account.password);
    const accountData = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    });
    return accountData;
  }
}
