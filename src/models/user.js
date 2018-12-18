import mongoose from 'mongoose';
import Permission from './helper-schemas/permission';
import Bookmark from './helper-schemas/target';
import Meta from './helper-schemas/_meta';

const { Schema } = mongoose;

const userSchemaOptions = {
  timestamps: true,
};

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  username: String,
  email: String,
  phone: String,
  password: String,
  role: {
    type: String,
    required: true,
  },
  specialPermissions: [{
    type: Permission,
  }],
  avatarColor: String,
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
  readNotificationsAt: Date,
  bookmarks: [{
    type: Bookmark,
  }],
  meta: {
    type: Meta,
    required: true,
  },
}, userSchemaOptions);

export default mongoose.model('User', userSchema);
