import express from 'express';
import TutorController from '../controllers/TutorController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// TODO: Decida quais rotas precisam de autenticação (adicione authMiddleware)

// GET /api/tutores
router.get('/', TutorController.listarTodos);

// GET /api/clientes/:id
router.get('/:id', TutorController.buscarPorId);

// POST /api/clientes
router.post('/', TutorController.criar);

// PUT /api/clientes/:id
router.put('/:id', TutorController.atualizar);

// DELETE /api/clientes/:id
router.delete('/:id', TutorController.excluir);

export default router;
