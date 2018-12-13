import bcrypt from 'bcryptjs';
import User from '../../models/user';
import Company from '../../models/company';
import Plant from '../../models/plant';
import {
  currency as Currency,
  materialAttribute as MaterialAttribute,
  measuringUnit as MeasuringUnit,
  role as Role,
} from '../../models/settings';
import LogCreated from '../../models/log/logCreated';
import getUserId from '../../utils/getUserId';
import getMetaData from '../../utils/getMetaData';
import createToken from '../../utils/createToken';
import { welcomeEmail, notificationNewUser, invitationEmail } from '../../utils/email/emailTemplates';
import { getRandomColor } from '../../utils/helper';
import sendEmail from '../../utils/email/sendEmail';
import attributes from '../../seed/attributes';
import currencies from '../../seed/currencies';
import units from '../../seed/units';
import roles from '../../seed/roles';
import * as errors from './errors';

export default {
  Query: {
    user: async (_, { id }, { token }) => {
      const userId = getUserId(token);
      const user = await User.findById(id || userId).populate('meta.plant');
      return user;
    },
    users: async (_, { filter }, { token, plantId }) => {
      const { meta } = await getMetaData(token, plantId);
      const query = { meta };
      const { status, firstName, lastName } = filter;
      if (status) query.status = status;
      if (firstName) query.firstName = firstName;
      if (lastName) query.lastName = lastName;
      const users = await User.find(query);
      return users;
    },
  },
  Mutation: {
    verifyUser: async (_, { username }) => {
      const user = await User.findOne({
        $or: [
          { username },
          { email: username },
          { phone: username },
        ],
      }).populate('meta.plant', 'id code');
      if (!user) {
        return {
          errors: [{
            path: 'username',
            message: errors.INVALID_USER,
          }],
        };
      }
      return { user };
    },
    signin: async (_, { username, password }) => {
      const user = await User.findOne({
        $or: [
          { username },
          { email: username },
          { phone: username },
        ],
      });
      if (!user) {
        return {
          errors: [{
            path: 'username',
            message: errors.INVALID_USER,
          }],
        };
      }
      if (user.status === 'PENDING') {
        return {
          errors: [{
            path: 'status',
            message: errors.STATUS_PENDING,
          }],
        };
      }
      if (user.status === 'VERIFIED') {
        return {
          errors: [{
            path: 'status',
            message: errors.STATUS_VERIFIED,
          }],
        };
      }
      if (user.status === 'LOCKED') {
        return {
          errors: [{
            path: 'status',
            message: errors.STATUS_LOCKED,
          }],
        };
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return {
          errors: [{
            path: 'password',
            message: errors.INVALID_PASS,
          }],
        };
      }
      const token = await createToken(user, process.env.SECRET, process.env.EXPIRES_IN);
      return { token };
    },
    signup: async (_, { user }) => {
      const {
        firstName,
        lastName,
        email,
        companyName,
        city,
      } = user;
      const invalidEmail = await User.findOne({ email });
      if (invalidEmail) {
        return {
          errors: [{
            path: 'email',
            message: errors.EMAIL_EXISTS,
          }],
        };
      }
      const domain = email.replace(/.*@/, '');
      const invalidDomain = await Company.findOne({ domain });
      const invalidCompany = await Company.findOne({ name: companyName });
      if (invalidDomain || invalidCompany) {
        return {
          errors: [{
            path: 'companyName',
            message: errors.COMPANY_EXISTS,
          }],
        };
      }
      const company = await new Company({ name: companyName, domain }).save();
      const plant = await new Plant({ city, company: company.id }).save();
      await Currency.create(currencies);
      await MeasuringUnit.create(units);
      await MaterialAttribute.create(attributes);
      await Role.create(roles);
      const newUser = await new User({
        firstName,
        lastName,
        email,
        role: 'OWNER',
        'meta.company': company.id,
        'meta.plant': plant.id,
      }).save();
      await sendEmail(welcomeEmail(newUser));
      await sendEmail(notificationNewUser(newUser));
      return true;
    },
    completeSignup: async (_, { email, username, password }) => {
      const user = await User.findOne({ email }, 'status');
      if (user.status === 'PENDING') {
        return {
          errors: [{
            path: 'email',
            message: errors.STATUS_PENDING,
          }],
        };
      }
      if (user.status === 'ACTIVE') {
        return {
          errors: [{
            path: 'email',
            message: errors.REGISTERED,
          }],
        };
      }
      const invalidUsername = await User.findOne({ username });
      if (invalidUsername) {
        return {
          errors: [{
            path: 'username',
            message: errors.USERNAME_TAKEN,
          }],
        };
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const avatarColor = getRandomColor();
      const updatedUser = await User.findOneAndUpdate({ email }, {
        username,
        password: hashedPassword,
        status: 'ACTIVE',
        avatarColor,
      });
      if (!updatedUser) {
        return {
          errors: [{
            path: 'email',
            message: errors.INVALID_EMAIL,
          }],
        };
      }
      console.log(`User registeration complete for ${updatedUser.email}`);
      return true;
    },
    inviteUsers: async (_, { users }, { token }) => {
      const userId = getUserId(token);
      const thisUser = await User.findById(userId);
      const { meta } = thisUser;
      const companyMembers = (await User.find({ company: meta.company }, 'email')).map(o => o.email);
      const emails = [];
      users.forEach(async (user) => {
        if (!companyMembers.includes(user.email)) {
          if (user.plantId) meta.plant = user.plantId;
          else meta.plant = thisUser.meta.plant;
          const newUser = new User({
            email: user.email,
            role: user.role,
            status: 'PENDING',
            meta,
          });
          emails.push(newUser.email);
          await newUser.save();
          await new LogCreated({
            user: userId,
            target: {
              kind: 'User',
              item: newUser.id,
            },
            meta,
          }).save();
          await sendEmail(invitationEmail(newUser, thisUser));
          await sendEmail(notificationNewUser(newUser));
        }
      });
      return { invitedUsersEmail: emails };
    },
  },
};
