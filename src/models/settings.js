import mongoose from 'mongoose';
import Meta from './helper-schemas/_meta';

const { Schema } = mongoose;

const settingsSchemaOptions = {
  timestamps: true,
};

const materialAttributeSchema = new Schema({
  value: String,
  meta: Meta,
}, settingsSchemaOptions);

export const materialAttribute = mongoose.model('MaterialAttribute', materialAttributeSchema);

const currencySchema = new Schema({
  value: String,
  symbol: 'String',
  default: Boolean,
  meta: Meta,
}, settingsSchemaOptions);

export const currency = mongoose.model('Currency', currencySchema);

const measuringUnitSchema = new Schema({
  value: String,
  meta: Meta,
}, settingsSchemaOptions);

export const measuringUnit = mongoose.model('MeasuringUnit', measuringUnitSchema);
