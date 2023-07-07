import { Request } from 'express';
import User from './users.interface';

export default interface IFeedbackForm extends Request {
  _id: string;
  brand: string | User;
  filedLabel: string;
  filedPlaceholder: string;
  filedRequired: boolean;
  filedActive: boolean;
}
