import { Router } from "express";
import CashRefillController from "../controllers/cashRefill.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { validateSchema } from "../middlewares/validationHandler.middlewares";
import { createCashRefillSchema, updateCashRefillSchema } from "../validations/cashRefill.validation";

const router = Router();
const controller = new CashRefillController();
const routePrefix = "/cashrefills";

router.use(authenticateToken);

router.post(routePrefix, validateSchema(createCashRefillSchema), controller.create);
router.get(`${routePrefix}/workspace`, controller.findAll);
router.get(`${routePrefix}/:id`, controller.findById);
router.put(`${routePrefix}/:id`, validateSchema(updateCashRefillSchema), controller.update);
router.delete(`${routePrefix}/:id`, controller.delete);

export default router;
