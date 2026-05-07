import express from 'express';
import ctl from '../controllers/AnimalController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// TODO: Decida quais rotas precisam de autenticação (adicione authMiddleware)

// GET /api/equipamentos
router.get('/', ctl.listarTodos);

// GET /api/equipamentos/:id
router.get('/:id', ctl.buscarPorId);

// POST /api/equipamentos
router.post('/', ctl.criar);

// PUT /api/equipamentos/:id
router.put('/:id', ctl.atualizar);

// DELETE /api/equipamentos/:id
router.delete('/:id', ctl.excluir);

export default router;
