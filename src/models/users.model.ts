/**
 * User schema
 * @author Yousuf Kalim
 */
import { model, Schema, Document } from 'mongoose';
import User from '@interfaces/users.interface';

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
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['admin','brand'],
      default: 'brand',
    },
    preferences: {
      logo: String,
      color: String
    },
    active: {
      type: Boolean,
      required: true,
      // TODO: Make this to false after development
      default: true
    }
  },
  {
    timestamps: true,
  },
);

// Model
export default model<User & Document>('User', userSchema);
