import { create, read, update, deleteRecord, getConnection } from '../config/database.js';

class ConsultaModel {

       // Buscar todos os animais
    static async listarTodos() {
        return await read('Consulta');
        // TODO: Implementar a busca de todos os animais
        // Dica: use a função read('animais')
    }

    // Buscar animal por ID
    static async buscarPorId(id) {
        const rows = await read('Consulta', `id = ${id}`);
        return rows[0] || null;
        // TODO: Implementar a busca por ID
        // Dica: use a função read('clientes', `id_cliente = ${id}`)
        //       e retorne apenas o primeiro resultado (rows[0])
    }

    static async buscarEmAberto(status) {
        const rows = await read('Consulta', `status = '${status}'`);
        return rows;
        // TODO: Implementar a busca por ID
        // Dica: use a função read('clientes', `id_cliente = ${id}`)
        //       e retorne apenas o primeiro resultado (rows[0])
    }

    // Criar novo cliente
    static async criar(dados) {
        return await create('Consulta', dados);
        // TODO: Implementar a criação do cliente
        // Dica: use a função create('clientes', dados)
        //       ela retorna o ID do registro inserido
    }

    // Atualizar cliente
    static async atualizar(id, dados) {
        return await update('Consulta', dados, `id = ${id}`);
        // TODO: Implementar a atualização do cliente
        // Dica: use a função update('clientes', dados, `id_cliente = ${id}`)
    }

    // Excluir cliente
    static async excluir(id) {
         return await deleteRecord('Consulta', `id = ${id}`);
        // TODO: Implementar a exclusão do cliente
        // Dica: use a função deleteRecord('clientes', `id_cliente = ${id}`)
    }
}

export default ConsultaModel;
