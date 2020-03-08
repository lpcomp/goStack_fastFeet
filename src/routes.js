import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import EntregadorController from './app/controllers/EntregadorController';
import EncomendaController from './app/controllers/EncomendaController';
import DisponivelController from './app/controllers/DisponivelController';
import EntregadorRetiradaController from './app/controllers/EntregadorRetiradaController';
import EntregadorEntregaController from './app/controllers/EntregadorEntregaController';
import EntregadorEncomendasController from './app/controllers/EntregadorEncomendasController';
import ProblemController from './app/controllers/ProblemController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/entregadores/:id/disponivel', DisponivelController.index); // retorna todos os horários disponíveis para o entregador
routes.put('/encomendas/:id/dataInicial', EntregadorRetiradaController.update); // entregador marca o horário da retirada do produto para entrega
routes.put('/encomendas/:id/dataFinal', EntregadorEntregaController.update); // entregador marca o horário da entrega do produto

routes.get(
  '/entregadores/:id/encomendasAtuais',
  EntregadorEncomendasController.index
); // para o entregador visualizar suas encomendas entregues e que ainda não foram entregues

routes.post('/files/signature', upload.single('file'), FileController.store); // Chamada para subir as imagens de assinatura pelo entregador

routes.get('/delivery/:id/problems', ProblemController.index); // lista todos os problemas
routes.post('/delivery/:id/problems', ProblemController.store); // entregador notifica um problema para uma encomenda
routes.delete('/problem/:id/cancel-delivery', ProblemController.delete); // distribuidora cancelando entrega

routes.use(authMiddleware); // middleware global só aplicado para as próximas chamadas
routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);
routes.put('/users', UserController.update);

// routes.post('/files', upload.single('file'), FileController.store);
routes.post('/files', upload.single('file'), FileController.store);

routes.post('/entregadores', EntregadorController.store);
routes.get('/entregadores', EntregadorController.index);
routes.put('/entregadores/:id', EntregadorController.update);
routes.delete('/entregadores/:id', EntregadorController.delete);

routes.post('/encomendas', EncomendaController.store);
routes.get('/encomendas', EncomendaController.index);
routes.put('/encomendas/:id', EncomendaController.update);
routes.delete('/encomendas/:id', EncomendaController.delete);

export default routes;
