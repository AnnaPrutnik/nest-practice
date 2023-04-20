import express from 'express';
import { RequestUser } from 'src/common/interfaces/requestUser.interface';

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
