/**
 * User schema
 * @author Yousuf Kalim
 */
import { model, Schema, Document } from 'mongoose';
import Request from '@interfaces/requests.interface';

// Schema
const requestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    number_of_codes: {
      type: Number,
      required: true,
    },
    text: String,
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
    },
  },
  {
    timestamps: true,
  },
);

// Model
export default model<Request & Document>('Request', requestSchema);
