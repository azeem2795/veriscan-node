import { Request } from 'express';
import User from './users.interface';

interface filed {
  name: string;
  value: string;
}

export default interface IFeedbackData extends Request {
  _id: string;
  brand: string | User;
  fileds: filed[];
}
