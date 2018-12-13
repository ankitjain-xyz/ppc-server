import mongoose from 'mongoose';
import Target from '../helper-schemas/target';
import Meta from '../helper-schemas/_meta';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const logSchemaOptions = {
  timestamps: true,
  discriminatorKey: 'logType',
};

const logSchema = new Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: 'User',
  },
  target: {
    type: Target,
    required: true,
  },
  meta: {
    type: Meta,
    required: true,
  },
}, logSchemaOptions);

export default mongoose.model('Log', logSchema);
