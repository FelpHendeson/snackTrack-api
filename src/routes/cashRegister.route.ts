import { Router } from "express";
import CashRegisterController from "../controllers/cashRegister.controller";
import { authenticateToken } from "../middlewares/auth.middlewares";
import { validateSchema } from "../middlewares/validationHandler.middlewares";
import { 
    openCashRegisterSchema,
    closeCashRegisterSchema,
    updateCashRegisterSchema,
    linkMovementsSchema,
    linkCashRefillsSchema,
    autoLinkSchema,
    findAllCashRegistersSchema
} from "../validations/cashRegister.validation";
import { validateObjectId } from "../middlewares/validateObjectId.middleware";

const router = Router();
const controller = new CashRegisterController();
const routePrefix = "/cashregisters";

router.use(authenticateToken);

// Operações básicas
router.post(`${routePrefix}/open`, validateSchema(openCashRegisterSchema), controller.open);
router.post(`${routePrefix}/:id/close`, validateObjectId, validateSchema(closeCashRegisterSchema), controller.close);
router.post(`${routePrefix}/:id/reopen`, validateObjectId, controller.reopen);
router.get(`${routePrefix}/workspace`, validateSchema(findAllCashRegistersSchema), controller.findAll);
router.get(`${routePrefix}/:id`, validateObjectId, controller.findById);
router.put(`${routePrefix}/:id`, validateObjectId, validateSchema(updateCashRegisterSchema), controller.update);
router.delete(`${routePrefix}/:id`, validateObjectId, controller.delete);

// Vinculação de movimentações e reforços
router.post(`${routePrefix}/:id/link-movements`, validateObjectId, validateSchema(linkMovementsSchema), controller.linkMovements);
router.post(`${routePrefix}/:id/link-refills`, validateObjectId, validateSchema(linkCashRefillsSchema), controller.linkCashRefills);

// Adicionar nova rota para auto-link
router.post(`${routePrefix}/:id/auto-link`, validateObjectId, validateSchema(autoLinkSchema), controller.autoLink);

export default router;
