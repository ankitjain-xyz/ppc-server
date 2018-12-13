import mongoose from 'mongoose';
import Log from '.';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const logAssignSchemaOptions = {
  timestamps: true,
};

const logAssignSchema = new Schema({
  assignee: {
    type: ObjectId,
    ref: 'User',
  },
}, logAssignSchemaOptions);

export default Log.discriminator('LogAssign', logAssignSchema);
