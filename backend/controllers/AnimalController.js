import AnimalModel from '../models/AnimalModel.js';

class AnimalController {

      // GET /api/animais - Listar todos os animais
        static async listarTodos(req, res) {
            const dados = await AnimalModel.listarTodos();
            res.json({ sucesso: true, dados });
            // TODO: Buscar todos os animais no banco de dados
            // TODO: Retornar a lista com status 200
        }
    
        // GET /api/tutores/:id - Buscar tutor por ID
        static async buscarPorId(req, res) {
            const id = req.params.id;
            const item = await AnimalModel.buscarPorId(id);
            
            return res.status(200).json({ sucesso: true, dados: item });
    
            // TODO: Obter o :id da URL → req.params.id
            // TODO: Buscar o tutor no banco de dados
            // TODO: Retornar 404 se não encontrado
            // TODO: Retornar o tutor com status 200 se encontrado
        }
    
        // POST /api/tutores - Cadastrar novo tutor
        static async criar(req, res) {
            const { nome, descricao } = req.body;
            const id = await AnimalModel.criar({ nome, descricao });
            const item = await AnimalModel.buscarPorId(id);
            res.status(201).json({ sucesso: true, dados: item });
            // TODO: Obter os dados do body → req.body
            // TODO: Validar os campos obrigatórios (ex: nome, cpf_cnpj)
            // TODO: Criar o tutor no banco de dados
            // TODO: Retornar o tutor criado com status 201
        }
    
        // PUT /api/tutores/:id - Atualizar dados de um tutor
        static async atualizar(req, res) {
            const { nome, descricao } = req.body;
            await AnimalModel.atualizar(req.params.id, { nome, descricao });
            const item = await AnimalModel.buscarPorId(req.params.id);
            res.json({ sucesso: true, dados: item });
            // TODO: Obter o :id da URL e os dados do body
            // TODO: Verificar se o animal existe (retornar 404 se não)
            // TODO: Atualizar os dados no banco de dados
            // TODO: Retornar confirmação com status 200
        }
    
        // DELETE /api/animais/:id - Remover um animal                  
        static async excluir(req, res) {
            await TutorModel.excluir(req.params.id);
            res.json({ sucesso: true });
    
            // TODO: Obter o :id da URL
            // TODO: Verificar se o tutor existe (retornar 404 se não)
            // TODO: Excluir o tutor do banco de dados
            // TODO: Retornar confirmação com status 200
        }
}

export default AnimalController;
