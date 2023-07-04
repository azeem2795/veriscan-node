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
    logoWidth: { type: Number },
    websiteLink: { type: String },
    url: { type: String },

    preferences: {
      logo: String,
      color: String,
      secondaryColor: String,
    },
    typography: {
      heading: {
        fontName: String,
        fontWeight: String,
        fontSize: String,
      },
      paragraph: {
        fontName: String,
        fontWeight: String,
        fontSize: String,
      },
      body: {
        fontName: String,
        fontWeight: String,
        fontSize: String,
      },
    },
    background: {
      type: {
        type: String,
      },
      img: String,
      color: String,
      selectedImg: String,
    },
    backgroundimages: [{ type: String }],
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
