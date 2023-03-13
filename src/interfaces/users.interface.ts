/**
 * User interfaces - Where we define all the interfaces for Users
 * @author Yousuf Kalim
 */
export default interface User {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'brand';
  preferences?: {
    logo?: string;
    color?: string;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
