import { Router } from "express";
import CountryController from "../controllers/country.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { validateSchema } from "../middlewares/validationHandler.middlewares";
import { createCountrySchema, updateCountrySchema } from "../validations/country.validation";

const router = Router();
const controller = new CountryController();
const routePrefix = "/countries";

router.use(authenticateToken);

router.post(routePrefix, validateSchema(createCountrySchema), controller.create);
router.get(`${routePrefix}/:id`, controller.findById);
router.get(routePrefix, controller.findAll);
router.put(`${routePrefix}/:id`, validateSchema(updateCountrySchema), controller.update);
router.delete(`${routePrefix}/:id`, controller.delete);

export default router;
