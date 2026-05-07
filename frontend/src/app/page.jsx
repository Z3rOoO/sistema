'use client';
import { useState, useEffect } from 'react';

const API = 'http://localhost:3000/auth/login';
const camposVazios = { login: '', senha: '' };

export default function home() {
    const [form, setForm] = useState(camposVazios);
    const [editando, setEditando] = useState(null);


    async function salvar(e) {
        e.preventDefault();
        const url    = editando ? `${API}/${editando}` : API;
        const method = 'POST';
        
        const dados = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        console.log('dados:', dados);
        setForm(camposVazios);
        setEditando(null);
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Exemplo</h1>

            {/* Formulário */}
            <form onSubmit={salvar} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Login"
                    value={form.login}
                    onChange={e => setForm({ ...form, login: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={form.senha}
                    onChange={e => setForm({ ...form, senha: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                        {'Logar'}
                    </button>            
                </div>
            </form>

            
        </div>
    );
}
