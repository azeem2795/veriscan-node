/**
 * Code interfaces - Where we define all the interfaces for Codes
 * @author Yousuf Kalim
 */
import User from './users.interface';

export default interface Code {
  code: string;
  status: 'pending' | 'validated' | 'invalidated';
  ip_address?: string;
  user_agent?: string;
  validation_time?: string;
  scan_attempts: number;
  brand: string | User;
  createdAt: string;
  updatedAt: string;
}
