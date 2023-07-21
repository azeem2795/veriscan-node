export interface InValidAttemptLocation {
  ip_address: string;
  lat: string;
  long: string;
  city: string;
  country: string;
}
export default interface InvalidAttempts {
  _id: string;
  code: string;
  location: InValidAttemptLocation;
  user_agent: string;
  scan_attempts: number;
  createdAt: string;
  updatedAt: string;
}
