import { create, read, update, deleteRecord } from '../config/database.js';

class AnimalModel {

     // Buscar todos os animais
    static async listarTodos() {
        return await read('animal');
        // TODO: Implementar a busca de todos os animais
        // Dica: use a função read('animais')
    }

    // Buscar animal por ID
    static async buscarPorId(id) {
        const rows = await read('animal', `id = ${id}`);
        return rows[0] || null;
        // TODO: Implementar a busca por ID
        // Dica: use a função read('clientes', `id_cliente = ${id}`)
        //       e retorne apenas o primeiro resultado (rows[0])
    }

    // Criar novo cliente
    static async criar(dados) {
        return await create('animal', dados);
        // TODO: Implementar a criação do cliente
        // Dica: use a função create('clientes', dados)
        //       ela retorna o ID do registro inserido
    }

    // Atualizar cliente
    static async atualizar(id, dados) {
        return await update('animal', dados, `id = ${id}`);
        // TODO: Implementar a atualização do cliente
        // Dica: use a função update('clientes', dados, `id_cliente = ${id}`)
    }

    // Excluir cliente
    static async excluir(id) {
         return await deleteRecord('animal', `id = ${id}`);
        // TODO: Implementar a exclusão do cliente
        // Dica: use a função deleteRecord('clientes', `id_cliente = ${id}`)
    }
}

export default AnimalModel;
