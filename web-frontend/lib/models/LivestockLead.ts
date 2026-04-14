import mongoose, { Document, Schema } from 'mongoose';

export type LivestockLeadStatus = 'new' | 'contacted' | 'closed' | 'spam';

export interface ILivestockLead extends Document {
  listingId: mongoose.Types.ObjectId;
  sellerId: string;
  sellerPhone: string;
  buyerId?: string;
  buyerName: string;
  buyerPhone: string;
  buyerMessage?: string;
  buyWithin?: '15d' | '30d' | 'later';
  source?: string;
  status: LivestockLeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LivestockLeadSchema = new Schema<ILivestockLead>(
  {
    listingId: { type: Schema.Types.ObjectId, required: true, ref: 'MarketplaceListing', index: true },
    sellerId: { type: String, required: true, index: true },
    sellerPhone: { type: String, required: true, trim: true },
    buyerId: { type: String, trim: true, index: true },
    buyerName: { type: String, required: true, trim: true },
    buyerPhone: { type: String, required: true, trim: true },
    buyerMessage: { type: String, trim: true, maxlength: 2000 },
    buyWithin: { type: String, enum: ['15d', '30d', 'later'], index: true },
    source: { type: String, trim: true, maxlength: 50 },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed', 'spam'],
      default: 'new',
      index: true
    }
  },
  { timestamps: true }
);

LivestockLeadSchema.index({ sellerPhone: 1, createdAt: -1 });
LivestockLeadSchema.index({ buyerPhone: 1, createdAt: -1 });

const LivestockLead =
  mongoose.models.LivestockLead || mongoose.model<ILivestockLead>('LivestockLead', LivestockLeadSchema);

export default LivestockLead;
