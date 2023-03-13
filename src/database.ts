/**
 * Database connection
 * @author Yousuf Kalim
 */
import { set, connect } from 'mongoose';
import { MONGODB_URI } from '@config';

// Setting
set('debug', true);

// Connection
connect(MONGODB_URI)
  // eslint-disable-next-line no-console
  .then(() => console.log('We are connected with database :)')) // Success
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log('DB Connection Error :( -------> ', err); // Failed
  });
