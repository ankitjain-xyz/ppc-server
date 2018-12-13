import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const metaSchemaOptions = {
  _id: false,
};

export default new Schema({
  company: {
    type: ObjectId,
    required: true,
    ref: 'Company',
  },
  plant: {
    type: ObjectId,
    required: true,
    ref: 'Plant',
  },
}, metaSchemaOptions);
