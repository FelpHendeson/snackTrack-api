import { Request, Response, Router } from "express";
import UserController from "../controllers/user.controller";
import { validateSchema } from "../middlewares/validationHandler.middlewares";
import { createUserSchema, updateUserSchema } from "../validations/user.validation";
import { authenticateToken } from "../middlewares/auth.middlewares";

const router = Router();
const routePrefix = '/user';
const userController = new UserController();

router.get(`${routePrefix}/search`, authenticateToken, userController.findBy);
router.get(`${routePrefix}/emailSearch`, authenticateToken, userController.findByEmail);
router.get(`${routePrefix}/:id`, authenticateToken, userController.findById);
router.post(routePrefix, validateSchema(createUserSchema), userController.createUser);
router.patch(`${routePrefix}/:id`, authenticateToken, validateSchema(updateUserSchema), userController.update);
router.delete(`${routePrefix}/:id`, authenticateToken, userController.delete);

export default router;