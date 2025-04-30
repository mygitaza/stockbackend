// stockSchema.js
import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  stockName: {
    type: String,
    required: true,
    default: "MODE Inc"
  },
  units: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Processing', 'Approved'],
    default: 'Processing'
  }
}, { timestamps: true });

export default stockSchema;
