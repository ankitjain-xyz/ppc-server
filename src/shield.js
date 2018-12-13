import { rule, shield, or } from 'graphql-shield';
import User from './models/user';
import getUserId from './utils/getUserId';

const isAdmin = rule()(async (_, __, { token }) => {
  const userId = getUserId(token);
  const user = await User.findById(userId);
  return user.role === 'ADMIN';
});

const isOwner = rule()(async (_, __, { token }) => {
  const userId = getUserId(token);
  const user = await User.findById(userId);
  return user.role === 'OWNER';
});

const permissions = shield({
  Query: {},
});

export default permissions;
