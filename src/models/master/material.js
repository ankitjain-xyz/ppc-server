import mongoose from 'mongoose';
import Meta from '../helper-schemas/_meta';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const { Mixed } = Schema.Types;

const materialSchemaOptions = {
  timestamps: true,
};

const materialSchema = new Schema({
  materialType: String,
  name: String,
  purchaseUnit: String,
  issueUnit: String,
  attributes: [{
    name: String,
    values: [Mixed],
  }],
  recipe: {
    ingredients: [{
      type: ObjectId,
      ref: 'Material',
    }],
    steps: [{
      type: ObjectId,
      ref: 'Process',
    }],
  },

  meta: Meta,
}, materialSchemaOptions);

materialSchema.index({
  materialType: 1,
  name: 1,
  meta: 1,
}, {
  unique: true,
});

export const material = mongoose.model('Material', materialSchema);

const materialVariantSchema = new Schema({
  material: {
    type: ObjectId,
    required: true,
    ref: 'Material',
  },
  name: String,
  attributes: [{
    name: String,
    value: Mixed,
  }],
  ptiConversionRate: {
    type: Number,
    default: 1,
  },
  amount: Number,
  currency: String,
}, materialSchemaOptions);

export const materialVariant = mongoose.model('MaterialVariant', materialVariantSchema);
