import { AddAccount } from "@/domain/usecases/add-acount";
import { Encrypter } from "../protocols/encrypter";

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    await this.encrypter.encrypt(account.password);
    return new Promise(resolve => resolve(null));
  }
}
