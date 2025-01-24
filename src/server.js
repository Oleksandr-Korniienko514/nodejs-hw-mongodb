import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

export function setupServer() {
  const app = express();

  app.use(cors());

  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/', router);

  app.get('/', async (req, res) => {
    res.status(200).json({
      message: 'Contact list',
    });
  });


  app.use(notFoundHandler);


  app.use(errorHandler);


  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  return app;
}
