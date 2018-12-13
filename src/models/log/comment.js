import mongoose from 'mongoose';
import Log from '.';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const commentSchemaOptions = {
  timestamps: true,
};

const commentSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  tags: [{
    type: ObjectId,
    required: true,
    ref: 'User',
  }],
}, commentSchemaOptions);

export default Log.discriminator('Comment', commentSchema);
