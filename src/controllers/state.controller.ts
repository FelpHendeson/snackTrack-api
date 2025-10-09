import { Request, Response } from 'express';
import StateService from '../services/state.service';
import Logger from '../utils/logger.utils';
import { CustomError } from '../utils/customError.utils';
import { Types } from 'mongoose';

export default class StateController {
    private service = new StateService();

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const state = await this.service.create(req.body);
            Logger.logger('Estado criado com sucesso', 'state-controller', 'success');
            res.status(201).json({
                status: 'success',
                message: 'Estado criado com sucesso',
                data: state
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao criar estado: ${error.message}`, 'state-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao criar estado: ${error.message}`, 'state-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao criar estado"
            });
        }
    };

    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }
            const id = new Types.ObjectId(req.params.id);
            const state = await this.service.findById(id);
            if (!state) {
                throw new CustomError("Estado não encontrado", 404);
            }
            res.status(200).json({
                status: "success",
                data: state
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar estado"
            });
        }
    };

    findAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const states = await this.service.findAll();
            res.status(200).json({
                status: "success",
                data: states
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao buscar estados"
            });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }
            const id = new Types.ObjectId(req.params.id);
            const state = await this.service.update(id, req.body);
            Logger.logger('Estado atualizado com sucesso', 'state-controller', 'success');
            res.status(200).json({
                status: "success",
                message: "Estado atualizado com sucesso",
                data: state
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao atualizar estado"
            });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }
            const id = new Types.ObjectId(req.params.id);
            await this.service.delete(id);
            Logger.logger('Estado deletado com sucesso', 'state-controller', 'success');
            res.status(200).json({
                status: "success",
                message: "Estado deletado com sucesso"
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao deletar estado"
            });
        }
    };
}
