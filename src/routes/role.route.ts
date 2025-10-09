import { Router } from "express";
import RoleController from "../controllers/role.controller";
import { validateSchema } from "../middlewares/validationHandler.middlewares";
import { createRoleSchema, updateRoleSchema } from "../validations/role.validation";
import { authenticateToken } from "../middlewares/auth.middlewares";

const router = Router();
const controller = new RoleController();
const routePrefix = '/roles';

router.use(authenticateToken);

router.post(routePrefix, validateSchema(createRoleSchema), controller.create);
router.get(routePrefix, controller.findAll);
router.get(`${routePrefix}/:id`, controller.findById);
router.patch(`${routePrefix}/:id`, validateSchema(updateRoleSchema), controller.update);
router.delete(`${routePrefix}/:id`, controller.delete);

export default router;
