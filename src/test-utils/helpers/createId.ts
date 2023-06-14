import * as mongoose from 'mongoose';

export function createId() {
  const id = new mongoose.Types.ObjectId();
  return id.toString();
}
