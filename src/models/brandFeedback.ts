import { model, Schema, Document } from 'mongoose';
import brandFeedback from '@/interfaces/brandFeedback.interface';

// Schema
const brandFeedbackSchema = new Schema(
  {
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    fileds: [
      {
        name: String,
        value: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Model
export default model<brandFeedback & Document>('BrandFeedback', brandFeedbackSchema);
