import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { AddAccount } from "../../../../domain/usecases/add-account";
import { MongoDbHelper } from "../helpers/mongodb-helper";
import { IdMapper } from "../mappers/id-mapper";
import { AccountEntity } from "../../../../domain/entities/account";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/account/update-access-token-repository";
import { ObjectId } from "mongodb";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/account/load-account-by-email-repository";

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
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

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = MongoDbHelper.getCollection("accounts");
    await accountCollection.updateOne(
      { _id: new ObjectId(id) }, { $set: { accessToken: token } }
    );
  }
}
