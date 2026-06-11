import z from "zod"
import { AppError } from "../utils/AppError"

export const validateRequest = (schema: z.ZodTypeAny) => {
    return (req: any, res: any, next: any) => {
      
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const message = result.error.issues[0]?.message || "Invalid input data";
            return next(new AppError(message, 400));
        }
        req.body = result.data;
        next();
    }
}