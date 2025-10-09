import { Request, Response } from 'express';
import AddressService from '../services/address.service';
import Logger from '../utils/logger.utils';
import { CustomError } from '../utils/customError.utils';
import { Types } from 'mongoose';

export default class AddressController {
    private service = new AddressService();

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const address = await this.service.create(req.body);
            Logger.logger('Endereço criado com sucesso', 'address-controller', 'success');
            res.status(201).json({
                status: 'success',
                message: 'Endereço criado com sucesso',
                data: address
            });
        } catch (error: any) {
            if (error instanceof CustomError) {
                Logger.logger(`Erro ao criar endereço: ${error.message}`, 'address-controller', 'error');
                res.status(error.statusCode).json({
                    status: "error",
                    message: error.message
                });
                return;
            }
            Logger.logger(`Erro interno do servidor ao criar endereço: ${error.message}`, 'address-controller', 'error');
            res.status(500).json({
                status: "error",
                message: "Erro interno do servidor ao criar endereço"
            });
        }
    };

    findById = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }
            const id = new Types.ObjectId(req.params.id);
            const address = await this.service.findById(id);
            if (!address) {
                throw new CustomError("Endereço não encontrado", 404);
            }
            res.status(200).json({
                status: "success",
                data: address
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
                message: "Erro interno do servidor ao buscar endereço"
            });
        }
    };

    findAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const addresses = await this.service.findAll();
            res.status(200).json({
                status: "success",
                data: addresses
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
                message: "Erro interno do servidor ao buscar endereços"
            });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!Types.ObjectId.isValid(req.params.id)) {
                throw new CustomError("ID inválido", 400);
            }
            const id = new Types.ObjectId(req.params.id);
            const address = await this.service.update(id, req.body);
            Logger.logger('Endereço atualizado com sucesso', 'address-controller', 'success');
            res.status(200).json({
                status: "success",
                message: "Endereço atualizado com sucesso",
                data: address
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
                message: "Erro interno do servidor ao atualizar endereço"
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
            Logger.logger('Endereço deletado com sucesso', 'address-controller', 'success');
            res.status(200).json({
                status: "success",
                message: "Endereço deletado com sucesso"
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
                message: "Erro interno do servidor ao deletar endereço"
            });
        }
    };
}
