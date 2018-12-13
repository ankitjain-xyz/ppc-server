import mongoose from 'mongoose';

const { Schema } = mongoose;

const permissionSchemaOptions = {
  _id: false,
};

const permissionSchema = new Schema({
  action: {
    type: String,
    required: true,
  },
  value: {
    type: Boolean,
    required: true,
    default: false,
  },
}, permissionSchemaOptions);

export default permissionSchema;
