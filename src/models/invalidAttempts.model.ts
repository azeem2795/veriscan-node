import { model, Schema, Document } from 'mongoose';
import InvalidAttempts from '../interfaces/invalidAttempts.interface';

const invalidAttemptsSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    location: {
      ip_address: String,
      lat: String,
      long: String,
      city: String,
      country: String,
      region: String,
      zip: String,
    },
    scan_attempts: {
      type: Number,
      default: 1,
    },
    user_agent: String,
  },
  {
    timestamps: true,
  },
);

export default model<InvalidAttempts & Document>('InvalidAttempts', invalidAttemptsSchema);
