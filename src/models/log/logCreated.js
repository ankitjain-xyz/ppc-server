import mongoose from 'mongoose';
import Log from '.';
import Against from '../helper-schemas/target';

const { Schema } = mongoose;

const logCreatedSchemaOptions = {
  timestamps: true,
};

const logCreatedSchema = new Schema({
  against: {
    type: Against,
  },
}, logCreatedSchemaOptions);

export default Log.discriminator('LogCreated', logCreatedSchema);
