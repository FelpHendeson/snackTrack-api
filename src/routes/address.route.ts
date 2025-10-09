import { Router } from "express";
import AddressController from "../controllers/address.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { validateSchema } from "../middlewares/validationHandler.middlewares";
import { createAddressSchema, updateAddressSchema } from "../validations/address.validation";

const router = Router();
const controller = new AddressController();
const routePrefix = "/addresses";

router.use(authenticateToken);

router.post(routePrefix, validateSchema(createAddressSchema), controller.create);
router.get(`${routePrefix}/:id`, controller.findById);
router.get(routePrefix, controller.findAll);
router.put(`${routePrefix}/:id`, validateSchema(updateAddressSchema), controller.update);
router.delete(`${routePrefix}/:id`, controller.delete);

export default router;
