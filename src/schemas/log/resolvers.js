import { withFilter } from 'apollo-server-express';
import Comment from '../../models/log/comment';
import Log from '../../models/log';
import User from '../../models/user';
import getMetaData from '../../utils/getMetaData';

const COMMENT_ADDED = 'COMMENT_ADDED';

export default {
  Query: {
    logs: async (_, { filter }, { token, plantId }) => {
      const { meta } = await getMetaData(token, plantId);
      const { targetId, logTypes } = filter;
      const query = { meta };
      if (targetId) {
        query.$or = [
          { 'target.item': targetId },
          { 'against.item': targetId },
        ];
      }
      if (logTypes) query.__t = { $in: logTypes };
      const logs = await Log
        .find(query)
        .populate('user', 'id firstName lastName')
        .populate('assignee', 'id firstName lastName')
        .populate('target.item', 'id taskNo')
        .populate('against.item', 'id taskNo')
        .sort({ createdAt: -1 });
      return logs;
    },
    comments: async (_, { filter }, { token, plantId }) => {
      const { meta } = await getMetaData(token, plantId);
      const { targetId } = filter;
      const query = { meta };
      if (targetId) query.target.item = targetId;
      const comments = await Comment
        .find(query)
        .populate('user', 'id firstName lastName avatarColor')
        .populate('target.item', 'id taskNo')
        .sort({ createdAt: 1 });
      return comments;
    },
    notifications: async (_, __, { token }) => {
      const { userId, meta } = await getMetaData(token);
      const query = {
        $or: [
          { assignee: userId },
          { tags: userId },
        ],
        meta,
      };
      const userBookmarks = (await User.findById(userId)).map(user => user.bookmarks);
      if (userBookmarks.length) {
        query.$or.push({ target: { $in: userBookmarks } });
      }
      const notifications = await Log
        .find(query)
        .sort({ createdAt: -1 });
      return notifications;
    },
  },
  Mutation: {
    addComment: async (_, { target, body }, { token, plantId, pubsub }) => {
      const { userId, meta } = await getMetaData(token, plantId);
      const newComment = await new Comment({
        user: userId,
        target,
        body,
        meta,
      }).save();
      await pubsub.publish(COMMENT_ADDED, { commentAdded: newComment });
      return true;
    },
  },
  Subscription: {
    commentAdded: {
      resolve: async (payload) => {
        const comment = await Comment
          .findById({ _id: payload.commentAdded._id })
          .populate('user', 'id firstName lastName avatar')
          .populate('target.item', 'id taskNo');
        return comment;
      },
      subscribe: withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(COMMENT_ADDED),
        (payload, variables) => {
          const newComment = payload.commentAdded;
          return newComment.target.item.toString() === variables.targetId;
        },
      ),
    },
    notificationAdded: {
      // TODO: add resolver and subscription
    },
  },
};
