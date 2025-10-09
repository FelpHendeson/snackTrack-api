import { Request } from "express";
import { ITokenPayload } from "./ITokenPayload.interfaces";

export interface ICustomRequest extends Request {
    user?: ITokenPayload;
};