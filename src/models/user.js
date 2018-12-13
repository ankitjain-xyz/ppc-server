import mongoose from 'mongoose';
import Permission from './helper-schemas/permission';
import Bookmark from './helper-schemas/target';
import Meta from './helper-schemas/_meta';

const { Schema } = mongoose;

const userSchemaOptions = {
  timestamps: true,
};

const userSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  specialPermissions: [{
    type: Permission,
  }],
  avatarColor: {
    type: String,
  },
  status: {
    type: String,
    enum: [
      'PENDING',
      'VERIFIED',
      'ACTIVE',
      'LOCKED',
    ],
    default: 'PENDING',
  },
  readNotificationsAt: {
    type: Date,
  },
  bookmarks: [{
    type: Bookmark,
  }],
  meta: {
    type: Meta,
    required: true,
  },
}, userSchemaOptions);

export default mongoose.model('User', userSchema);
