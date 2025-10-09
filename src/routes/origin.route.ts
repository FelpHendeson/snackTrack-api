import { Router } from "express";
import OriginController from "../controllers/origin.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { validateSchema } from "../middlewares/validationHandler.middlewares";
import { createOriginSchema, updateOriginSchema } from "../validations/origin.validation";

const router = Router();
const controller = new OriginController();
const routePrefix = "/origins";

router.use(authenticateToken);

router.post(routePrefix, validateSchema(createOriginSchema), controller.create);
router.get(`${routePrefix}/workspace`, controller.findAll);
router.get(`${routePrefix}/:id`, controller.findById);
router.put(`${routePrefix}/:id`, validateSchema(updateOriginSchema), controller.update);
router.delete(`${routePrefix}/:id`, controller.delete);

export default router;
