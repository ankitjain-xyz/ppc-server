import mongoose from 'mongoose';
import Log from '.';

const { Schema } = mongoose;

const logStatusSchemaOptions = {
  timestamps: true,
};

const logStatusSchema = new Schema({
  status: {
    type: String,
  },
}, logStatusSchemaOptions);

export default Log.discriminator('LogStatus', logStatusSchema);
