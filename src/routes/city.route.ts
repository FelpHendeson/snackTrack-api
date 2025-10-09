import { Router } from "express";
import CityController from "../controllers/city.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { validateSchema } from "../middlewares/validationHandler.middlewares";
import { createCitySchema, updateCitySchema } from "../validations/city.validation";

const router = Router();
const controller = new CityController();
const routePrefix = "/cities";

router.use(authenticateToken);

router.post(routePrefix, validateSchema(createCitySchema), controller.create);
router.get(`${routePrefix}/:id`, controller.findById);
router.get(routePrefix, controller.findAll);
router.put(`${routePrefix}/:id`, validateSchema(updateCitySchema), controller.update);
router.delete(`${routePrefix}/:id`, controller.delete);

export default router;
