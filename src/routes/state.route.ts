import { Router } from "express";
import StateController from "../controllers/state.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { validateSchema } from "../middlewares/validationHandler.middlewares";
import { createStateSchema, updateStateSchema } from "../validations/state.validation";

const router = Router();
const controller = new StateController();
const routePrefix = "/states";

router.use(authenticateToken);

router.post(routePrefix, validateSchema(createStateSchema), controller.create);
router.get(`${routePrefix}/:id`, controller.findById);
router.get(routePrefix, controller.findAll);
router.put(`${routePrefix}/:id`, validateSchema(updateStateSchema), controller.update);
router.delete(`${routePrefix}/:id`, controller.delete);

export default router;
