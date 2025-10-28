import { Types } from "mongoose";
import { IAddressOutput } from "../interfaces/IAddress.interface";
import { IUserInput, IUserOutput, IUserSearchParams } from "../interfaces/IUser.interfaces";
import AddressRepository from "../repositories/address.repository";
import UserRepository from "../repositories/user.repository";
import { CustomError } from "../utils/customError.utils";
import { PasswordHash } from "../utils/password.utils";

export default class UserService {
    private repository = new UserRepository();
    private addressRepository = new AddressRepository();

    async createUser(data: IUserInput): Promise<IUserOutput> 
    {
        try 
        {
            const { address: addressInput, ...userPayload } = data;

            const address: IAddressOutput | null = addressInput
                ? await this.addressRepository.create(addressInput)
                : null;

            const hashedPassword = await PasswordHash.hash(data.password);
            const userData = {
                ...userPayload,
                password: hashedPassword
            } as IUserInput;

            const createdUser = await this.repository.create(userData, address?._id ?? null);

            const userOutput: IUserOutput = {
                ...createdUser,
                address: address,
                phone: createdUser.phone ?? null,
                isOnline: createdUser.isOnline || false,
                isValid: createdUser.isValid || false,
                emailVerifiedAt: createdUser.emailVerifiedAt || null,
            };

            return userOutput;
        } 
        catch (error: any) 
        {
            if (error instanceof Error && error.message.includes("E11000")) {
                throw new CustomError("E-mail já cadastrado", 400);
            }
            throw new CustomError("Erro ao criar usuário", 500);
        }
    }

    async findUserById(id: Types.ObjectId): Promise<IUserOutput | null> {
        try {
            return await this.repository.findById(id);
        } catch (error) {
            throw new CustomError("Erro ao buscar usuário", 500);
            
        }
    }

    async findUserByEmail(email: string): Promise<IUserOutput | null> {
        try {
            return await this.repository.findByEmail(email);
        } catch (error: any) {
            throw new CustomError("Erro ao buscar usuário", 500);
        }
    }

    async findUserBy(data: IUserSearchParams): Promise<IUserOutput | IUserOutput[] | null> {
        try {
            const query = Object.entries(data).reduce((index, [key, value]) => {
                if (value) {
                    if (key === 'phoneNumber') {
                        index[key] = value;
                    } else {
                        index[key] = { $regex: value, $options: 'i' };
                    }
                }
                return index;
            }, {} as Record<string, any>);

            return await this.repository.findBy(query);
        } catch (error: any) {
            throw new CustomError("Erro ao buscar usuário", 500);
        }
    }

    async updateUser(id: Types.ObjectId, data: Partial<IUserInput>): Promise<IUserOutput | null> {
        try {
            return await this.repository.update(id, data);
        } catch (error: any) {
            throw new CustomError(`Erro ao atualizar usuário`, 500);
        }
    }

    async deleteUser(id: Types.ObjectId): Promise<IUserOutput | null> {
        try {
            return await this.repository.delete(id);
        } catch (error: any) {
            throw  new CustomError('Erro ao deletar usuário', 500);
        }
    }

    async updateLastWorkspace(userId: Types.ObjectId, workspaceId: Types.ObjectId): Promise<IUserOutput | null> {
        try {
            const user = await this.repository.update(userId, { lastWorkspace: workspaceId });
            if (!user) {
                throw new CustomError('Usuário não encontrado', 404);
            }
            return user;
        } catch (error: any) {
            throw new CustomError(`Erro ao atualizar último workspace: ${error.message}`, error.statusCode || 500);
        }
    }

};