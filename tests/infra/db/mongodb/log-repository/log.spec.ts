import { MongoDbHelper } from "@/infra/db/mongodb/helpers/mongodb-helper";
import { LogMongoRepository } from "@/infra/db/mongodb/log-repository/log";
import { Collection } from "mongodb";

describe("Log Mongo Repository", () => {
  let sut: LogMongoRepository;
  let errorCollection: Collection;

  beforeAll(async () => {
    sut = new LogMongoRepository();
    await MongoDbHelper.connect(process.env.MONGO_URL!);
  });

  afterAll(async () => {
    await MongoDbHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = MongoDbHelper.getCollection("errors");
    await errorCollection.deleteMany();
  });

  it("should create an error log on success", async () => {
    await sut.logError("any_error");
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
