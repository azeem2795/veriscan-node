/**
 * Code schema
 * @author Yousuf Kalim
 */
import { model, Schema, Document } from 'mongoose';
import Code from '@interfaces/codes.interface';

// Schema
const codeSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'validated', 'invalidated'],
      default: 'pending',
      required: true,
    },
    ip_address: String,
    user_agent: String,
    validation_time: Date,
    scan_attempts: {
      type: Number,
      default: 0,
    },
    invalid_attempts: [
      {
        ip_address: String,
        lat: String,
        long: String,
        city: String,
        country: String,
      },
    ],
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brand_name: {
      type: String,
      required: true,
    },
    request: {
      type: Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
    },
    request_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Model
export default model<Code & Document>('Code', codeSchema);
