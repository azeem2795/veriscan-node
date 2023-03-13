/**
 * Request interfaces - Where we define all the interfaces for Code requests
 * @author Yousuf Kalim
 */
import User from './users.interface';

export default interface Request {
  name: string;
  number_of_codes: number;
  text?: string;
  brand: string | User;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}