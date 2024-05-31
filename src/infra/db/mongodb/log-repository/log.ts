import { LogErrorRepository } from "../../../../data/protocols/db/log-error-repository";
import { MongoDbHelper } from "../helpers/mongodb-helper";

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = MongoDbHelper.getCollection("errors");
    await errorCollection.insertOne({
      stack,
      date: new Date()
    });
  }
}
