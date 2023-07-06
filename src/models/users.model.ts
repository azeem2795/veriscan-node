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
    logoWidth: { type: Number, default: null },
    websiteLink: { type: String },
    url: { type: String },
    logo: { type: String },
    preferences: {
      logo: String,
      color: String,
      secondaryColor: String,
    },
    textTypography: {
      Heading: {
        fontName: String,
        fontWeight: String,
        fontSize: String,
      },
      Paragraph: {
        fontName: String,
        fontWeight: String,
        fontSize: String,
      },
      Body: {
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
    favIcon: { type: String },
    favIcons: [{ type: String }],
    socialMedia: [{ platform: String, link: String }],
    customizeButton: {
      btnType: String,
      radius: String,
      fontName: String,
      fontWeight: String,
      fontSize: String,
      bgColor: String,
      // if type is Outline then bg color is border
      border: String,
      color: String,
    },
    description: { type: String },
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
