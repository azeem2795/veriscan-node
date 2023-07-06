import axios from 'axios';

interface IReturnLocation {
  city: string;
  country: string;
  ip_address: string;
  lat: string;
  long: string;
}

export const getLocationByIP = async (ip: string): Promise<IReturnLocation | undefined> => {
  try {
    const ipAddress = ip;
    const location: any = await axios.get(`http://ip-api.com/json/${ipAddress}`);

    const { data } = location;
    const locationData = {
      city: data?.city,
      country: data?.country,
      ip_address: ipAddress,
      lat: data?.lat,
      long: data?.lon,
    };

    return locationData;
  } catch (err) {
    return undefined;
  }
};
