import { Router } from "express";
import MovementController from "../controllers/movement.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { validateSchema } from "../middlewares/validationHandler.middlewares";
import { createMovementSchema, updateMovementSchema } from "../validations/movement.validation";

const router = Router();
const controller = new MovementController();
const routePrefix = "/movements";

router.use(authenticateToken);

router.post(routePrefix, validateSchema(createMovementSchema), controller.create);
router.get(`${routePrefix}/workspace`, controller.findAll);
router.get(`${routePrefix}/:id`, controller.findById);
router.put(`${routePrefix}/:id`, validateSchema(updateMovementSchema), controller.update);
router.delete(`${routePrefix}/:id`, controller.delete);

export default router;
