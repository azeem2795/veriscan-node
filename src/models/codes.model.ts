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
    valid_attempt_location: {
      ip_address: String,
      lat: String,
      long: String,
      city: String,
      country: String,
      region: String,
      zip: String,
    },
    user_agent: String,
    validation_time: Date,
    code_type: {
      type: String,
      enum: ['regular', 'nfc'],
      default: 'regular',
    },
    scan_attempts: {
      type: Number,
      default: 0,
    },
    repeated_attempts: [
      {
        ip_address: String,
        lat: String,
        long: String,
        city: String,
        country: String,
        region: String,
        zip: String,
        timestamp: {
          type: Date,
          default: new Date(),
        },
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
