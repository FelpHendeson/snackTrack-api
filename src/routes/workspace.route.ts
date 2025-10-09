import { Router } from 'express';
import WorkspaceController from '../controllers/workspace.controller';
import { authenticateToken } from '../middlewares/auth.middlewares';
import { validateSchema } from '../middlewares/validationHandler.middlewares';
import { createWorkspaceSchema, updateWorkspaceSchema, addMemberSchema } from '../validations/workspace.validation';

const router = Router();
const controller = new WorkspaceController();
const routePrefix = '/workspaces';

router.use(authenticateToken);

router.post(routePrefix, validateSchema(createWorkspaceSchema), controller.create);
router.get(routePrefix, controller.findAll);
router.get(`${routePrefix}/:id`, controller.findById);
router.put(`${routePrefix}/:id`, validateSchema(updateWorkspaceSchema), controller.update);
router.delete(`${routePrefix}/:id`, controller.delete);

router.post(`${routePrefix}/:id/members`, validateSchema(addMemberSchema), controller.addMember);
router.delete(`${routePrefix}/:id/members/:userId`, controller.removeMember);

router.get(`${routePrefix}/member/:userId`, controller.findByMemberId);

export default router; 