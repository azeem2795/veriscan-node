import { model, Schema, Document } from 'mongoose';
import feedbackForm from '@interfaces/feedbackForm.interface';

// Schema
const feedbackFormSchema = new Schema(
  {
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    label: {
      type: String,
    },
    value: {
      type: String,
    },
    placeholder: String,
    isRequired: Boolean,
    isActive: Boolean,
  },
  {
    timestamps: true,
  },
);

// Model
export default model<feedbackForm & Document>('FeedbackForm', feedbackFormSchema);
