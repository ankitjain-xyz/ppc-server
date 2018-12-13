import mongoose from 'mongoose';

const { Schema } = mongoose;
// const { ObjectId } = Schema.Types;

const companySchemaOptions = {
  timestamps: true,
};

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  domain: {
    type: String,
  },
}, {
  timestamps: true,
}, companySchemaOptions);

export default mongoose.model('Company', companySchema);
