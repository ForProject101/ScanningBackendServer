//TASKSESSION.TS

import mongoose, { Schema, Document } from 'mongoose';

export interface ScreenData {
  barcode: string;
  status: 'Reparable' | 'Beyond Repair';
  timestamp: Date;
}

export interface ITaskSession extends Document {
  technicianId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  screens: ScreenData[];
}

const TaskSessionSchema: Schema = new Schema({
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  screens: [
    {
      barcode: { type: String, required: true },
      status: { type: String, enum: ['Reparable', 'Beyond Repair'], required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model<ITaskSession>('TaskSession', TaskSessionSchema);
