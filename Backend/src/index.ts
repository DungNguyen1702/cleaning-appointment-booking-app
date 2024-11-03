import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import indexRouter from './routes/index';

import 'reflect-metadata';
import { AppDataSource } from './config/data-source';

import * as dotenv from 'dotenv';
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      companyId?: number;
      role?: 'USER' | 'COMPANY';
    }
  }
}

// establish database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err: Error | unknown) => {
    console.error('Error during Data Source initialization:', err);
  });

// create and setup express app
const app = express();

app.use(
  cors({
    credentials: true,
    origin: '*',
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
