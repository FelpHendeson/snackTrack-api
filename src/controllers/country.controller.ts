import { Request, Response } from 'express';
import CountryService from '../services/country.service';
import Logger from '../utils/logger.utils';
import { CustomError } from '../utils/customError.utils';
import { Types } from 'mongoose';

export default class CountryController {
    private service = new CountryService();

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const country = await this.service.create(req.body);
            Logger.logger('País criado com sucesso', 'country-controller', 'success');
            res.status(201).json({
                status: 'success',
                message: 'País criado com sucesso',
                data: country
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao criar país: ${error.message}`, 'country-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao criar país: ${error.message}`, 'country-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao criar país"
            });
        }
    };

    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }
            const id = new Types.ObjectId(req.params.id);
            const country = await this.service.findById(id);
            if (!country) {
                throw new CustomError("País não encontrado", 404);
            }
            res.status(200).json({
                status: "success",
                data: country
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
                message: "Erro interno do servidor ao buscar país"
            });
        }
    };

    findAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const countries = await this.service.findAll();
            res.status(200).json({
                status: "success",
                data: countries
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
                message: "Erro interno do servidor ao buscar países"
            });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }
            const id = new Types.ObjectId(req.params.id);
            const country = await this.service.update(id, req.body);
            Logger.logger('País atualizado com sucesso', 'country-controller', 'success');
            res.status(200).json({
                status: "success",
                message: "País atualizado com sucesso",
                data: country
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
                message: "Erro interno do servidor ao atualizar país"
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
            Logger.logger('País deletado com sucesso', 'country-controller', 'success');
            res.status(200).json({
                status: "success",
                message: "País deletado com sucesso"
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
                message: "Erro interno do servidor ao deletar país"
            });
        }
    };
}
