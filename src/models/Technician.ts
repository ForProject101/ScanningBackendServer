import mongoose from 'mongoose';

const TechnicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  task: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Technician', TechnicianSchema);
