import jwt from 'jsonwebtoken';

const createToken = (user, secret, expiresIn) => {
  const { id } = user;
  return jwt.sign({ id }, secret, { expiresIn });
};

export default createToken;
