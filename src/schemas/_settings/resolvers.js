import {
  currency as Currency,
  materialAttribute as MaterialAttribute,
  measuringUnit as MeasuringUnit,
} from '../../models/settings';
import getMetaData from '../../utils/getMetaData';

export default {
  Query: {
    currencies: async (_, __, { token, plantId }) => {
      const { meta } = await getMetaData(token, plantId);
      const currencies = await Currency.find({ meta });
      return currencies;
    },
    materialAttributes: async (_, __, { token, plantId }) => {
      const { meta } = await getMetaData(token, plantId);
      const attributes = await MaterialAttribute.find({ meta });
      return attributes;
    },
    measuringUnits: async (_, __, { token, plantId }) => {
      const { meta } = await getMetaData(token, plantId);
      const units = await MeasuringUnit.find({ meta });
      return units;
    },
  },
};
