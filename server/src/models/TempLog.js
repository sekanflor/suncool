import mongoose from 'mongoose';

const tempLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    valueCelsius: { type: Number, required: true },
    note: { type: String, default: '' },
    recordedAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('TempLog', tempLogSchema);
