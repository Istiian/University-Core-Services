import z from "zod"
import {AppError} from "./app-error"

export const validateRequest = (schema: z.ZodTypeAny) => {
    return (req: any, res: any, next: any) => {
        try {
            schema.parse(req.body)
            next()
        } catch (error) {
            next(new AppError("Invalid input data", 400))
        }
    }
}