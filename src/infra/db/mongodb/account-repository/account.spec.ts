import { AccountMongoRepository } from "./account";
import { MongoDbHelper } from "../helpers/mongodb-helper";
import { Collection } from "mongodb";

describe("Account Mongo Repository", () => {
  let sut: AccountMongoRepository;
  let accountCollection: Collection;

  beforeAll(async () => {
    await MongoDbHelper.connect(process.env.MONGO_URL!);
  });

  afterAll(async () => {
    await MongoDbHelper.disconnect();
  });

  beforeEach(async () => {
    sut = new AccountMongoRepository();
    accountCollection = MongoDbHelper.getCollection("accounts");
    await accountCollection.deleteMany();
  });

  it("should return an account on add success", async () => {
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

  it("should return an account on loadByEmail success", async () => {
    await accountCollection.insertOne({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password"
    });
    const account = await sut.loadByEmail("any_email@mail.com");
    expect(account).toBeTruthy();
    expect(account?.id).toBeTruthy();
    expect(account?.name).toBe("any_name");
    expect(account?.email).toBe("any_email@mail.com");
    expect(account?.password).toBe("any_password");
  });

  it("should return null if loadByEmail fails", async () => {
    const account = await sut.loadByEmail("any_email@mail.com");
    expect(account).toBeFalsy();
  });
});
