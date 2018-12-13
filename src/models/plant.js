import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema;

const plantSchemaOptions = {
  timestamps: true,
};

const plantSchema = new Schema({
  city: {
    type: String,
  },
  name: {
    type: String,
  },
  code: {
    type: String,
  },
  company: {
    type: ObjectId,
    required: true,
    ref: 'Company',
  },
}, plantSchemaOptions);

export default mongoose.model('Plant', plantSchema);
