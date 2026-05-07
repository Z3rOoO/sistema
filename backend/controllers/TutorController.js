import TutorModel from '../models/TutorModel.js';

class TutorController {

    // GET /api/tutores - Listar todos os tutores
    static async listarTodos(req, res) {
        const dados = await TutorModel.listarTodos();
        res.json({ sucesso: true, dados });
        // TODO: Buscar todos os tutores no banco de dados
        // TODO: Retornar a lista com status 200
    }

    // GET /api/tutores/:id - Buscar tutor por ID
    static async buscarPorId(req, res) {
        const id = req.params.id;
        const item = await TutorModel.buscarPorId(id);
        
        return res.status(200).json({ sucesso: true, dados: item });

        // TODO: Obter o :id da URL → req.params.id
        // TODO: Buscar o tutor no banco de dados
        // TODO: Retornar 404 se não encontrado
        // TODO: Retornar o tutor com status 200 se encontrado
    }

    // POST /api/tutores - Cadastrar novo tutor
    static async criar(req, res) {
        const { nome, descricao } = req.body;
        const id = await TutorModel.criar({ nome, descricao });
        const item = await TutorModel.buscarPorId(id);
        res.status(201).json({ sucesso: true, dados: item });
        // TODO: Obter os dados do body → req.body
        // TODO: Validar os campos obrigatórios (ex: nome, cpf_cnpj)
        // TODO: Criar o tutor no banco de dados
        // TODO: Retornar o tutor criado com status 201
    }

    // PUT /api/tutores/:id - Atualizar dados de um tutor
    static async atualizar(req, res) {
        const { nome, descricao } = req.body;
        await TutorModel.atualizar(req.params.id, { nome, descricao });
        const item = await TutorModel.buscarPorId(req.params.id);
        res.json({ sucesso: true, dados: item });
        // TODO: Obter o :id da URL e os dados do body
        // TODO: Verificar se o tutor existe (retornar 404 se não)
        // TODO: Atualizar os dados no banco de dados
        // TODO: Retornar confirmação com status 200
    }

    // DELETE /api/tutores/:id - Remover um tutor
    static async excluir(req, res) {
        await TutorModel.excluir(req.params.id);
        res.json({ sucesso: true });

        // TODO: Obter o :id da URL
        // TODO: Verificar se o tutor existe (retornar 404 se não)
        // TODO: Excluir o tutor do banco de dados
        // TODO: Retornar confirmação com status 200
    }
}




export default TutorController;
