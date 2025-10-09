import { Request, Response } from 'express';
import CityService from '../services/city.service';
import Logger from '../utils/logger.utils';
import { CustomError } from '../utils/customError.utils';
import { Types } from 'mongoose';

export default class CityController {
    private service = new CityService();

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const city = await this.service.create(req.body);
            Logger.logger('Cidade criada com sucesso', 'city-controller', 'success');
            res.status(201).json({
                status: 'success',
                message: 'Cidade criada com sucesso',
                data: city
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao criar cidade: ${error.message}`, 'city-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao criar cidade: ${error.message}`, 'city-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao criar cidade"
            });
        }
    };

    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }
            const id = new Types.ObjectId(req.params.id);
            const city = await this.service.findById(id);
            if (!city) {
                throw new CustomError("Cidade não encontrada", 404);
            }
            res.status(200).json({
                status: "success",
                data: city
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
                message: "Erro interno do servidor ao buscar cidade"
            });
        }
    };

    findAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const cities = await this.service.findAll();
            res.status(200).json({
                status: "success",
                data: cities
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
                message: "Erro interno do servidor ao buscar cidades"
            });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }
            const id = new Types.ObjectId(req.params.id);
            const city = await this.service.update(id, req.body);
            Logger.logger('Cidade atualizada com sucesso', 'city-controller', 'success');
            res.status(200).json({
                status: "success",
                message: "Cidade atualizada com sucesso",
                data: city
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
                message: "Erro interno do servidor ao atualizar cidade"
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
            Logger.logger('Cidade deletada com sucesso', 'city-controller', 'success');
            res.status(200).json({
                status: "success",
                message: "Cidade deletada com sucesso"
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
                message: "Erro interno do servidor ao deletar cidade"
            });
        }
    };
}
