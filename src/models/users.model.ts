/**
 * User schema
 * @author Yousuf Kalim
 */
import { model, Schema, Document } from 'mongoose';
import User from '@interfaces/users.interface';
import { NODE_ENV } from '@config';

// Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: String,
    role: {
      type: String,
      enum: ['admin', 'brand'],
      default: 'brand',
    },
    preferences: {
      logo: String,
      color: String,
    },
    active: {
      type: Boolean,
      required: true,
      default: NODE_ENV !== 'prod',
    },
  },
  {
    timestamps: true,
  },
);

// Model
export default model<User & Document>('User', userSchema);
