import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type ValidateTarget = "body" | "query";

export function validate(schema: ZodSchema, target: ValidateTarget = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const error = result.error as ZodError;
      res.status(400).json({
        error: "Validation failed",
        details: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
      });
      return;
    }
    req[target] = result.data;
    next();
  };
}
