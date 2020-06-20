import { Router } from 'express';
import multer from 'multer';
import ProviderController from './app/controllers/ProviderController';
import UserController from './app/controllers/UserController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AppointmentController from './app/controllers/AppointmentController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import AvailableController from './app/controllers/AvailableController';
import authMiddleware from './app/middlewares/auth';
import activeMiddleware from './app/middlewares/active';

import multerConfig from './config/multer';
import RequestController from './app/controllers/RequestController';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.use(activeMiddleware);
routes.get('/users', UserController.index);
routes.get('/getmyself', UserController.getmyself);

routes.post('/edituser/:id', UserController.editUser);
routes.put('/users', UserController.update);
routes.get('/getuser/:id', UserController.getUser);
// single 1 arquivo por vez
routes.post('/files', upload.single('file'), FileController.store);
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.get('/requests', RequestController.index);
routes.post('/requests', RequestController.store);
routes.post('/notification', RequestController.notification);
routes.put('/requests/:id', RequestController.update);
routes.delete('/appointments/:id', AppointmentController.delete);
routes.delete('/requests/:id', RequestController.delete);
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);
routes.get('/schedule', ScheduleController.index);
// notificacoes
routes.get('/notifications', NotificationController.index);
routes.get('/notifications/:id', NotificationController.update);
routes.put('/notifications/:id', NotificationController.update);
export default routes;
// module.exports = routes;
