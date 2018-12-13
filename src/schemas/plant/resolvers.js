import Plant from '../../models/plant';
import User from '../../models/user';
import LogUpdated from '../../models/log/logUpdated';
import getMetaData from '../../utils/getMetaData';

export default {
  Query: {
    plant: async (_, { id }, { token }) => {
      const { meta } = await getMetaData(token);
      const { company } = meta;
      const plant = await Plant.findOne({ _id: id, company });
      return plant;
    },
    plants: async (_, { userId }, { token }) => {
      let company = null;
      if (token) {
        const { meta } = await getMetaData(token);
        ({ company } = meta);
      }
      if (userId) {
        const user = await User.findById(userId);
        ({ company } = user.meta);
      }
      const plants = await Plant.find({ company });
      return plants;
    },
  },
  Mutation: {
    updatePlant: async (_, { id, params }, { token }) => {
      const { userId, meta } = await getMetaData(token);
      const updatedPlant = await Plant.findOneAndUpdate(
        { _id: id },
        { ...params },
        { new: true },
      );
      await new LogUpdated({
        user: userId,
        target: {
          kind: 'Plant',
          item: updatedPlant.id,
        },
        meta,
      });
      return { plant: updatedPlant };
    },
  },
};
