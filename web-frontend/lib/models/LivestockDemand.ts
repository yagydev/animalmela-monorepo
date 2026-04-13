import mongoose, { Document, Schema } from 'mongoose';

export type DemandStatus = 'open' | 'fulfilled' | 'expired';

export interface ILivestockDemand extends Document {
  animalType: string;
  breed?: string;
  minMilkYield?: number;
  budgetMin?: number;
  budgetMax?: number;
  state: string;
  district?: string;
  description: string;
  buyerName: string;
  buyerPhone: string;
  status: DemandStatus;
  expiresAt: Date;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LivestockDemandSchema = new Schema<ILivestockDemand>(
  {
    animalType: {
      type: String,
      required: true,
      enum: ['cow', 'buffalo', 'goat', 'sheep', 'poultry', 'other'],
      index: true
    },
    breed: { type: String, trim: true },
    minMilkYield: { type: Number, min: 0 },
    budgetMin: { type: Number, min: 0 },
    budgetMax: { type: Number, min: 0 },
    state: { type: String, required: true, trim: true, index: true },
    district: { type: String, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    buyerName: { type: String, required: true, trim: true },
    buyerPhone: { type: String, required: true, trim: true, index: true },
    status: {
      type: String,
      enum: ['open', 'fulfilled', 'expired'],
      default: 'open',
      index: true
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    viewsCount: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

LivestockDemandSchema.index({ status: 1, createdAt: -1 });
LivestockDemandSchema.index({ animalType: 1, state: 1, status: 1 });

const LivestockDemand =
  mongoose.models.LivestockDemand ||
  mongoose.model<ILivestockDemand>('LivestockDemand', LivestockDemandSchema);

export default LivestockDemand;
