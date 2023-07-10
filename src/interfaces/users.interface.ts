/**
 * User interfaces - Where we define all the interfaces for Users
 * @author Yousuf Kalim
 */
interface customizeButton {
  btnType: string;
  radius?: string;
  fontName?: string;
  fontWeight?: string;
  fontSize?: string;
  bgColor: string;
  border?: string;
  color?: string;
}
export default interface User {
  _id: string;
  name: string;
  email: string;
  code?: number;
  password?: string;
  role: 'admin' | 'brand';
  logo?: string;
  preferences?: {
    logo?: string;
    color?: string;
    secondaryColor?: string;
  };
  animation?: 'none' | 'movieIn' | 'zoomIn' | 'bottom';
  logoWidth?: number;
  websiteLink?: string;
  url?: string;
  favIcon?: string;
  favIcons?: [];
  socialMedia?: [];
  customizeButton?: customizeButton;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
