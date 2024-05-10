import { AddAccountRepository } from "@/data/protocols/add-account-repository";
import { AddAccount } from "@/domain/usecases/add-account";
import { MongoDbHelper } from "@/infra/db/mongodb/helpers/mongodb-helper";

class AccountMongoRepository implements AddAccountRepository {
  async add (account: AddAccount.Params): Promise<AddAccount.Result> {
    const accountCollection = MongoDbHelper.getCollection("accounts");
    const result = await accountCollection.insertOne({ ...account });
    const id = result.insertedId.toString();
    return { id, ...account  };
  }
}

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL!);
  });

  afterAll(async () => {
    await MongoDbHelper.disconnect();
  });

  it("should return an account on success", async () => {
    const sut = new AccountMongoRepository();
    const account = await sut.add({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password"
    });
    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe("any_name");
    expect(account?.email).toBe("any_email@mail.com");
    expect(account?.password).toBe("any_password");
  });
});
