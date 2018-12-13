import { AuthenticationError } from 'apollo-server-express';
import { verify } from 'jsonwebtoken';

const getUserId = (token, secret = process.env.SECRET) => {
  try {
    if (token) {
      const { id } = verify(token.replace('Bearer ', ''), secret);
      return id;
    }
    throw new AuthenticationError('Not authenticated. Please signin to continue.');
  } catch (err) {
    throw new AuthenticationError('Your session has expired. Please signin to continue.');
  }
};

export default getUserId;
