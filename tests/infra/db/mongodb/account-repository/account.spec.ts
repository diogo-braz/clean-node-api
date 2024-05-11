import { AccountMongoRepository } from "@/infra/db/mongodb/account-repository/account";
import { MongoDbHelper } from "@/infra/db/mongodb/helpers/mongodb-helper";

describe("Account Mongo Repository", () => {
  let sut: AccountMongoRepository;

  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL!);
  });

  afterAll(async () => {
    await MongoDbHelper.disconnect();
  });

  beforeEach(() => {
    sut = new AccountMongoRepository();
  });

  it("should return an account on success", async () => {
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
