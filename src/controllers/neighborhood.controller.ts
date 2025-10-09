import { Request, Response } from 'express';
import NeighborhoodService from '../services/neighborhood.service';
import Logger from '../utils/logger.utils';
import { CustomError } from '../utils/customError.utils';
import { Types } from 'mongoose';

export default class NeighborhoodController {
    private service = new NeighborhoodService();

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const neighborhood = await this.service.create(req.body);
            Logger.logger('Bairro criado com sucesso', 'neighborhood-controller', 'success');
            res.status(201).json({
                status: 'success',
                message: 'Bairro criado com sucesso',
                data: neighborhood
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao criar bairro: ${error.message}`, 'neighborhood-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao criar bairro: ${error.message}`, 'neighborhood-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao criar bairro"
            });
        }
    };

    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }
            const id = new Types.ObjectId(req.params.id);
            const neighborhood = await this.service.findById(id);
            if (!neighborhood) {
                throw new CustomError("Bairro não encontrado", 404);
            }
            res.status(200).json({
                status: "success",
                data: neighborhood
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
                message: "Erro interno do servidor ao buscar bairro"
            });
        }
    };

    findAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const neighborhoods = await this.service.findAll();
            res.status(200).json({
                status: "success",
                data: neighborhoods
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
                message: "Erro interno do servidor ao buscar bairros"
            });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }
            const id = new Types.ObjectId(req.params.id);
            const neighborhood = await this.service.update(id, req.body);
            Logger.logger('Bairro atualizado com sucesso', 'neighborhood-controller', 'success');
            res.status(200).json({
                status: "success",
                message: "Bairro atualizado com sucesso",
                data: neighborhood
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
                message: "Erro interno do servidor ao atualizar bairro"
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
            Logger.logger('Bairro deletado com sucesso', 'neighborhood-controller', 'success');
            res.status(200).json({
                status: "success",
                message: "Bairro deletado com sucesso"
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
                message: "Erro interno do servidor ao deletar bairro"
            });
        }
    };
}
