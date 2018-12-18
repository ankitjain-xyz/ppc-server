import { rule, shield } from 'graphql-shield';
import User from './models/user';
import getUserId from './utils/getUserId';

/* const isAdmin = rule()(async (_, __, { token }) => {
  const userId = getUserId(token);
  const user = await User.findById(userId);
  return user.role === 'ADMIN';
}); */

const isOwner = rule()(async (_, { userId }, { token }) => {
  let id = null;
  if (userId) id = userId;
  if (token) id = getUserId(token);
  const user = await User.findById(id);
  return user.role === 'OWNER';
});

const permissions = shield({
  Query: {
    plants: isOwner,
  },
});

export default permissions;
