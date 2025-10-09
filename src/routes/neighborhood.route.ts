import { Router } from "express";
import NeighborhoodController from "../controllers/neighborhood.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { validateSchema } from "../middlewares/validationHandler.middlewares";
import { createNeighborhoodSchema, updateNeighborhoodSchema } from "../validations/neighborhood.validation";

const router = Router();
const controller = new NeighborhoodController();
const routePrefix = "/neighborhoods";

router.use(authenticateToken);

router.post(routePrefix, validateSchema(createNeighborhoodSchema), controller.create);
router.get(`${routePrefix}/:id`, controller.findById);
router.get(routePrefix, controller.findAll);
router.put(`${routePrefix}/:id`, validateSchema(updateNeighborhoodSchema), controller.update);
router.delete(`${routePrefix}/:id`, controller.delete);

export default router;
