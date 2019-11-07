import { Router } from 'express';

import CreateUserController from './app/controllers/Users/CreateUserController';
import ListUsersController from './app/controllers/Users/ListUsersController';
import SessionController from './app/controllers/Users/SessionController';
import ExampleController from './app/controllers/Products/ExampleController';
import AuthMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/register', CreateUserController.store);
routes.post('/register/verify', CreateUserController.check);
routes.post('/session', SessionController.index);

routes.get('/users', ListUsersController.show);

routes.use(AuthMiddleware);

routes.get('/example', ExampleController.show);

export default routes;
