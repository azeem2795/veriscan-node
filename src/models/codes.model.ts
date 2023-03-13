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
    },
    status: {
      type: String,
      enum: ['pending', 'validated', 'invalidated'],
      required: true,
    },
    ip_address: String,
    user_agent: String,
    validation_time: Date,
    scan_attempts: {
      type: Number,
      default: 0,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Model
export default model<Code & Document>('Code', codeSchema);
