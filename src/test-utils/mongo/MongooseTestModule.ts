import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer = null;

export const connectDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  return uri;
};

export const dropDB = async () => {
  if (mongod) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
    await mongoose.disconnect();
  }
};

export const dropCollections = async () => {
  if (mongod) {
    const collections = await mongoose.connection.db.collections();
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};
