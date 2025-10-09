import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { CustomError } from "../utils/customError.utils";

export const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    
    if (!Types.ObjectId.isValid(id)) {
        throw new CustomError("ID inválido", 400);
    }
    
    next();
}; 