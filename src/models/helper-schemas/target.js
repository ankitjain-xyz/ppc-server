import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const metaSchemaOptions = {
  _id: false,
};

export default new Schema({
  kind: {
    type: String,
    required: true,
  },
  item: {
    type: ObjectId,
    required: true,
    refPath: 'kind',
  },
}, metaSchemaOptions);
