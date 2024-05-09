import { AddAccount } from "@/domain/usecases/add-acount";
import { Encrypter } from "../protocols/encrypter";
import { AddAccountRepository } from "@/tests/data/usecases/db-add-account.spec";

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    const hashedPassword = await this.encrypter.encrypt(account.password);
    await this.addAccountRepository.add({
      ...account,
      password: hashedPassword
    });
    return new Promise(resolve => resolve(null));
  }
}
