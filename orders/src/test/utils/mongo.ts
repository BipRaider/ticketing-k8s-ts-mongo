import mongoose, { ObjectId, Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const dbConnect = async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri);
  } catch {}
};

export const dbDeleteMany = async () => {
  try {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } catch {}
};

export const dbDisconnect = async () => {
  try {
    if (mongoServer) await mongoServer.stop();
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } catch {}
};

export const createMongoId = (): string | ObjectId => new Types.ObjectId().toHexString();
