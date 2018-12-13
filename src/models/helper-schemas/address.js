import mongoose from 'mongoose';

const { Schema } = mongoose;

const addressSchemaOptions = {
  _id: false,
};

const addressSchema = new Schema({
  addressLine: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
    required: [true, 'Country is required.'],
  },
  postalCode: {
    type: String,
  },
}, addressSchemaOptions);

export default addressSchema;
