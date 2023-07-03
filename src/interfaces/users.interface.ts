/**
 * User interfaces - Where we define all the interfaces for Users
 * @author Yousuf Kalim
 */
export default interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'brand';
  preferences?: {
    logo?: string;
    color?: string;
    secondaryColor?: string;
  };
  logoWidth?: number;
  websiteLink?: string;
  url?: string;
  socialMedia?: [];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
