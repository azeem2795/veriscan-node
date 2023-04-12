/**
 * Code interfaces - Where we define all the interfaces for Codes
 * @author Yousuf Kalim
 */
import { Request } from 'request';
import User from './users.interface';

export default interface Code {
  _id: string;
  code: string;
  status: 'pending' | 'validated' | 'invalidated';
  ip_address?: string;
  user_agent?: string;
  validation_time?: string | Date | number;
  scan_attempts: number;
  brand: string | User;
  request: string | Request;
  brand_name: string;
  createdAt: string;
  updatedAt: string;
}
