import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface IVisit {
  timestamp: Date;
};

const visitSchema = new Schema({
  timestamp: { type: Date, default: Date.now }
});

export const Visit = mongoose.model<IVisit>('Visit', visitSchema);