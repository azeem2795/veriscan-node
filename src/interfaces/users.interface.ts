/**
 * User interfaces - Where we define all the interfaces for Users
 * @author Yousuf Kalim
 */
export default interface User {
  _id: string;
  name: string;
  email: string;
  code?: number;
  password?: string;
  role: 'admin' | 'brand';
  preferences?: {
    logo?: string;
    color?: string;
    secondaryColor?: string;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
