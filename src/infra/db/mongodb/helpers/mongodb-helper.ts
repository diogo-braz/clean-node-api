import { Collection, MongoClient } from "mongodb";

export class MongoDbHelper {
  private static client: MongoClient | null = null;

  static async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
  }

  static async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }

  static getCollection (name: string): Collection {
    return this.client!.db().collection(name);
  }
}
