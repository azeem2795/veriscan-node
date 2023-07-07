/**
 * Code interfaces - Where we define all the interfaces for Codes
 * @author Yousuf Kalim
 */
import User from './users.interface';

export interface InvalidAttempts {
  ip_address: string;
  lat: string;
  long: string;
  city: string;
  country: string;
  timestamp?: Date;
}

export interface IValidAttemptLocation {
  ip_address: string;
  lat: string;
  long: string;
  city: string;
  country: string;
}

export default interface Code {
  _id: string;
  code: string;
  status: 'pending' | 'validated' | 'invalidated';
  ip_address?: string;
  user_agent?: string;
  validation_time?: string | Date | number;
  scan_attempts: number;
  invalid_attempts?: InvalidAttempts[];
  valid_attempt_location?: IValidAttemptLocation;
  brand: string | User;
  request: string;
  request_name: string;
  brand_name: string;
  createdAt: string;
  updatedAt: string;
}
