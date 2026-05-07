import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Importar rotas
import authRotas from './routes/authRotas.js';
import tutor from './routes/tutorRotas.js';
import animal from './routes/animalRotas.js';
import consulta from './routes/consultaRotas.js';

// Importar middlewares
import { simpleLogMiddleware } from './middlewares/logMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(helmet());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(simpleLogMiddleware);

// Rotas da API
app.use('/auth', authRotas);
app.use('/tutor', tutor);
app.use('/animal', animal);
app.use('/consulta', consulta);

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'OfficeTech API - Sistema de Gestão de Empréstimos',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/api/auth',
            tutor: '/api/tutor',
            animal: '/api/animal',
            consulta: '/api/consulta',
        }
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Rota não encontrada',
        mensagem: `A rota ${req.method} ${req.originalUrl} não foi encontrada`
    });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

export default app;
