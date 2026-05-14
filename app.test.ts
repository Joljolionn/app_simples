import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import request from "supertest";
import { app } from "./app.js"; 

(global as any).fetch = jest.fn();

describe("Testes do Servidor de CEP", () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    it("Deve retornar o arquivo index.html na rota raiz", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toContain("<!doctype html>");
    });

    it("Deve retornar os dados do CEP corretamente", async () => {
        const mockEndereco = {
            cep: "01001-000",
            logradouro: "Praça da Sé",
            bairro: "Sé",
            localidade: "São Paulo",
            uf: "SP",
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockEndereco,
        } as never);

        const response = await request(app).get("/01001000");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEndereco);
    });

    it("Deve retornar status 500 se a API externa falhar", async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(
            new Error("Network Error") as never,
        );

        const response = await request(app).get("/00000000");

        expect(response.status).toBe(500); 
    });
});
