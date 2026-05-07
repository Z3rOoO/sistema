import express from 'express';
import ctl from '../controllers/ConsultaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// TODO: Decida quais rotas precisam de autenticação (adicione authMiddleware)

// GET /api/emprestimos
router.get('/', ctl.listarTodos);

// GET /api/emprestimos/em-aberto
// ATENÇÃO: Esta rota deve vir ANTES de /:id para não ser interceptada
router.get('/em-aberto', ctl.listarEmAberto);
router.get('/canceladas', ctl.listarCancelada);
router.get('/concluidas', ctl.listarConcluida);

// GET /api/emprestimos/:id
router.get('/:id', ctl.buscarPorId);

// POST /api/emprestimos - Registrar saída (novo empréstimo)
router.post('/', ctl.criar);

// PUT /api/emprestimos/:id - Atualizar consulta
router.put('/:id', ctl.atualizar);

// DELETE /api/emprestimos/:id - Cancelar empréstimo
router.delete('/:id', ctl.excluir);

export default router;
