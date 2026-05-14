import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __currentFilePath = fileURLToPath(import.meta.url);
const __currentDirPath = path.dirname(__currentFilePath);
const PORT = process.env.PORT || 3000;

interface Endereco {
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
}

app.use(express.json());

async function callApi(cep: string): Promise<Endereco> {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json`);
    return response.json();
}

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__currentDirPath, "index.html"));
});

app.get("/:cep", async (req: Request, res: Response) => {
    try {
        const { cep } = req.params;
        const data = await callApi(String(cep));
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
});

export { app }; 

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}\n\nAcesse via: http://localhost:${PORT}`));
};
