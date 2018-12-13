import mongoose from 'mongoose';
import User from '../models/user';
import Plant from '../models/plant';
import getUserId from './getUserId';

const getMetaData = async (token, plantId = null) => {
  const userId = getUserId(token);
  let validPlant = null;
  if (plantId) {
    validPlant = await Plant.findOne({ _id: plantId });
  }
  const user = await User.findOne({ _id: userId });
  if (user) {
    const { company } = user.meta;
    // TODO: Add special permissions check along with role
    const plant = validPlant && user.role === 'OWNER'
      ? mongoose.Types.ObjectId(plantId)
      : user.meta.plant;
    const meta = { company, plant };
    return { userId, meta };
  }
  return null;
};

export default getMetaData;
