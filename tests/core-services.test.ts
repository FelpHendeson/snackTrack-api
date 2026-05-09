import { describe, expect, it, vi } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import AuthService from "../src/services/auth.service";
import WorkspaceService from "../src/services/workspace.service";
import CashRegisterService from "../src/services/cashRegister.service";
import OriginService from "../src/services/origin.service";
import MovementService from "../src/services/movement.service";

const now = new Date("2026-01-01T00:00:00.000Z");

describe("AuthService", () => {
    it("gera access token e refresh token para credenciais validas", async () => {
        const password = "senha-segura";
        const user = {
            _id: new Types.ObjectId(),
            firstName: "Felip",
            lastName: "Hendeson",
            email: "felip@example.com",
            password: await bcrypt.hash(password, 10),
            phone: null,
            address: null,
            isOnline: false,
            isValid: true,
            emailVerifiedAt: null,
            lastWorkspace: null,
            createdAt: now,
            updatedAt: now
        };

        const service = new AuthService() as any;
        service.repository = {
            findByEmail: vi.fn().mockResolvedValue(user)
        };

        const tokens = await service.login({ login: user.email, password });
        const decoded = jwt.decode(tokens.token) as jwt.JwtPayload;

        expect(tokens.token).toEqual(expect.any(String));
        expect(tokens.refreshToken).toEqual(expect.any(String));
        expect(decoded.email).toBe(user.email);
        expect(decoded.id).toBe(String(user._id));
    });

    it("rejeita senha invalida", async () => {
        const user = {
            _id: new Types.ObjectId(),
            firstName: "Felip",
            lastName: "Hendeson",
            email: "felip@example.com",
            password: await bcrypt.hash("senha-certa", 10)
        };

        const service = new AuthService() as any;
        service.repository = {
            findByEmail: vi.fn().mockResolvedValue(user)
        };

        await expect(service.login({ login: user.email, password: "senha-errada" }))
            .rejects
            .toMatchObject({ statusCode: 400 });
    });
});

describe("WorkspaceService", () => {
    it("cria workspace com o usuario autenticado como Owner", async () => {
        const userId = new Types.ObjectId();
        const roleId = new Types.ObjectId();
        const service = new WorkspaceService() as any;

        service.roleService = {
            findRoleBy: vi.fn().mockResolvedValue([{ _id: roleId, name: "Owner" }])
        };
        service.repository = {
            create: vi.fn().mockImplementation(async (data) => ({
                _id: new Types.ObjectId(),
                ...data,
                createdAt: now,
                updatedAt: now
            }))
        };

        const workspace = await service.createWorkspace("SnackTrack Loja", userId);

        expect(service.roleService.findRoleBy).toHaveBeenCalledWith({ name: "Owner" });
        expect(service.repository.create).toHaveBeenCalledWith({
            name: "SnackTrack Loja",
            members: [{
                user: userId,
                role: roleId,
                addedAt: expect.any(Date)
            }]
        });
        expect(workspace.members[0].user).toBe(userId);
        expect(workspace.members[0].role).toBe(roleId);
    });

    it("cria a role Owner padrao quando ela ainda nao existe", async () => {
        const userId = new Types.ObjectId();
        const roleId = new Types.ObjectId();
        const service = new WorkspaceService() as any;
        service.roleService = {
            findRoleBy: vi.fn().mockResolvedValue([]),
            createRole: vi.fn().mockResolvedValue({ _id: roleId, name: "Owner" })
        };
        service.repository = {
            create: vi.fn().mockImplementation(async (data) => ({
                _id: new Types.ObjectId(),
                ...data,
                createdAt: now,
                updatedAt: now
            }))
        };

        const workspace = await service.createWorkspace("SnackTrack Loja", userId);

        expect(service.roleService.createRole).toHaveBeenCalledWith({
            name: "Owner",
            modules: ["entradas", "saidas", "relatoriosfinanceiros"],
            permissions: ["create", "read", "update", "delete"],
            description: "Dono/Criador do Workspace"
        });
        expect(workspace.members[0].role).toBe(roleId);
    });
});

describe("OriginService", () => {
    it("rejeita origem com tipo diferente de entrada ou saida", async () => {
        const service = new OriginService() as any;
        service.repository = {
            create: vi.fn()
        };

        await expect(service.create({
            name: "Pix",
            description: "Origem para registros de entrada via Pix",
            type: "cartao",
            workspaceId: new Types.ObjectId()
        } as any, new Types.ObjectId()))
            .rejects
            .toMatchObject({ statusCode: 400 });

        expect(service.repository.create).not.toHaveBeenCalled();
    });
});

describe("MovementService", () => {
    it("rejeita movimentacao quando a origem tem tipo diferente", async () => {
        const workspaceId = new Types.ObjectId();
        const originId = new Types.ObjectId();
        const service = new MovementService() as any;

        service.originRepository = {
            findById: vi.fn().mockResolvedValue({
                _id: originId,
                name: "Pix",
                type: "entrada",
                workspaceId
            })
        };
        service.repository = {
            create: vi.fn()
        };

        await expect(service.create({
            workspaceId,
            originId,
            type: "saida",
            value: 10,
            date: now
        } as any, new Types.ObjectId()))
            .rejects
            .toMatchObject({ statusCode: 400 });

        expect(service.repository.create).not.toHaveBeenCalled();
    });

    it("rejeita movimentacao quando a origem pertence a outro workspace", async () => {
        const workspaceId = new Types.ObjectId();
        const originId = new Types.ObjectId();
        const service = new MovementService() as any;

        service.originRepository = {
            findById: vi.fn().mockResolvedValue({
                _id: originId,
                name: "Pix",
                type: "entrada",
                workspaceId: new Types.ObjectId()
            })
        };
        service.repository = {
            create: vi.fn()
        };

        await expect(service.create({
            workspaceId,
            originId,
            type: "entrada",
            value: 10,
            date: now
        } as any, new Types.ObjectId()))
            .rejects
            .toMatchObject({ statusCode: 400 });

        expect(service.repository.create).not.toHaveBeenCalled();
    });
});

describe("CashRegisterService", () => {
    it("abre caixa inicializando saldo, valor final e status", async () => {
        const workspaceId = new Types.ObjectId();
        const userId = new Types.ObjectId();
        const service = new CashRegisterService() as any;

        service.repository = {
            create: vi.fn().mockImplementation(async (data) => ({
                _id: new Types.ObjectId(),
                ...data,
                movements: [],
                refills: [],
                createdAt: now,
                updatedAt: now
            }))
        };

        const result = await service.open({
            workspaceId,
            openingDate: now,
            initialValue: 100,
            createdBy: userId
        });

        expect(service.repository.create).toHaveBeenCalledWith({
            workspaceId,
            openingDate: now,
            initialValue: 100,
            createdBy: userId,
            status: "open",
            finalValue: 100,
            balance: 100
        });
        expect(result.status).toBe("open");
        expect(result.balance).toBe(100);
        expect(result.finalValue).toBe(100);
    });

    it("nao fecha caixa que ja esta fechado", async () => {
        const cashRegisterId = new Types.ObjectId();
        const service = new CashRegisterService() as any;

        service.repository = {
            findById: vi.fn().mockResolvedValue({
                _id: cashRegisterId,
                status: "closed",
                movements: [],
                refills: []
            }),
            close: vi.fn()
        };

        await expect(service.close(cashRegisterId, new Types.ObjectId()))
            .rejects
            .toMatchObject({ statusCode: 400 });
        expect(service.repository.close).not.toHaveBeenCalled();
    });
});
