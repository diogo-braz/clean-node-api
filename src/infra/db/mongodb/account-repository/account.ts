import { AddAccountRepository } from "../../../../data/protocols/add-account-repository";
import { AddAccount } from "../../../../domain/usecases/add-account";
import { MongoDbHelper } from "../helpers/mongodb-helper";
import { IdMapper } from "../mappers/id-mapper";

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    const accountCollection = MongoDbHelper.getCollection("accounts");
    await accountCollection.insertOne(account);
    return IdMapper.toDomain(account);
  }
}
