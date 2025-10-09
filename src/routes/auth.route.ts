import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { loginSchema, refreshTokenSchema } from "../validations/auth.validation";
import { validateSchema } from "../middlewares/validationHandler.middlewares";

const router = Router();
const authController = new AuthController();
const routePrefix = '/auth';

router.post(`${routePrefix}/login`, validateSchema(loginSchema), authController.login);
router.post(`${routePrefix}/refresh-token`, validateSchema(refreshTokenSchema), authController.refreshToken);

export default router;
