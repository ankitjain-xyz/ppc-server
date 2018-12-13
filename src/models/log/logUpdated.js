import mongoose from 'mongoose';
import Log from '.';

const { Schema } = mongoose;

const logUpdatedSchemaOptions = {
  timestamps: true,
};

const logUpdatedSchema = new Schema({}, logUpdatedSchemaOptions);

export default Log.discriminator('LogUpdated', logUpdatedSchema);
