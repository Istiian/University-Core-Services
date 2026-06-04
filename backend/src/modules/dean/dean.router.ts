import { Router } from 'express';
import { createDeanHandler, deleteDeanHandler, getDeanByIdHandler, listDeansHandler, updateDeanHandler } from './dean.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterDeanSchema, UpdateDeanSchema } from './dean.validator';
import { hasPermission } from '../../middleware/hasPermission';
const deanRouter = Router();


deanRouter.post('/', hasPermission("personnel:create:any"), validateRequest(RegisterDeanSchema),  createDeanHandler);
deanRouter.get('/', hasPermission("personnel:read:any"), listDeansHandler);
deanRouter.get('/:deanId', hasPermission("personnel:read:any", "personnel:read:self"), getDeanByIdHandler);
deanRouter.put('/:deanId', hasPermission("personnel:update:any"), validateRequest(UpdateDeanSchema), updateDeanHandler);
deanRouter.delete('/:deanId', hasPermission("personnel:delete:any"), deleteDeanHandler);

export default deanRouter;