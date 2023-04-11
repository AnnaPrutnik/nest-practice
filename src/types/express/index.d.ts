import express from 'express';
import { UserDocument } from 'src/user/schemas/user.schema';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
