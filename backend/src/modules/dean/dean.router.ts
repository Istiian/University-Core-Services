import { Router } from 'express';
import { createDeanHandler, deleteDeanHandler, getDeanHandler, updateDeanHandler } from './dean.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterDeanSchema, UpdateDeanSchema } from './dean.validator';

const deanRouter = Router();

deanRouter.post('/', validateRequest(RegisterDeanSchema), createDeanHandler);
deanRouter.get('/', getDeanHandler);
deanRouter.put('/:deanId', validateRequest(UpdateDeanSchema), updateDeanHandler);
deanRouter.delete('/:deanId', deleteDeanHandler);

export default deanRouter;