import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/load-account-by-email-repository";
import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { AddAccount } from "../../../../domain/usecases/add-account";
import { MongoDbHelper } from "../helpers/mongodb-helper";
import { IdMapper } from "../mappers/id-mapper";
import { AccountEntity } from "../../../../domain/entities/account";

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    const accountCollection = MongoDbHelper.getCollection("accounts");
    await accountCollection.insertOne(account);
    return IdMapper.toDomain(account);
  }

  async loadByEmail (email: string): Promise<AccountEntity | null> {
    const accountCollection = MongoDbHelper.getCollection("accounts");
    const account = await accountCollection.findOne({ email });
    return account && IdMapper.toDomain(account);
  }
}
