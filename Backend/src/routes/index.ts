import { Router } from 'express';
import authRoute from './auth.route';
import companyRoute from './company.route';
import requestRoute from './request.route';
import userRoute from './user.route';
import todoRoute from './todo.route';

const routerAPI: Router = Router();

routerAPI.use('/auth', authRoute);
routerAPI.use('/company', companyRoute);
routerAPI.use('/requests', requestRoute);
routerAPI.use('/user', userRoute);
routerAPI.use('/todo', todoRoute);

export default routerAPI;
