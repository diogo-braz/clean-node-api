import { AddAccountRepository } from "@/data/protocols/add-account-repository";
import { AddAccount } from "@/domain/usecases/add-account";
import { MongoDbHelper } from "../helpers/mongodb-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    const accountCollection = MongoDbHelper.getCollection("accounts");
    const result = await accountCollection.insertOne({ ...account });
    const id = result.insertedId.toString();
    return { id, ...account  };
  }
}
