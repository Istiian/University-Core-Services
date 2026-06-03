import { Router } from 'express';
import { createProgramChairHandler, deleteProgramChairHandler, listProgramChairsHandler,getProgramChairByIdHandler, updateProgramChairHandler } from './programChair.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { RegisterProgramChairSchema, UpdateProgramChairSchema } from './programChair.validator';

const programChairRouter = Router();

programChairRouter.post('/', validateRequest(RegisterProgramChairSchema), createProgramChairHandler);
programChairRouter.get('/', listProgramChairsHandler);
programChairRouter.get('/:programChairId', getProgramChairByIdHandler);
programChairRouter.put('/:programChairId', validateRequest(UpdateProgramChairSchema), updateProgramChairHandler);
programChairRouter.delete('/:programChairId', deleteProgramChairHandler);

export default programChairRouter;