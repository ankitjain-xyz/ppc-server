import 'dotenv/config';
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { ApolloServer, PubSub } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import genSchema from './utils/genSchema';
import permissions from './shield';
import confirmEmail from './utils/email/confirmEmail';

const startServer = async () => {
  const port = process.env.PORT || 4000;
  const hostname = process.env.HOSTNAME || 'localhost';
  const mongoUrl = (process.env.NODE_ENV && process.env.NODE_ENV === 'production')
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_DEV;
  const app = express();
  const pubsub = new PubSub();
  const schema = genSchema();

  applyMiddleware(schema, permissions);

  const server = new ApolloServer({
    schema,
    formatError: (error) => {
      const message = error.message.replace('Context creation failed: ', '');
      return {
        ...error,
        message,
      };
    },
    context: async ({ req, connection }) => {
      if (req) {
        const token = req.headers.authorization;
        const plantId = req.headers.plant;
        return {
          token,
          plantId,
          pubsub,
        };
      }
      if (connection) {
        return { pubsub };
      }
      return {};
    },
  });
  const httpServer = http.createServer(app);

  app.use(cors());
  app.get('/confirmation', async (req, res) => {
    await confirmEmail(req, res);
  });
  server.applyMiddleware({ app, path: '/graphql' });
  server.installSubscriptionHandlers(httpServer);
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
    .then(async () => {
      console.log('📚  Connected to database');
      await httpServer.listen(({ port, hostname }), () => {
        console.log(`🚀  Server ready at http://${hostname}:${port}/graphql`);
      });
    })
    .catch(err => console.error(err));
};

export default startServer;
