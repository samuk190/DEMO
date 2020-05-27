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
import multerConfig from './config/multer';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.put('/users', UserController.update);
// single 1 arquivo por vez
routes.post('/files', upload.single('file'), FileController.store);
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);
routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);
routes.get('/schedule', ScheduleController.index);
// notificacoes
routes.get('/notifications', NotificationController.index);
routes.get('/notifications/:id', NotificationController.update);
routes.put('/notifications/:id', NotificationController.update);
export default routes;
// module.exports = routes;
