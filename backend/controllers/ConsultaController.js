import ConsultaModel from '../models/ConsultaModel.js';

class ConsultaController {

    // GET /api/consultas - Listar todas as consultas
    static async listarTodos(req, res) {
        const dados = await ConsultaModel.listarTodos();
        res.json({ sucesso: true, dados });
        // TODO: Buscar todas as consultas no banco de dados
        // TODO: Retornar a lista com status 200
    }

    // GET /api/tutores/:id - Buscar tutor por ID
    static async buscarPorId(req, res) {
        const id = req.params.id;
        const item = await ConsultaModel.buscarPorId(id);

        return res.status(200).json({ sucesso: true, dados: item });

        // TODO: Obter o :id da URL → req.params.id
        // TODO: Buscar o tutor no banco de dados
        // TODO: Retornar 404 se não encontrado
        // TODO: Retornar o tutor com status 200 se encontrado
    }

    // POST /api/tutores - Cadastrar novo tutor
    static async criar(req, res) {
        const { nome, descricao } = req.body;
        const id = await ConsultaModel.criar({ nome, descricao });
        const item = await ConsultaModel.buscarPorId(id);
        res.status(201).json({ sucesso: true, dados: item });
        // TODO: Obter os dados do body → req.body
        // TODO: Validar os campos obrigatórios (ex: nome, cpf_cnpj)
        // TODO: Criar a consulta no banco de dados
        // TODO: Retornar a consulta criada com status 201
    }

    // PUT /api/consultas/:id - Atualizar dados de uma consulta
    static async atualizar(req, res) {
        const { nome, descricao } = req.body;
        await ConsultaModel.atualizar(req.params.id, { nome, descricao });
        const item = await ConsultaModel.buscarPorId(req.params.id);
        res.json({ sucesso: true, dados: item });
        // TODO: Obter o :id da URL e os dados do body
        // TODO: Verificar se a consulta existe (retornar 404 se não)
        // TODO: Atualizar os dados no banco de dados
        // TODO: Retornar confirmação com status 200
    }

    // DELETE /api/consultas/:id - Remover uma consulta
    static async excluir(req, res) {
        await ConsultaModel.excluir(req.params.id);
        res.json({ sucesso: true });

        // TODO: Obter o :id da URL
        // TODO: Verificar se o tutor existe (retornar 404 se não)
        // TODO: Excluir o tutor do banco de dados
        // TODO: Retornar confirmação com status 200
    }



    // GET /api/emprestimos/em-aberto - Listar empréstimos ainda não devolvidos
    static async listarEmAberto(req, res) {
        const statur = 'agendada';
        const item = await ConsultaModel.buscarEmAberto(statur);
        return res.status(200).json({ sucesso: true, dados: item });
        // TODO: Buscar empréstimos onde data_devolucao_real é NULL
        // TODO: Retornar a lista com status 200
    }

    static async listarConcluida(req, res) {
        const statur = 'concluida';
        const item = await ConsultaModel.buscarEmAberto(statur);
        return res.status(200).json({ sucesso: true, dados: item });
        // TODO: Buscar empréstimos onde data_devolucao_real é NULL
        // TODO: Retornar a lista com status 200
    }

     static async listarCancelada(req, res) {
        const statur = 'cancelada';
        const item = await ConsultaModel.buscarEmAberto(statur);
        return res.status(200).json({ sucesso: true, dados: item });
        // TODO: Buscar empréstimos onde data_devolucao_real é NULL
        // TODO: Retornar a lista com status 200
    }




}

export default ConsultaController;
