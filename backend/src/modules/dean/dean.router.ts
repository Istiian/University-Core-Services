import { Router } from 'express';
import { createDeanHandler, deleteDeanHandler, getDeanByIdHandler, listDeansHandler, updateDeanHandler } from './dean.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterDeanSchema, UpdateDeanSchema } from './dean.validator';

const deanRouter = Router();

deanRouter.post('/', validateRequest(RegisterDeanSchema), createDeanHandler);
deanRouter.get('/', listDeansHandler);
deanRouter.get('/:deanId', getDeanByIdHandler);
deanRouter.put('/:deanId', validateRequest(UpdateDeanSchema), updateDeanHandler);
deanRouter.delete('/:deanId', deleteDeanHandler);

export default deanRouter;